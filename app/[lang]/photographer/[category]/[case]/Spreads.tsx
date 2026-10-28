import Image from "next/image";
import type { Spread } from "../../book";
import s from "./Spreads.module.css";

// Les photos d'un chapitre, montées en pages de livre (voir layoutSpreads).
// Pas de numéro sous les photos (retirés le 28/10, Sandrine) ; une légende
// seulement quand le cas en a une (champ plates de constants.ts).
export default function Spreads({
  spreads,
  alt,
  caption,
  priorityCount = 2,
}: {
  spreads: Spread[];
  alt: (no: number) => string;
  caption: (src: string) => string | undefined;
  priorityCount?: number;
}) {
  return (
    <div className={s.book}>
      {spreads.map((sp, si) => (
        <div key={sp.plates[0].src} className={`${s.spread} ${s[sp.kind]} ${si % 2 ? s.right : ""}`}>
          {sp.plates.map((p) => {
            const cap = caption(p.src);
            const w = 1600;
            const sizes = sp.kind === "bleed"
              ? "(max-width: 767px) 100vw, 1280px"
              : sp.kind === "solo"
                ? "(max-width: 767px) 100vw, 640px"
                : sp.kind === "pair" ? "(max-width: 767px) 50vw, 620px" : "(max-width: 767px) 50vw, 420px";
            return (
              <figure key={p.src} className={s.plate}>
                <div className={s.frame} style={{ aspectRatio: String(p.ratio) }}>
                  <Image
                    src={p.src}
                    alt={alt(p.no)}
                    width={w}
                    height={Math.round(w / p.ratio)}
                    sizes={sizes}
                    priority={p.no <= priorityCount}
                    quality={78}
                  />
                </div>
                {cap && <figcaption className={s.cap}>{cap}</figcaption>}
              </figure>
            );
          })}
        </div>
      ))}
    </div>
  );
}
