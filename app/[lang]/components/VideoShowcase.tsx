"use client";

// Composants video partages entre les pages Creator et Filmmaker :
// mockups telephone/tablette, carrousel desktop, pile 3D mobile,
// bouton son global (une seule video audible a la fois) et overlay
// de mise en avant au clic. Inclure SHOWCASE_CSS dans le <style> de
// chaque page qui les utilise.

import { useRef, useState, useEffect, useCallback } from "react";
import type { Clip } from "../creator/constants";
import Caption from "./editorial/Caption";

export type Sound = {
  unmutedKey: string | null;
  toggleSound: (key: string) => void;
  registerRef: (key: string, el: HTMLVideoElement | null) => void;
  openFocus: (clip: Clip, kind: "phone" | "tablet") => void;
};

export type Focused = { clip: Clip; kind: "phone" | "tablet" };

// Le titre sous chaque clip. La durée y a été affichée le 28/08 puis retirée
// le jour même : un chiffre collé sous une image salit la légende. La
// longueur des films se dit dans les formules, pas sur les vignettes.
function ClipMeta({ label, clip }: { label?: string; clip?: Clip }) {
  if (clip && (clip.brand || clip.project || clip.kind)) {
    return (
      <Caption
        title={clip.brand ?? label ?? ""}
        sub={clip.project}
        note={clip.kind}
      />
    );
  }
  if (!label) return null;
  return <span className="vid-label">{label}</span>;
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

export function PhoneMockup(props: { clip: Clip; cardKey: string; sound: Sound; badge?: string }) {
  return <Mock {...props} kind="phone" />;
}

function Mock({ clip, cardKey, kind, sound, badge }: { clip: Clip; cardKey: string; kind: "phone" | "tablet"; sound: Sound; badge?: string }) {
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
      title={`Creator content: ${clip.label}`}
    />
  );
  const btn = <SoundBtn on={sound.unmutedKey === cardKey} onClick={() => sound.toggleSound(cardKey)} />;
  const badgeEl = badge && <span className="vid-badge">{badge}</span>;

  return (
    <div className="slide" data-clip={cardKey}>
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
      <ClipMeta label={clip.label} clip={clip} />
    </div>
  );
}

// Pile 3D facon coverflow, un item centre, voisins en biais, swipe au doigt.
// Utilisee sur mobile (tactile). Un seul item joue a la fois.
function MobileStack({ clips, kind, prefix, sound, badge }: { clips: Clip[]; kind: "phone" | "tablet"; prefix: string; sound: Sound; badge?: string }) {
  const [active, setActive] = useState(0);
  const startX = useRef(0);
  const localRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
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
            title={`Creator content: ${clip.label}`}
          />
        );
        const btn = <SoundBtn on={sound.unmutedKey === key} onClick={() => sound.toggleSound(key)} />;
        const badgeEl = badge && <span className="vid-badge">{badge}</span>;
        return (
          <div key={key} className={`stack-card ${posClass(i)}`} data-clip={key}>
            {kind === "tablet" ? (
              <div className="tablet focusable" onClick={() => sound.openFocus(clip, kind)}><div className="tablet-screen">{video}{btn}{badgeEl}</div></div>
            ) : (
              <div className="phone focusable" onClick={() => sound.openFocus(clip, kind)}>{video}{btn}{badgeEl}</div>
            )}
            {i === active && <ClipMeta label={clip.label} clip={clip} />}
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

// Les styles vivent dans components/showcase.css, chargé par le layout.
// Export conservé vide pour les pages qui l'interpolaient encore.
export const SHOWCASE_CSS = "";
