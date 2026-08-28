"use client";

// Composants video partages entre les pages Creator et Filmmaker :
// mockups telephone/tablette, carrousel desktop, pile 3D mobile,
// bouton son global (une seule video audible a la fois) et overlay
// de mise en avant au clic. Inclure SHOWCASE_CSS dans le <style> de
// chaque page qui les utilise.

import { useRef, useState, useEffect, useCallback } from "react";
import type { Clip } from "../creator/constants";

export type Sound = {
  unmutedKey: string | null;
  toggleSound: (key: string) => void;
  registerRef: (key: string, el: HTMLVideoElement | null) => void;
  openFocus: (clip: Clip, kind: "phone" | "tablet") => void;
};

export type Focused = { clip: Clip; kind: "phone" | "tablet" };

// Durée affichée sous chaque clip. Lue côté client sur l'évènement
// loadedmetadata du <video> plutôt que précalculée au build : aucune
// dépendance à ffprobe, et une vidéo ajoutée plus tard affiche sa durée
// toute seule.
//
// Pourquoi l'afficher : un 15 secondes annoncé se lit comme un format court
// choisi ; le même clip sans indication, dans une page qui parle de films,
// se lit comme un film raté.
function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return "";
  const m = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return m > 0 ? `${m}:${String(sec).padStart(2, "0")}` : `${sec}s`;
}

function ClipMeta({ label, duration }: { label?: string; duration: number | null }) {
  const d = duration ? formatDuration(duration) : "";
  if (!label && !d) return null;
  return (
    <span className="vid-label">
      {label}
      {label && d ? <span className="vid-dur">{d}</span> : d}
    </span>
  );
}

// Etat son + mise en avant, partage par tous les carrousels d'une page.
export function useVideoSound() {
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [unmutedKey, setUnmutedKey] = useState<string | null>(null);
  const [focused, setFocused] = useState<Focused | null>(null);

  const registerRef = useCallback((key: string, el: HTMLVideoElement | null) => {
    if (el) videoRefs.current.set(key, el);
    else videoRefs.current.delete(key);
  }, []);

  const toggleSound = useCallback((key: string) => {
    setUnmutedKey((prev) => {
      const next = prev === key ? null : key;
      videoRefs.current.forEach((v, k) => {
        if (v) v.muted = next === null || k !== next;
      });
      return next;
    });
  }, []);

  const openFocus = useCallback((clip: Clip, kind: "phone" | "tablet") => {
    setFocused({ clip, kind });
  }, []);

  const closeFocus = useCallback(() => setFocused(null), []);

  const sound: Sound = { unmutedKey, toggleSound, registerRef, openFocus };
  return { sound, focused, closeFocus };
}

export function SoundBtn({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      className="vid-sound"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={on ? "Mute video" : "Unmute video"}
    >
      {on ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </svg>
      )}
    </button>
  );
}

function Mock({ clip, cardKey, kind, sound, badge }: { clip: Clip; cardKey: string; kind: "phone" | "tablet"; sound: Sound; badge?: string }) {
  const [duration, setDuration] = useState<number | null>(null);
  const video = (
    <video
      ref={(el) => sound.registerRef(cardKey, el)}
      src={clip.src}
      poster={clip.poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      controlsList="nodownload nofullscreen"
      onContextMenu={(e) => e.preventDefault()}
      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      title={`Creator content: ${clip.label}`}
    />
  );
  const btn = <SoundBtn on={sound.unmutedKey === cardKey} onClick={() => sound.toggleSound(cardKey)} />;
  const badgeEl = badge && <span className="vid-badge">{badge}</span>;

  return (
    <div className="slide">
      {kind === "tablet" ? (
        <div className="tablet focusable" onClick={() => sound.openFocus(clip, kind)}>
          <div className="tablet-screen">
            {video}
            {btn}
            {badgeEl}
          </div>
        </div>
      ) : (
        <div className="phone focusable" onClick={() => sound.openFocus(clip, kind)}>
          {video}
          {btn}
          {badgeEl}
        </div>
      )}
      <ClipMeta label={clip.label} duration={duration} />
    </div>
  );
}

// Pile 3D facon coverflow, un item centre, voisins en biais, swipe au doigt.
// Utilisee sur mobile (tactile). Un seul item joue a la fois.
function MobileStack({ clips, kind, prefix, sound, badge }: { clips: Clip[]; kind: "phone" | "tablet"; prefix: string; sound: Sound; badge?: string }) {
  const [active, setActive] = useState(0);
  const startX = useRef(0);
  const localRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const [durations, setDurations] = useState<Record<number, number>>({});
  const n = clips.length;

  useEffect(() => {
    localRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  function onTouchEnd(e: React.TouchEvent) {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40 && n > 1) {
      setActive((a) => (diff > 0 ? (a + 1) % n : (a - 1 + n) % n));
    }
  }

  function posClass(i: number) {
    if (i === active) return "pos-active";
    if (n > 1 && i === (active + 1) % n) return "pos-next";
    if (n > 2 && i === (active - 1 + n) % n) return "pos-prev";
    return "pos-hidden";
  }

  return (
    <div
      className={`stack stack--${kind}`}
      onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
      onTouchEnd={onTouchEnd}
    >
      {clips.map((clip, i) => {
        const key = `${prefix}-${i}`;
        const duration = durations[i] ?? null;
        const video = (
          <video
            ref={(el) => {
              if (el) localRefs.current.set(i, el);
              else localRefs.current.delete(i);
              sound.registerRef(key, el);
            }}
            src={clip.src}
            poster={clip.poster}
            autoPlay={i === active}
            muted
            loop
            playsInline
            preload="metadata"
            controlsList="nodownload nofullscreen"
            onContextMenu={(e) => e.preventDefault()}
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration;
              setDurations((prev) => (prev[i] === d ? prev : { ...prev, [i]: d }));
            }}
            title={`Creator content: ${clip.label}`}
          />
        );
        const btn = <SoundBtn on={sound.unmutedKey === key} onClick={() => sound.toggleSound(key)} />;
        const badgeEl = badge && <span className="vid-badge">{badge}</span>;
        return (
          <div key={key} className={`stack-card ${posClass(i)}`}>
            {kind === "tablet" ? (
              <div className="tablet focusable" onClick={() => sound.openFocus(clip, kind)}><div className="tablet-screen">{video}{btn}{badgeEl}</div></div>
            ) : (
              <div className="phone focusable" onClick={() => sound.openFocus(clip, kind)}>{video}{btn}{badgeEl}</div>
            )}
            {i === active && <ClipMeta label={clip.label} duration={duration} />}
          </div>
        );
      })}
    </div>
  );
}

