'use client';

import { useCallback, useRef } from 'react';
import s from './ProductBox.module.css';

interface Props {
  front: string;
  spine: string;
  alt: string;
  /** Couleur des faces sans visuel (dos, dessus, dessous). */
  color: string;
}

// Boitier produit en vrai 3D (CSS) : face avant + tranche. Au repos il est
// legerement tourne ; au survol il suit la souris. Sur ecran tactile il reste
// dans sa pose de repos.
export default function ProductBox({ front, spine, alt, color }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const move = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; // 0 a gauche, 1 a droite
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(8 + (1 - x) * 38).toFixed(1)}deg`);
    el.style.setProperty('--rx', `${((y - 0.5) * -14).toFixed(1)}deg`);
  }, []);

  const leave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty('--ry');
    el.style.removeProperty('--rx');
  }, []);

  return (
    <div
      ref={ref}
      className={s.scene}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ ['--box-color' as string]: color }}
    >
      <div className={s.shadow} aria-hidden />
      <div className={s.box}>
        <img className={s.front} src={front} alt={alt} draggable={false} />
        <img className={s.spine} src={spine} alt="" aria-hidden draggable={false} />
        <span className={s.back} aria-hidden />
        <span className={s.right} aria-hidden />
        <span className={s.top} aria-hidden />
        <span className={s.bottom} aria-hidden />
        <span className={s.sheen} aria-hidden />
      </div>
    </div>
  );
}
