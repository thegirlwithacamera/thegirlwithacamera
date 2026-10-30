"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import LazyFilm from "../destinations/LazyFilm";
import { PageHead } from "../components/editorial";
import type { BrandFilm } from "./constants";
import s from "./Films.module.css";

// Page Brand films (30/10) : un film de marque horizontal par projet, en
// grand. Chaque film s'ouvre quand on arrive dessus, les bandes noires
// s'écartent comme un rideau. Un film annoncé (sans src) garde sa place.

const content = {
  fr: {
    title: "Tourné comme du cinéma, *monté* pour une marque.",
    lede: "Concept, tournage, montage et étalonnage, livrés en 16:9 pour votre site, un lancement ou un écran en boutique. Les déclinaisons pour les réseaux viennent avec.",
    other: "Social",
    soon: "En production",
    client: "Client",
    format: "Format",
    role: "Rôle",
  },
  en: {
    title: "Shot like cinema, *cut* for a brand.",
    lede: "Concept, shooting, editing and grading, delivered in 16:9 for your website, a launch or a store screen. Cut-downs for social come with it.",
    other: "Social",
    soon: "In production",
    client: "Client",
    format: "Format",
    role: "Role",
  },
};

function Film({ film, t }: { film: BrandFilm; t: (typeof content)["en"] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add(s.in); io.disconnect(); } },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const name = film.title ? `${film.client}, ${film.title}` : film.client;

  return (
    <article ref={ref} className={`${s.film} ${film.src ? "" : s.soon}`} id={film.slug}>
      <div className={s.screen}>
        {film.src && film.poster ? (
          <LazyFilm src={film.src} poster={film.poster} label={`${name}, brand film by Sandrine Ceuppens`} />
        ) : (
          <span className={s.soonTag}>{t.soon}</span>
        )}
        <span className={s.curtain} aria-hidden="true" />
        <span className={`${s.corner} ${s.tl}`}>{film.client}</span>
        {film.src && <span className={`${s.corner} ${s.br}`}>{film.year}</span>}
      </div>
      <div className={s.credits}>
        <h3 className={s.name}>{name}</h3>
        <dl className={s.facts}>
          <dt>{t.client}</dt><dd>{film.client}</dd>
          <dt>{t.format}</dt><dd>16:9</dd>
          {film.role && <><dt>{t.role}</dt><dd>{film.role}</dd></>}
        </dl>
      </div>
    </article>
  );
}

export default function FilmsView({ lang, films }: { lang: "fr" | "en"; films: readonly BrandFilm[] }) {
  const t = content[lang];
  return (
    <main className={s.main}>
      <nav className={s.switch} aria-label="Brands">
        <Link href={`/${lang}/creator`}>Brands</Link>
        <Link href={`/${lang}/creator/social`} className={s.next}>{t.other} →</Link>
      </nav>
      <PageHead eyebrow="Brand films" title={t.title} lede={t.lede} />
      <div className={s.list}>
        {/* Un film annoncé passe après les films en ligne : la page ne s'ouvre
            pas sur un écran noir. Il remonte en tête dès qu'il a sa vidéo. */}
        {[...films.filter((f) => f.src), ...films.filter((f) => !f.src)].map((f) => <Film key={f.slug} film={f} t={t} />)}
      </div>
    </main>
  );
}