export function Carousel({ clips, kind, prefix, sound, badge }: { clips: Clip[]; kind: "phone" | "tablet"; prefix: string; sound: Sound; badge?: string }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [overflow, setOverflow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const el = trackRef.current;
    if (!el) return;
    const check = () => setOverflow(el.scrollWidth > el.clientWidth + 4);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [clips.length, isMobile]);

  function scroll(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector(".slide") as HTMLElement | null;
    const step = first ? first.offsetWidth + 16 : 280;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  // Mobile : pile 3D tactile. Desktop : rangee avec fleches.
  if (isMobile) {
    return <MobileStack clips={clips} kind={kind} prefix={prefix} sound={sound} badge={badge} />;
  }

  return (
    <div className={`carousel carousel--${kind}`}>
      {overflow && (
        <button className="carousel-arrow carousel-arrow--prev" onClick={() => scroll(-1)} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      )}
      <div className={`carousel-track${overflow ? "" : " carousel-track--center"}`} ref={trackRef}>
        {clips.map((clip, i) => (
          <Mock key={`${prefix}-${i}`} clip={clip} cardKey={`${prefix}-${i}`} kind={kind} sound={sound} badge={badge} />
        ))}
      </div>
      {overflow && (
        <button className="carousel-arrow carousel-arrow--next" onClick={() => scroll(1)} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      )}
    </div>
  );
}

// Mise en avant : clic sur un device, il s'agrandit et passe devant.
export function FocusOverlay({ clip, kind, onClose }: { clip: Clip; kind: "phone" | "tablet"; onClose: () => void }) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const video = (
    <video
      src={clip.src}
      poster={clip.poster}
      autoPlay
      muted={muted}
      loop
      playsInline
      controlsList="nodownload nofullscreen"
      onContextMenu={(e) => e.preventDefault()}
      title={`Creator content: ${clip.label}`}
    />
  );
  const btn = (
    <button
      className="vid-sound"
      onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}
      aria-label={muted ? "Unmute video" : "Mute video"}
    >
      {!muted ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
      )}
    </button>
  );

  return (
    <div className="focus-overlay" onClick={onClose}>
      <div className="focus-inner" onClick={(e) => e.stopPropagation()}>
        <button className="focus-close" onClick={onClose} aria-label="Close">&times;</button>
        {kind === "tablet" ? (
          <div className="tablet focus-tablet"><div className="tablet-screen">{video}{btn}</div></div>
        ) : (
          <div className="phone focus-phone">{video}{btn}</div>
        )}
        {clip.label && <span className="focus-label">{clip.label}</span>}
      </div>
    </div>
  );
}

