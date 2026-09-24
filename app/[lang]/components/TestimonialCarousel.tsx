"use client";

import { useEffect, useRef, useState } from "react";
import CaseTestimonial from "./CaseTestimonial";
import type { Testimonial } from "../photographer/constants";

// Les mots des clients en carrousel plutot qu'empiles : demande de Sandrine
// du 24/09, la page About s'allongeait a chaque nouveau temoignage.
// Defilement natif (scroll-snap) pour que le doigt fasse glisser sur
// telephone, fleches et points pour l'ordinateur. Avance seul toutes les
// 8 secondes, s'arrete des qu'on y touche, jamais si le visiteur a
// demande moins d'animations.
type Item = { t: Testimonial; href: string; label: string };

export default function TestimonialCarousel({ lang, items }: { lang: "fr" | "en"; items: Item[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = items.length;

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const next = (i + n) % n;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => go(index + 1), 8000);
    return () => window.clearInterval(id);
  });

  if (n === 0) return null;

  const prev = lang === "fr" ? "Témoignage précédent" : "Previous testimonial";
  const next = lang === "fr" ? "Témoignage suivant" : "Next testimonial";

  return (
    <div
      className="tcar"
      onPointerDown={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
    >
      <style>{`
        .tcar { position: relative; }
        .tcar-track {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          overscroll-behavior-x: contain;
        }
        .tcar-track::-webkit-scrollbar { display: none; }
        .tcar-slide { flex: 0 0 100%; scroll-snap-align: start; min-width: 0; }
        .tcar-nav {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: clamp(16px, 2vw, 24px);
        }
        .tcar-btn {
          background: none;
          border: 1px solid var(--line);
          color: var(--ink);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
        }
        .tcar-btn:hover { border-color: var(--ink); }
        .tcar-dots { display: flex; gap: 8px; }
        .tcar-dot {
          width: 7px; height: 7px; border-radius: 50%;
          border: 0; padding: 0; cursor: pointer;
          background: var(--line);
        }
        .tcar-dot[aria-current="true"] { background: var(--ink); }
      `}</style>
      <div className="tcar-track" ref={track} aria-roledescription="carousel">
        {items.map((x, i) => (
          <div className="tcar-slide" key={x.href} aria-roledescription="slide" aria-label={`${i + 1} / ${n}`}>
            <CaseTestimonial lang={lang} t={x.t} work={{ href: `/${lang}${x.href}`, label: x.label }} flush />
          </div>
        ))}
      </div>
      {n > 1 && (
        <div className="tcar-nav">
          <button type="button" className="tcar-btn" aria-label={prev} onClick={() => { setPaused(true); go(index - 1); }}>‹</button>
          <div className="tcar-dots">
            {items.map((x, i) => (
              <button
                type="button"
                key={x.href}
                className="tcar-dot"
                aria-label={`${i + 1} / ${n}`}
                aria-current={i === index}
                onClick={() => { setPaused(true); go(i); }}
              />
            ))}
          </div>
          <button type="button" className="tcar-btn" aria-label={next} onClick={() => { setPaused(true); go(index + 1); }}>›</button>
        </div>
      )}
    </div>
  );
}
