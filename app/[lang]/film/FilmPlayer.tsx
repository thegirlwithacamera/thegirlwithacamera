"use client";

import { useState } from "react";

const BASE = "https://3cwvdrhaucmdleep.public.blob.vercel-storage.com/film";

type Film = { id: number; src: string; label: string };

const CATEGORIES: { key: string; label: string; films: Film[] }[] = [
  {
    key: "city",
    label: "City · Travel",
    films: [
      { id: 1, src: `${BASE}/citydiary-01-tokyo.mp4`,  label: "Tokyo" },
      { id: 2, src: `${BASE}/citydiary-02-osaka.mp4`,  label: "Osaka" },
      { id: 3, src: `${BASE}/citydiary-03-tokyo.mp4`,  label: "Tokyo Night" },
      { id: 4, src: `${BASE}/citydiary-04-nara.mp4`,   label: "Nara" },
      { id: 5, src: `${BASE}/citydiary-05-kyoto.mp4`,  label: "Kyoto" },
      { id: 6, src: `${BASE}/citydiary-06-cefalu.mp4`, label: "Cefalù" },
      { id: 7, src: `${BASE}/citydiary-07-palermo.mp4`,label: "Palermo" },
    ],
  },
  {
    key: "life",
    label: "Life · Moments",
    films: [
      { id: 8, src: `${BASE}/lifediary-01-cherryblossom.mp4`, label: "Cherry Blossom" },
    ],
  },
  {
    key: "photo",
    label: "Photographer · BTS",
    films: [
      { id: 9, src: `${BASE}/sequence-01.mp4`, label: "Self Portrait" },
    ],
  },
];

const ALL_FILMS = CATEGORIES.flatMap((c) => c.films);

export default function FilmPlayer() {
  const [activeId, setActiveId] = useState(1);
  const [activeCat, setActiveCat] = useState("city");

  const current = ALL_FILMS.find((f) => f.id === activeId) ?? ALL_FILMS[0];
  const visibleFilms = CATEGORIES.find((c) => c.key === activeCat)?.films ?? [];

  function selectCat(key: string) {
    setActiveCat(key);
    const first = CATEGORIES.find((c) => c.key === key)?.films[0];
    if (first) setActiveId(first.id);
  }

  return (
    <>
      <style>{`
        .film-wrap {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .film-main {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #0a0a0a;
          display: block;
        }

        /* Category tabs */
        .film-cats {
          display: flex;
          justify-content: center;
          gap: 0;
          margin: 10px 0 8px;
          border-bottom: 1px solid #ebebeb;
        }
        .film-cat-btn {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 8px 20px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666666;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          margin-bottom: -1px;
        }
        .film-cat-btn:hover { color: #555; }
        .film-cat-btn--active {
          color: #0a0a0a;
          border-bottom-color: #0a0a0a;
        }

        /* Thumbnails */
        .film-thumbs {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 3px;
        }
        .film-thumb {
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #111;
          cursor: pointer;
          position: relative;
          opacity: 0.38;
          transition: opacity 0.2s;
        }
        .film-thumb:hover { opacity: 0.7; }
        .film-thumb--active {
          opacity: 1;
          outline: 1px solid #0a0a0a;
          outline-offset: -1px;
        }
        .film-thumb video {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }
        .film-thumb-label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 3px 5px;
          background: rgba(0,0,0,0.5);
          font-size: 10px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.85);
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 767px) {
          .film-wrap { padding: 0 12px; }
          .film-cat-btn { padding: 8px 12px; font-size: 10px; }
          .film-thumbs { grid-template-columns: repeat(4, 1fr); gap: 2px; }
        }
      `}</style>

      <div className="film-wrap">
        {/* Player */}
        <video
          key={activeId}
          className="film-main"
          src={current.src}
          controls
          playsInline
          autoPlay
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          title={`Film: ${current.label}`}
        />

        {/* Category tabs */}
        <div className="film-cats">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`film-cat-btn${activeCat === cat.key ? " film-cat-btn--active" : ""}`}
              onClick={() => selectCat(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Thumbnails filtered by category */}
        <div className="film-thumbs">
          {visibleFilms.map((f) => (
            <div
              key={f.id}
              className={`film-thumb${f.id === activeId ? " film-thumb--active" : ""}`}
              onClick={() => setActiveId(f.id)}
            >
              <video src={f.src} muted playsInline preload="metadata" onContextMenu={(e) => e.preventDefault()} title={`Film thumbnail: ${f.label}`} />
              <span className="film-thumb-label">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
