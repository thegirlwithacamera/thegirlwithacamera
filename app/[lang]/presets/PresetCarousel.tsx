'use client';

import { useEffect, useState } from 'react';

type Slide = { name: string; src: string };

// Carrousel des rendus : le Raw reste fixe a gauche (dans la page),
// ici defilent les 15 presets sur la meme scene. Auto-avance toutes
// les 2,5 s, pause au survol, fleches manuelles.
export default function PresetCarousel({
  slides,
  afterLabel,
  prevLabel,
  nextLabel,
}: {
  slides: Slide[];
  afterLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((v) => (v + 1) % slides.length), 2500);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const arrow = {
    background: 'rgba(10, 10, 10, 0.55)',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: 1,
    padding: '8px 12px',
  };

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.name}
          loading={i === 0 ? 'eager' : 'lazy'}
          style={{
            width: '100%',
            aspectRatio: '4 / 5',
            objectFit: 'cover',
            display: 'block',
            background: '#f0f0f0',
            position: i === 0 ? 'relative' : 'absolute',
            inset: 0,
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.45s ease',
          }}
        />
      ))}

      {/* Label APRES + nom du preset */}
      <span
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          fontSize: '8px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#ffffff',
          background: 'rgba(10, 10, 10, 0.55)',
          padding: '4px 8px',
        }}
      >
        {afterLabel} · {slides[index].name} · {index + 1}/{slides.length}
      </span>

      {/* Fleches */}
      <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '2px' }}>
        <button
          type="button"
          aria-label={prevLabel}
          onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
          style={arrow}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => setIndex((index + 1) % slides.length)}
          style={arrow}
        >
          ›
        </button>
      </div>
    </div>
  );
}
