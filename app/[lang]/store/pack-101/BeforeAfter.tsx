'use client';

import { useCallback, useRef, useState } from 'react';
import s from './BeforeAfter.module.css';

interface Props {
  before: string;
  after: string;
  name: string;
  beforeLabel: string;
  compact?: boolean;
}

// Avant/apres dont la ligne suit la souris (ou le doigt) : a gauche de la
// ligne la photo brute, a droite le preset applique. `compact` reduit
// poignee et pastilles pour les petites vignettes en grille.
export default function BeforeAfter({ before, after, name, beforeLabel, compact }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);

  const move = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const next = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(1.5, Math.min(98.5, next)));
  }, []);

  return (
    <div
      ref={ref}
      className={compact ? `${s.wrap} ${s.compact}` : s.wrap}
      onPointerMove={(e) => e.pointerType !== 'touch' && move(e.clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      onTouchStart={(e) => move(e.touches[0].clientX)}
    >
      <img src={before} alt={`${name} · ${beforeLabel}`} draggable={false} loading="lazy" />
      <img
        src={after}
        alt={name}
        draggable={false}
        loading="lazy"
        className={s.after}
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      />
      <div className={s.line} style={{ left: `${pos}%` }} aria-hidden>
        <span className={s.knob}>
          <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden>
            <path d="M6 1 1 5l5 4M16 1l5 4-5 4" stroke="#141414" strokeWidth="1.4" fill="none" />
          </svg>
        </span>
      </div>
      <span className={`${s.chip} ${s.chipLeft}`}>{beforeLabel}</span>
      <span className={`${s.chip} ${s.chipRight}`}>{name}</span>
    </div>
  );
}