// Styles des composants ci-dessus. A interpoler dans le <style> de chaque
// page qui les utilise.
export const SHOWCASE_CSS = `
  /* Carrousel commun */
  .carousel { position: relative; max-width: 1100px; margin: 0 auto; padding: 0 8px; }
  .carousel-track {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 4px 4px 8px;
  }
  .carousel-track::-webkit-scrollbar { display: none; }
  .carousel-track--center { justify-content: center; }
  .slide {
    flex: 0 0 auto;
    scroll-snap-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .carousel--phone .slide { width: 160px; }
  .carousel--tablet .slide { width: 380px; }

  .carousel-arrow {
    position: absolute;
    top: 45%;
    transform: translateY(-50%);
    z-index: 5;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid #e5e5e5;
    background: #ffffff;
    color: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 1px 6px rgba(0,0,0,0.08);
    transition: background 0.2s, border-color 0.2s;
  }
  .carousel-arrow:hover { background: #0a0a0a; color: #ffffff; border-color: #0a0a0a; }
  .carousel-arrow--prev { left: -6px; }
  .carousel-arrow--next { right: -6px; }

  /* Pile 3D (mobile, tactile) */
  .stack {
    position: relative;
    width: 100%;
    margin: 0 auto;
    perspective: 1100px;
    overflow: hidden;
    touch-action: pan-y;
  }
  .stack--phone { height: 420px; }
  .stack--tablet { height: 270px; }
  .stack-card {
    position: absolute;
    left: 50%;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    transform-origin: center center;
    transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.45s;
  }
  .stack--phone .stack-card { width: 210px; margin-left: -105px; }
  .stack--tablet .stack-card { width: 380px; margin-left: -190px; }
  .stack-card.pos-active { transform: translateX(0) scale(1) rotateY(0deg); opacity: 1; z-index: 20; }
  .stack-card.pos-next { transform: translateX(118px) scale(0.84) rotateY(-12deg); opacity: 0.45; z-index: 9; }
  .stack-card.pos-prev { transform: translateX(-118px) scale(0.84) rotateY(12deg); opacity: 0.45; z-index: 9; }
  .stack-card.pos-hidden { transform: scale(0.7); opacity: 0; z-index: 0; pointer-events: none; }
  .stack--tablet .stack-card.pos-next { transform: translateX(180px) scale(0.82) rotateY(-12deg); }
  .stack--tablet .stack-card.pos-prev { transform: translateX(-180px) scale(0.82) rotateY(12deg); }

  /* Telephone 9:16 */
  .phone {
    width: 100%;
    aspect-ratio: 9 / 16;
    border: 2px solid #0a0a0a;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    background: #1a1a1a;
  }
  .phone::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 4px;
    background: #333;
    border-radius: 2px;
    z-index: 2;
  }
  .phone video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }

  /* Tablette 16:9 */
  .tablet {
    width: 100%;
    border: 2px solid #0a0a0a;
    border-radius: 16px;
    padding: 8px 12px;
    background: #1a1a1a;
    position: relative;
  }
  .tablet::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #333;
    z-index: 2;
  }
  .tablet-screen { aspect-ratio: 16 / 9; border-radius: 6px; overflow: hidden; background: #000; position: relative; }
  .tablet-screen video { width: 100%; height: 100%; object-fit: cover; display: block; }

  .vid-label { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #666666; text-align: center; }
  .vid-dur { margin-left: 8px; color: #b3aca2; }

  /* Bouton son */
  .vid-sound {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 3;
    background: rgba(0,0,0,0.45);
    border: none;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    backdrop-filter: blur(4px);
    transition: background 0.2s;
  }
  .vid-sound:hover { background: rgba(0,0,0,0.7); }

  /* Petit badge de stat, coin oppose au bouton son */
  .vid-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 3;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(4px);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 3px 8px;
    border-radius: 20px;
  }

  /* Clic pour agrandir : device cliquable + overlay de mise en avant */
  .focusable { cursor: pointer; transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .focusable:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(0,0,0,0.18); }
  .focus-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0,0,0,0.72);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px;
    animation: focusFade 0.2s ease;
  }
  @keyframes focusFade { from { opacity: 0; } to { opacity: 1; } }
  .focus-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    animation: focusPop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes focusPop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .focus-phone { width: min(72vw, 300px); box-shadow: 0 24px 70px rgba(0,0,0,0.55); }
  .focus-tablet { width: min(94vw, 900px); box-shadow: 0 24px 70px rgba(0,0,0,0.55); }
  .focus-label { color: rgba(255,255,255,0.85); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; }
  .focus-close {
    position: absolute;
    top: -38px;
    right: 0;
    background: none;
    border: none;
    color: #ffffff;
    font-size: 30px;
    line-height: 1;
    cursor: pointer;
    opacity: 0.85;
  }
  .focus-close:hover { opacity: 1; }

  @media (max-width: 767px) {
    .carousel { padding: 0; }
    /* Mobile : slider tactile, un item centre a la fois, swipe au doigt */
    .carousel--phone .slide { width: 62vw; max-width: 240px; }
    .carousel--tablet .slide { width: 92vw; max-width: 400px; }
    .carousel-track { gap: 12px; }
    .carousel-arrow { display: none; }
    .phone { border-width: 1.5px; }
    .phone::before { width: 26px; height: 3px; }
  }
`;
