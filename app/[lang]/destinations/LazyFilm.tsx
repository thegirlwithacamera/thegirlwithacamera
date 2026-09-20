"use client";

import { useEffect, useRef, useState } from "react";
import s from "./page.module.css";
import { videoUrl } from "@/lib/video-url";

// Film en boucle, qui ne se charge et ne joue que lorsqu'il est à l'écran
// (16/09, page Destinations). Les fichiers pèsent de 8 à 25 Mo : les lancer
// tous au chargement ferait ramer la page et fondre un forfait mobile. Hors
// écran, le film se met en pause.
//
// sound={false} pour les bandeaux d'accueil : ils sont muets, décoratifs, et
// n'ont pas de bouton (20/09). Le <video> y reste nu, sans conteneur, pour ne
// pas casser leur mise en page en plein écran.
//
// Ailleurs, le son démarre coupé, parce qu'un navigateur refuse de lancer une
// vidéo sonore tout seul, et un petit haut-parleur en coin permet de
// l'allumer.
//
// Si le visiteur a demandé moins d'animations, ou s'il est en économie de
// données, rien ne démarre seul : il reste l'affiche, et un clic lance le
// film avec ses contrôles.
export default function LazyFilm({
  src,
  poster,
  label,
  sound = true,
}: {
  src: string;
  poster: string;
  label: string;
  sound?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    // Réglé directement sur l'élément, pas dans un état React : c'est un
    // réglage du lecteur, pas quelque chose que la page affiche autrement.
    const manual = () => { video.controls = true; };
    if (reduce || saveData) {
      manual();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload !== "auto") video.preload = "auto";
          video.play().catch(manual);
        } else {
          video.pause();
          // Un film qui sort de l'écran ne continue pas à parler dans le vide.
          video.muted = true;
          setMuted(true);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const film = <video ref={ref} src={videoUrl(src)} poster={poster} muted loop playsInline preload="none" aria-label={label} />;

  if (!sound) return film;

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
    if (!next) video.play().catch(() => {});
  };

  return (
    <div className={s.filmWrap}>
      {film}
      <button
        type="button"
        onClick={toggle}
        className={s.sound}
        aria-label={muted ? `Turn the sound on for ${label}` : `Turn the sound off for ${label}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9.5h3.2L12 5.6v12.8L7.2 14.5H4z" />
          {muted ? <path d="M16.5 9.5l4 5m0-5l-4 5" /> : <path d="M15.8 9.2a4 4 0 0 1 0 5.6M18.4 7a7 7 0 0 1 0 10" />}
        </svg>
      </button>
    </div>
  );
}
