import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import LazyFilm from "../destinations/LazyFilm";
import { NAV, NAV_MORE } from "./nav";
import s from "./Cover.module.css";

// ─────────────────────────────────────────────────────────────
// Couverture de page (28/10), d'après la couverture du portfolio de Lola
// Fechino choisie par Sandrine : un film ou des photos plein cadre sur fond
// blanc, et une mention dans chaque coin. Il n'y a plus de menu en haut de
// page : la navigation vit dans les coins de la couverture (et dans le pied
// de page pour qui est descendu).
//
// Les coins par défaut : le nom du site en haut à gauche, les rubriques en
// bas à gauche (Hotels & Houses, Destinations, Brands, la liste choisie par
// Sandrine), Journal, Contact et About en bas à droite. Chaque page peut
// remplacer n'importe quel coin.
// ─────────────────────────────────────────────────────────────

type Film = { src: string; poster: string };

export default function Cover({
  film,
  filmVertical,
  images,
  label,
  kicker,
  title,
  tl,
  tr,
  bl,
  br,
  center,
  short = false,
}: {
  film?: Film;
  // Version verticale du film, jouée sur téléphone à la place de l'autre.
  filmVertical?: Film;
  // Une photo, ou deux verticales côte à côte comme une double page.
  images?: string[];
  label: string;
  // Le nom de la page, en haut à droite (le h1 de la page), avec une ligne
  // au dessus (kicker) et ce qui suit en dessous (tr).
  kicker?: ReactNode;
  title?: string;
  tl?: ReactNode;
  tr?: ReactNode;
  bl?: ReactNode;
  br?: ReactNode;
  center?: ReactNode;
  // Couverture moins haute, pour les pages pratiques (Contact, Store...).
  short?: boolean;
}) {
  const links = (items: { href: string; label: string }[]) =>
    items.map((l) => <Link key={l.href + l.label} href={l.href}>{l.label}</Link>);

  return (
    <section className={`${s.cover} ${short ? s.short : ""}`} aria-label={label}>
      {film && (
        <div className={`${s.media} ${filmVertical ? s.wide : ""}`}>
          <LazyFilm src={film.src} poster={film.poster} label={label} sound={false} />
        </div>
      )}
      {filmVertical && (
        <div className={`${s.media} ${s.tall}`}>
          <LazyFilm src={filmVertical.src} poster={filmVertical.poster} label={label} sound={false} />
        </div>
      )}
      {!film && images && images.length > 0 && (
        <div className={`${s.media} ${s.spread}`} data-count={Math.min(images.length, 2)}>
          {images.slice(0, 2).map((src) => (
            <div key={src} className={s.page}>
              <Image src={src} alt="" fill priority sizes={images.length > 1 ? "50vw" : "100vw"} quality={80} />
            </div>
          ))}
        </div>
      )}
      <span className={s.veil} aria-hidden="true" />

      <div className={`${s.corner} ${s.tl}`}>{tl ?? <Link href="/en">The Girl With A Camera</Link>}</div>
      {(kicker || title || tr) && (
        <div className={`${s.corner} ${s.tr}`}>
          {kicker && <p>{kicker}</p>}
          {title && <h1 className={s.title}>{title}</h1>}
          {tr}
        </div>
      )}
      {center && <div className={s.center}>{center}</div>}
      <nav className={`${s.corner} ${s.bl}`} aria-label="Work">{bl ?? links(NAV)}</nav>
      <div className={`${s.corner} ${s.br}`}>{br ?? links(NAV_MORE)}</div>
    </section>
  );
}
