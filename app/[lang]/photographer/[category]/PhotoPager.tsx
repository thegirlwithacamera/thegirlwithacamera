"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { PortfolioPhoto } from "@/lib/portfolio";

interface Props {
  photos: PortfolioPhoto[];
  catLabel: string;
  pageSize?: number;
}

// Grille 3x3 paginée par blocs de `pageSize` photos, navigable au swipe,
// aux flèches clavier, ou via les points sous la grille.
export default function PhotoPager({ photos, catLabel, pageSize = 9 }: Props) {
  const pages: PortfolioPhoto[][] = [];
  for (let i = 0; i < photos.length; i += pageSize) {
    pages.push(photos.slice(i, i + pageSize));
  }

  const [page, setPage] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function goTo(p: number) {
    setPage(Math.max(0, Math.min(pages.length - 1, p)));
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) goTo(page + (dx > 0 ? -1 : 1));
    touchStartX.current = null;
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") goTo(page - 1);
    if (e.key === "ArrowRight") goTo(page + 1);
  }

  return (
    <div>
      <div className="pager-outer">
        <div
          className="pager-viewport"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="group"
          aria-label={catLabel}
          aria-roledescription="carousel"
        >
          <div
            className="pager-track"
            style={{
              width: `${pages.length * 100}%`,
              transform: `translateX(-${page * (100 / pages.length)}%)`,
            }}
          >
            {pages.map((group, pi) => (
              <div
                className="pager-page"
                key={pi}
                style={{ flex: `0 0 ${100 / pages.length}%` }}
                aria-hidden={pi !== page}
              >
                {group.map((p, i) => {
                  const idx = pi * pageSize + i;
                  return (
                    <div key={idx} className="photo-cell">
                      <Image
                        src={p.src}
                        alt={`${catLabel} photograph ${idx + 1} by Sandrine Ceuppens`}
                        width={1066}
                        height={1600}
                        sizes="(max-width: 767px) 33vw, 420px"
                        priority={pi === 0 && i < 6}
                        quality={75}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {pages.length > 1 && (
        <div className="pager-dots" role="tablist" aria-label={catLabel}>
          {pages.map((_, pi) => (
            <button
              key={pi}
              type="button"
              role="tab"
              className={`pager-dot${pi === page ? " is-active" : ""}`}
              onClick={() => goTo(pi)}
              aria-label={`Page ${pi + 1} / ${pages.length}`}
              aria-selected={pi === page}
            />
          ))}
        </div>
      )}
    </div>
  );
}
