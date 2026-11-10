"use client";

// Composants video partages entre les pages Creator et Filmmaker :
// mockups telephone/tablette, carrousel desktop, pile 3D mobile,
// bouton son global (une seule video audible a la fois) et overlay
// de mise en avant au clic. Inclure SHOWCASE_CSS dans le <style> de
// chaque page qui les utilise.

import { useRef, useState, useEffect, useCallback } from "react";
import type { Clip } from "../creator/constants";
import Caption from "./editorial/Caption";
import { videoUrl } from "@/lib/video-url";

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
  if (clip?.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={clip.logoTall ? "clip-logo clip-logo--tall" : "clip-logo"} src={clip.logo} alt={clip.brand ?? label ?? ""} />;
  }
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
      src={videoUrl(clip.src)}
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

// Tas par marque (10/11, page Social) : les vidéos d'une même marque se
// rangent en un tas, le téléphone du dessus joue, deux autres dépassent
// derrière. Un clic fait passer la carte suivante devant, comme un jeu de
// cartes qu'on feuillette (Sandrine, 10/11 : d'abord un tas qui s'étalait,
// remplacé le jour même). Pas de nombre sous le tas : seulement son logo.
type Group = { key: string; clips: Clip[] };

function groupClips(clips: Clip[], by: (c: Clip) => string): Group[] {
  const groups: Group[] = [];
  for (const c of clips) {
    const key = by(c);
    const g = groups.find((x) => x.key === key);
    if (g) g.clips.push(c);
    else groups.push({ key, clips: [c] });
  }
  return groups;
}

function BrandStack({ group, cardKey, sound, label }: { group: Group; cardKey: string; sound: Sound; label: string }) {
  const [top, setTop] = useState(0);
  const [moving, setMoving] = useState<{ src: string; dir: "next" | "prev" } | null>(null);
  const [side, setSide] = useState<"next" | "prev">("next");
  const n = group.clips.length;
  const current = group.clips[top];

  // Clic à droite : la carte du dessus file sur le côté et repasse derrière,
  // la suivante vient devant. Clic à gauche (10/11) : la dernière du tas
  // ressort par le côté et revient devant.
  const go = (dir: "next" | "prev") => {
    const to = dir === "next" ? (top + 1) % n : (top - 1 + n) % n;
    setMoving({ src: group.clips[dir === "next" ? top : to].src, dir });
    setTop(to);
    window.setTimeout(() => setMoving(null), 650);
  };
  const sideOf = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    return e.clientX - box.left < box.width / 2 ? "prev" : "next";
  };

  return (
    <div className="slide slide--stack" data-clip={cardKey}>
      <div
        className={`brand-stack brand-stack--${side}`}
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={(e) => go(sideOf(e))}
        onMouseMove={(e) => setSide(sideOf(e))}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") { e.preventDefault(); go("prev"); }
          else if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") { e.preventDefault(); go("next"); }
        }}
      >
        {group.clips.map((c, i) => {
          const depth = (i - top + n) % n;
          const anim = moving?.src === c.src ? (moving.dir === "next" ? " tuck" : " untuck") : "";
          const cls = `phone stack-card-item depth-${Math.min(depth, 3)}${anim}`;
          return (
            <div key={c.src} className={cls} aria-hidden={depth !== 0}>
              {depth === 0 ? (
                <>
                  <video
                    ref={(el) => sound.registerRef(cardKey, el)}
                    src={videoUrl(c.src)}
                    poster={c.poster}
                    autoPlay
                    muted={sound.unmutedKey !== cardKey}
                    loop
                    playsInline
                    preload="metadata"
                    controlsList="nodownload nofullscreen"
                    onContextMenu={(e) => e.preventDefault()}
                    title={`Creator content: ${c.label}`}
                  />
                  <SoundBtn on={sound.unmutedKey === cardKey} onClick={() => sound.toggleSound(cardKey)} />
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                c.poster && <img src={c.poster} alt="" loading="lazy" />
              )}
            </div>
          );
        })}
        {/* Flèches au survol : on feuillette dans les deux sens (10/11). */}
        <button type="button" className="stack-nav stack-nav--prev" tabIndex={-1} aria-hidden="true" onClick={(e) => { e.stopPropagation(); go("prev"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button type="button" className="stack-nav stack-nav--next" tabIndex={-1} aria-hidden="true" onClick={(e) => { e.stopPropagation(); go("next"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
      <ClipMeta label={group.key} clip={{ ...current, brand: current.brand ?? group.key, project: undefined, kind: undefined }} />
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
            src={videoUrl(clip.src)}
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

export function Carousel({ clips: input, kind, prefix, sound, badge, stackBy, lang = "en" }: { clips: Clip[]; kind: "phone" | "tablet"; prefix: string; sound: Sound; badge?: string; stackBy?: (c: Clip) => string; lang?: "fr" | "en" }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  // En tas, les vidéos d'une marque se suivent, sur mobile aussi.
  const groups = stackBy ? groupClips(input, stackBy) : null;
  const clips = groups ? groups.flatMap((g) => g.clips) : input;
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
    // En boucle (10/11, Sandrine) : ‹ au début repart de la fin, › à la fin
    // revient au début.
    const end = el.scrollWidth - el.clientWidth;
    if (dir === -1 && el.scrollLeft <= 4) {
      el.scrollTo({ left: end, behavior: "smooth" });
    } else if (dir === 1 && el.scrollLeft >= end - 4) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * step, behavior: "smooth" });
    }
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
        {groups
          ? groups.flatMap((g) => {
              const id = `${prefix}-${g.key}`;
              if (g.clips.length < 2) {
                return [<Mock key={id} clip={g.clips[0]} cardKey={id} kind={kind} sound={sound} badge={badge} />];
              }
              return [
                <BrandStack
                  key={`${id}-stack`}
                  group={g}
                  cardKey={`${id}-stack`}
                  sound={sound}
                  label={lang === "fr" ? `${g.key} : clic à droite pour la vidéo suivante, à gauche pour la précédente` : `${g.key}: click right for the next video, left for the previous one`}
                />,
              ];
            })
          : clips.map((clip, i) => (
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
      src={videoUrl(clip.src)}
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
