import Image from "next/image";
import Link from "next/link";
import type React from "react";
import type { PhotoCategory, PhotoCase } from "../../constants";
import { readCasePhotos, readCaseChapters } from "@/lib/portfolio";
import { bookChapters, layoutSpreads, no2 } from "../../book";
import Spreads from "./Spreads";
import { posterForPath } from "@/lib/creator-videos";
import PhotoPager from "../PhotoPager";
import CaseFilms from "./CaseFilms";
import CaseClient from "../../../components/CaseClient";
import CaseTestimonial from "../../../components/CaseTestimonial";
import Cover from "../../../components/Cover";
import s from "./page.module.css";

// ─────────────────────────────────────────────────────────────
// Vue d'un cas photo, partagée par deux routes.
//
// Un cas sans chapitres tient sur une page : intro, grille, film.
//
// Un cas à chapitres, l'Altstadt et ses dix pièces, est découpé en pages,
// une par pièce. Décision du 12/09 : une seule page faisait quatre vingt
// dix images à la suite, personne ne descend jusqu'en bas, et le visiteur
// qui cherche une chambre précise ne la trouve pas. Les pastilles du haut
// deviennent la navigation, elles sont sur toutes les pages du cas.
//
// La première pièce vit à l'adresse du cas lui même, pas sur une sous
// page : c'est l'entrée, elle garde l'URL déjà partagée et déjà indexée.
// Le film reste sur cette page d'entrée, une seule fois ; depuis une pièce,
// la pastille du film y ramène.
//
// 28/10, direction "photobook" : chaque cas est un chapitre numéroté du
// livre (voir book.ts), les photos sont montées en pages (Spreads) au lieu
// d'une grille, et le bas de page tourne la page vers le chapitre suivant.
// ─────────────────────────────────────────────────────────────

