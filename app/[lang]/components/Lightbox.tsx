"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  photos: string[];
  alt: string;
  lang: "fr" | "en";
}

export default function Lightbox({ photos, alt, lang }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
    touchStartX.current = null;
  }

  return (
    <>
      {/* Trigger grid: photos rendered as buttons opening the lightbox */}
      <div
        className="max-w-6xl mx-auto columns-1 md:columns-2"
        style={{ columnGap: "1rem" }}
      >
        {photos.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setIndex(i); setOpen(true); }}
            className="border border-[#d4d4d4] p-3 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] mb-4 break-inside-avoid block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            aria-label={`${alt} — ${lang === "fr" ? "photo" : "photo"} ${i + 1} / ${photos.length}`}
          >
            <Image
              src={src}
              alt={`${alt} — ${i + 1} / ${photos.length}`}
              width={1200}
              height={1200}
              className="w-full h-auto block bg-[#f5f5f5]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lang === "fr" ? "Visionneuse de photos" : "Photo viewer"}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-3"
            aria-label={lang === "fr" ? "Fermer" : "Close"}
          >
            <span className="text-2xl">×</span>
          </button>

          {/* Prev */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3"
            aria-label={lang === "fr" ? "Précédent" : "Previous"}
          >
            <span className="text-3xl">‹</span>
          </button>

          {/* Image */}
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-12 my-12">
            <Image
              src={photos[index]}
              alt={`${alt} — ${index + 1} / ${photos.length}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={next}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3"
            aria-label={lang === "fr" ? "Suivant" : "Next"}
          >
            <span className="text-3xl">›</span>
          </button>

          {/* Counter */}
          <p className="absolute bottom-4 left-0 right-0 text-center text-xs tracking-[0.3em] uppercase text-white/60">
            {index + 1} / {photos.length}
          </p>
        </div>
      )}
    </>
  );
}
