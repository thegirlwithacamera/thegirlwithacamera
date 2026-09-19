"use client";

import { useEffect, useRef, useState } from "react";
import s from "./page.module.css";

// Film en boucle, qui ne se charge et ne joue que lorsqu'il est à l'écran
// (16/09, page Destinations). Les fichiers pèsent de 8 à 25 Mo : les lancer
// tous au chargement ferait ramer la page et fondre un forfait mobile. Hors
// écran, le film se met en pause.
//
// Le son démarre coupé, parce qu'un navigateur refuse de lancer une vidéo
// sonore tout seul, mais le visiteur peut l'allumer (19/09) : un bouton en
// coin, discret, qui garde le choix pour ce film-là.
//
// Si le visiteur a demandé moins d'animations, ou s'il est en économie de
// données, rien ne démarre seul : il reste l'affiche, et un clic lance le
// film avec ses contrôles.
export default function LazyFilm({ src, poster, label }: { src: string; poster: string; label: string }) {
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
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} />
      <button
        type="button"
        onClick={toggle}
        className={s.sound}
        aria-label={muted ? `Turn the sound on for ${label}` : `Turn the sound off for ${label}`}
      >
        {muted ? "Sound on" : "Sound off"}
      </button>
    </div>
  );
}