export function chapterTitle(slug: string): string {
  const t = slug.replace(/^\d+[\s._-]*/, "").replace(/[-_]+/g, " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : slug;
}

export function caseChapters(cat: PhotoCategory, item: PhotoCase, lang: "fr" | "en") {
  return readCaseChapters(cat.slug, item.slug).map((ch) => ({
    ...ch,
    title: item.chapters?.[ch.slug]?.[lang] ?? chapterTitle(ch.slug),
  }));
}

export default function CaseView({
  lang,
  cat,
  item,
  activeChapter,
}: {
  lang: "fr" | "en";
  cat: PhotoCategory;
  item: PhotoCase;
  // Slug de la pièce affichée. Absent : la page d'entrée du cas, qui montre
  // la première pièce et porte le film.
  activeChapter?: string;
}) {
  const photos = readCasePhotos(cat.slug, item.slug);
  const chapters = caseChapters(cat, item, lang);

  const base = `/${lang}/photographer/${cat.slug}/${item.slug}`;
  const activeIndex = activeChapter ? chapters.findIndex((c) => c.slug === activeChapter) : 0;
  const isRoot = !activeChapter;
  const shown = chapters.length > 0 ? chapters[activeIndex] : null;

  const films = (item.films ?? []).map((f) => ({
    src: f.src,
    poster: posterForPath(f.src),
    label: item.films!.length > 1 ? f.label?.[lang] : undefined,
  }));

  // Numéro du chapitre, cas précédent et suivant : l'ordre du livre.
  const book = bookChapters();
  const at = book.findIndex((c) => c.cat.slug === cat.slug && c.item.slug === item.slug);
  const chapterNo = at >= 0 ? book[at].no : null;
  const prevCase = at > 0 ? book[at - 1] : null;
  const nextCase = at >= 0 && at < book.length - 1 ? book[at + 1] : null;

  const dir = `/images/portfolio/${cat.slug}/${item.slug}/`;

  // La rubrique d'où vient le chapitre : les villes sur Destinations, les
  // maisons et les tables sur Hotels & Houses.
  const indexHref = cat.citySeries ? `/${lang}/destinations` : `/${lang}/hotels`;
  const indexLabel = cat.citySeries ? "Destinations" : "Hotels & Houses";

  // Les deux photos de la couverture : celles de la pièce affichée, ou la
  // couverture du cas suivie de la première autre photo.
  const pool = shown ? shown.photos.map((p) => p.src) : photos.map((p) => p.src);
  const first = !activeChapter && item.coverImage ? item.coverImage : pool[0];
  const coverImages = [first, pool.find((src) => src !== first)].filter((x): x is string => !!x);
  const caption = (src: string) => item.plates?.[src.replace(dir, "")]?.[lang];

  // Sur un cas à chapitres, le bas de page enchaîne les pièces ; on ne sort
  // du cas qu'à la dernière. Sur un cas simple, il enchaîne les cas.
  const prevChapter = chapters.length > 1 && activeIndex > 0 ? chapters[activeIndex - 1] : null;
  const nextChapter = chapters.length > 1 && activeIndex < chapters.length - 1 ? chapters[activeIndex + 1] : null;

  const prevHref = prevChapter
    ? (activeIndex - 1 === 0 ? base : `${base}/${prevChapter.slug}`)
    : prevCase ? `/${lang}${prevCase.href}` : null;
  const prevLabel = prevChapter
    ? prevChapter.title
    : prevCase ? (prevCase.item.short?.[lang] ?? prevCase.item.label[lang]) : null;
  const prevNo = prevChapter ? no2(activeIndex) : prevCase ? no2(prevCase.no) : null;
  const nextHref = nextChapter ? `${base}/${nextChapter.slug}` : nextCase ? `/${lang}${nextCase.href}` : null;
  const nextLabel = nextChapter
    ? nextChapter.title
    : nextCase ? (nextCase.item.short?.[lang] ?? nextCase.item.label[lang]) : null;
  const nextNo = nextChapter ? no2(activeIndex + 2) : nextCase ? no2(nextCase.no) : null;
  // Dans une maison à pièces on tourne les pièces, ailleurs les chapitres.
  const prevKind = prevChapter ? (lang === "fr" ? "Pièce" : "Room") : (lang === "fr" ? "Chapitre" : "Chapter");
  const nextKind = nextChapter ? (lang === "fr" ? "Pièce" : "Room") : (lang === "fr" ? "Chapitre" : "Chapter");

  const talk = cat.citySeries
    ? lang === "fr" ? "Votre ville, vue comme ça ? Parlons-en →" : "Your city, seen like this? Let's talk →"
    : cat.slug === "restaurants"
      ? lang === "fr" ? "Même idée pour votre table ? Parlons-en →" : "Same idea for your table? Let's talk →"
      : lang === "fr" ? "Même idée pour votre maison ? Parlons-en →" : "Same idea for your house? Let's talk →";

  const filmLabel = lang === "fr"
    ? films.length > 1 ? "Les films" : "Le film"
    : films.length > 1 ? "The films" : "The film";

  return (
    <>
      <main className={s.main}>
        {/* Couverture (28/10) : deux photos du chapitre en double page, le
            nom du lieu et son numéro dans les coins, comme l'accueil. */}
        <Cover
          images={coverImages}
          label={`${item.label[lang]}${item.place ? `, ${item.place[lang]}` : ""}`}
          tl={
            <>
              <Link href={`/${lang}`}>The Girl With A Camera</Link>
              <Link href={indexHref}>← {indexLabel}</Link>
            </>
          }
          kicker={chapterNo ? <>{lang === "fr" ? "Chapitre" : "Chapter"} {no2(chapterNo)} · {cat.label[lang]}</> : undefined}
          title={item.label[lang]}
          tr={
            <>
              {item.place && <p>{item.place[lang]}</p>}
              {!isRoot && shown && <p>{shown.title}</p>}
            </>
          }
        />

        <div className={s.lead}>
          {item.intro && <p className={s.intro}>{item.intro[lang]}</p>}
          {item.shotAt && <p className={s.shot}>{item.shotAt[lang]}</p>}
          {(chapters.length > 1 || films.length > 0) && (
            <nav className={s.chips} aria-label={lang === "fr" ? "Pièces" : "Rooms"}>
              {chapters.length > 1 && chapters.map((ch, ci) => (
                <Link
                  key={ch.slug}
                  href={ci === 0 ? base : `${base}/${ch.slug}`}
                  className={`${s.chip}${ci === activeIndex ? ` ${s.chipOn}` : ""}`}
                  aria-current={ci === activeIndex ? "page" : undefined}
                >
                  {ch.title}
                </Link>
              ))}
              {films.length > 0 && (
                isRoot
                  ? <a href="#film" className={`${s.chip} ${s.chipFilm}`}>{filmLabel}</a>
                  : <Link href={`${base}#film`} className={`${s.chip} ${s.chipFilm}`}>{filmLabel}</Link>
              )}
            </nav>
          )}
        </div>

        {shown ? (
          <section className={s.chapter}>
            {/* Sur la page d'entree, le titre du cas nomme deja la piece juste
                au dessus : le repeter ferait deux fois le meme nom. */}
            {!isRoot && (
              <div className={s.chapterHead}>
                <h2 className={s.chapterTitle}><b>{no2(activeIndex + 1)}</b>{shown.title}</h2>
              </div>
            )}
            <Spreads
              spreads={layoutSpreads(shown.photos)}
              alt={(n) => `${item.label.en}, ${shown.title}, photograph ${n} by Sandrine Ceuppens`}
              caption={caption}
            />
          </section>
        // Au delà de 24 photos sans chapitres, la planche paginée reprend la
        // main ; en dessous (Japon : 15 et 18), les pages de livre comme ailleurs.
        ) : photos.length > 24 ? (
          <div className={s.grid}>
            <PhotoPager photos={photos} catLabel={`${item.label.en} — ${cat.label.en}`} startIndex={0} />
          </div>
        ) : (
          <Spreads
            spreads={layoutSpreads(photos)}
            alt={(n) => `${item.label.en} — ${cat.label.en} photograph ${n} by Sandrine Ceuppens`}
            caption={caption}
          />
        )}

        {isRoot && (
          <div id="film" style={{ scrollMarginTop: "24px" }}>
            <CaseFilms films={films} lang={lang} />
          </div>
        )}

        {isRoot && item.testimonial && <CaseTestimonial lang={lang} t={item.testimonial} />}

        {isRoot && <CaseClient lang={lang} category={cat.slug} caseSlug={item.slug} />}

        <p className={s.talk}><Link href={`/${lang}/about#contact`}>{talk}</Link></p>

        {/* Tourner la page : le chapitre (ou la pièce) d'avant et d'après,
            en grand, avec son numéro. */}
        <nav className={s.turn} aria-label={lang === "fr" ? "Suite" : "More"}>
          {prevHref ? (
            <Link href={prevHref} className={s.turnLink}>
              <span className={s.turnKind}>← {prevKind} {prevNo}</span>
              <span className={s.turnName}>{prevLabel}</span>
            </Link>
          ) : <span />}
          {nextHref ? (
            <Link href={nextHref} className={`${s.turnLink} ${s.turnNext}`}>
              <span className={s.turnKind}>{nextKind} {nextNo} →</span>
              <span className={s.turnName}>{nextLabel}</span>
            </Link>
          ) : <span />}
        </nav>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: indexLabel, item: `https://www.thegirlwithacamera.com${indexHref}` },
          ...(isRoot
            ? [{ "@type": "ListItem", position: 2, name: item.label[lang] }]
            : [
                { "@type": "ListItem", position: 2, name: item.label[lang], item: `https://www.thegirlwithacamera.com${base}` },
                { "@type": "ListItem", position: 3, name: shown?.title ?? "" },
              ]),
        ],
      }) }} />
    </>
  );
}
