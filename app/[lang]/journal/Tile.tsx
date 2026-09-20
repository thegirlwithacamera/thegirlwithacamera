import Image from "next/image";
import Link from "next/link";
import s from "./journal.module.css";

// Tuile carrée du journal (16/09, demande de Sandrine) : une photo, un mot
// écrit dessus, rien d'autre. "Interrail", "Vienna", "Camera bag".
// caption (18/09) : la ligne sous le carré, du type "City guide", pour dire
// clairement ce qu'on trouve derrière.
export default function Tile({ href, cover, label, caption }: { href: string; cover?: string; label: string; caption?: string }) {
  return (
    <div className={s.tileWrap}>
    <Link href={href} className={s.tile}>
      {cover && <Image src={cover} alt="" fill sizes="(max-width: 767px) 50vw, 25vw" quality={72} className={s.tileImg} />}
      {/* 20/09 (Sandrine) : quand un nom est écrit sous le carré, rien sur la photo. */}
      {!caption && <span className={s.tileVeil} aria-hidden="true" />}
      {caption ? <span className="sr-only">{label}</span> : <span className={s.tileLabel}>{label}</span>}
    </Link>
    {caption && <span className={s.tileCaption}>{caption}</span>}
    </div>
  );
}
