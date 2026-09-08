import Image from "next/image";
import Link from "next/link";
import Caption from "./Caption";
import s from "./ProjectCard.module.css";

// Tuile 4:5 d'un projet, d'un cas ou d'une porte, avec sa légende dessous.
// Utilisée par l'accueil, la page Photographe, les pages de catégorie.
export default function ProjectCard({
  href,
  cover,
  alt,
  title,
  sub,
  note,
  noteHref,
  hasFilm = false,
  priority = false,
  coverPosition,
  sizes = "(max-width: 767px) 50vw, 380px",
  quality = 78,
  door = false,
}: {
  href: string;
  cover?: string | null;
  alt: string;
  title: string;
  sub?: string;
  note?: string;
  noteHref?: string;
  hasFilm?: boolean;
  priority?: boolean;
  coverPosition?: string;
  sizes?: string;
  quality?: number;
  door?: boolean;
}) {
  return (
    <div>
      <Link href={href} className={s.card}>
        <span className={`${s.thumb} ${door && !cover ? s.door : ""}`}>
          {cover ? (
            <Image
              src={cover}
              alt={alt}
              width={1066}
              height={1600}
              sizes={sizes}
              priority={priority}
              quality={quality}
              style={coverPosition ? { objectPosition: coverPosition } : undefined}
            />
          ) : (
            <span className={s.doorWord}>{title}</span>
          )}
          {hasFilm && (
            <span className={s.flag} aria-hidden="true">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
          )}
        </span>
        {(cover || sub) && (
          <Caption className={s.cap} title={door ? `${title} →` : title} sub={sub} />
        )}
      </Link>
      {note && <Caption title="" note={note} noteHref={noteHref} />}
    </div>
  );
}
