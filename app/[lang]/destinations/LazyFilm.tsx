"use client";

import { useEffect, useRef } from "react";

// Film muet en boucle, qui ne se charge et ne joue que lorsqu'il est à
// l'écran (16/09, page Destinations). Les fichiers pèsent de 10 à 25 Mo :
// les lancer tous au chargement ferait ramer la page et fondre un forfait
// mobile. Hors écran, le film se met en pause.
//
// Si le visiteur a demandé moins d'animations, ou s'il est en économie de
// données, rien ne démarre seul : il reste l'affiche, et un clic lance le
// film avec ses contrôles.
export default function LazyFilm({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

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
        }
      },
      { threshold: 0.35 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
