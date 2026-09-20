"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { InstaTile } from "@/lib/instagram";
import s from "../page.module.css";

// Bande "Follow on Instagram". Au premier affichage on montre les vignettes
// livrees avec la page (les cinq photos du site), puis on remplace par les
// cinq derniers posts des que /api/instagram repond. Si l'appel echoue, la
// bande reste telle quelle.
export default function InstagramRow({ initial }: { initial: InstaTile[] }) {
  const [tiles, setTiles] = useState<InstaTile[]>(initial);

  useEffect(() => {
    let alive = true;
    fetch("/api/instagram")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { tiles?: InstaTile[] } | null) => {
        if (alive && d?.tiles?.length === initial.length) setTiles(d.tiles);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [initial.length]);

  return (
    <div className={s.instaRow}>
      {tiles.map((t) => (
        <a
          key={t.href}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          className={s.instaTile}
          aria-label={`${t.alt} on Instagram`}
        >
          <Image src={t.src} alt={t.alt} fill sizes="(max-width: 767px) 50vw, 20vw" quality={70} unoptimized={t.src.startsWith("http")} />
          {t.reel && (
            <svg className={s.instaReel} viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
          )}
        </a>
      ))}
    </div>
  );
}
