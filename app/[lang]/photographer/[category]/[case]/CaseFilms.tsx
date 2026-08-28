"use client";

// ─────────────────────────────────────────────────────────────
// Les films d'un cas, sous ses photos.
//
// Trois partis pris :
//
// 1. Format natif. Le ratio est lu sur la vidéo elle-même
//    (videoWidth / videoHeight) à l'évènement loadedmetadata, jamais imposé.
//    Un horizontal occupe toute la largeur, un vertical se centre à 420px.
//    Aucun recadrage, aucune bande noire.
//
// 2. La durée décide du comportement. En dessous de 30 secondes c'est une
//    séquence : elle démarre seule, muette, en boucle, quand elle entre dans
//    l'écran. Au dessus c'est un film : il attend qu'on le lance, et il part
//    avec le son. Personne n'impose un 2 minutes en autoplay à un visiteur.
//
// 3. La durée n'est pas écrite. Elle sert en interne à choisir le
//    comportement, jamais à l'affichage : un chiffre sous une image, sur une
//    page qui se lit comme un portfolio, casse la lecture.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";

export type CaseFilmItem = { src: string; poster?: string; label?: string };

// Seuil entre une séquence (démarre seule, muette) et un film (attend le clic).
const SHORT_MAX_SECONDS = 30;

function Film({ item, lang }: { item: CaseFilmItem; lang: "fr" | "en" }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);

  const isLong = duration !== null && duration >= SHORT_MAX_SECONDS;
  const vertical = ratio !== null && ratio < 1;
  const waiting = isLong && !started;

  // Une séquence courte ne démarre qu'une fois visible : la page ne télécharge
  // pas une vidéo que personne n'a encore atteinte.
  useEffect(() => {
    const el = ref.current;
    if (!el || duration === null || isLong) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [duration, isLong]);

  function start() {
    const el = ref.current;
    if (!el) return;
    el.muted = false;
    setMuted(false);
    setStarted(true);
    el.play().catch(() => {});
  }

  function toggleSound() {
    const el = ref.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }

  const playLabel = lang === "fr" ? "Lire le film" : "Play film";

  return (
    <figure className={`case-film${vertical ? " is-vertical" : ""}`}>
      <div className="case-film-frame" style={ratio ? { aspectRatio: String(ratio) } : undefined}>
        <video
          ref={ref}
          src={item.src}
          poster={item.poster}
          playsInline
          muted
          loop={!isLong}
          preload="metadata"
          controls={started}
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            setDuration(v.duration);
            if (v.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight);
          }}
          onEnded={() => setStarted(false)}
        />

        {waiting && (
          <button className="case-film-play" onClick={start} aria-label={playLabel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}

        {!waiting && !started && (
          <button
            className="case-film-sound"
            onClick={toggleSound}
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            {muted ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {item.label && <figcaption className="case-film-cap">{item.label}</figcaption>}
    </figure>
  );
}

export default function CaseFilms({ films, lang }: { films: CaseFilmItem[]; lang: "fr" | "en" }) {
  if (films.length === 0) return null;
  const heading =
    films.length > 1
      ? lang === "fr" ? "Les films" : "The films"
      : lang === "fr" ? "Le film" : "The film";

  return (
    <section className="case-films">
      <h2 className="case-films-head">{heading}</h2>
      {films.map((f) => (
        <Film key={f.src} item={f} lang={lang} />
      ))}
    </section>
  );
}
