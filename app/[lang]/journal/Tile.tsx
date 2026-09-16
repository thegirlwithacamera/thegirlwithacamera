import Image from "next/image";
import Link from "next/link";
import s from "./journal.module.css";

// Tuile carrée du journal (16/09, demande de Sandrine) : une photo, un mot
// écrit dessus, rien d'autre. "Interrail", "Vienna", "Camera bag".
export default function Tile({ href, cover, label }: { href: string; cover?: string; label: string }) {
  return (
    <Link href={href} className={s.tile}>
      {cover && <Image src={cover} alt="" fill sizes="(max-width: 767px) 50vw, 25vw" quality={72} className={s.tileImg} />}
      <span className={s.tileVeil} aria-hidden="true" />
      <span className={s.tileLabel}>{label}</span>
    </Link>
  );
}
