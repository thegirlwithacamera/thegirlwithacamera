import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { allCases, type PhotoCategory, type PhotoCase } from "../../constants";
import { readCasePhotos, readCaseChapters, readPhotoRatio, countCasePhotos } from "@/lib/portfolio";
import { posterForPath } from "@/lib/creator-videos";
import PhotoPager from "../PhotoPager";
import CaseFilms from "./CaseFilms";
import CaseClient from "../../../components/CaseClient";
import { PageHead, ProjectGrid } from "../../../components/editorial";
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

  const flatRatio = chapters.length === 0 && photos[0] ? readPhotoRatio(photos[0].src) : 1066 / 1600;

  // Cas précédent et suivant, dans l'ordre de constants.ts.
  const live = allCases().filter((c) => countCasePhotos(c.cat.slug, c.item.slug) > 0);
  const at = live.findIndex((c) => c.cat.slug === cat.slug && c.item.slug === item.slug);
  const prevCase = at > 0 ? live[at - 1] : null;
  const nextCase = at >= 0 && at < live.length - 1 ? live[at + 1] : null;

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
  const nextHref = nextChapter ? `${base}/${nextChapter.slug}` : nextCase ? `/${lang}${nextCase.href}` : null;
  const nextLabel = nextChapter
    ? nextChapter.title
    : nextCase ? (nextCase.item.short?.[lang] ?? nextCase.item.label[lang]) : null;

  const talk = cat.citySeries
    ? lang === "fr" ? "Votre ville, vue comme ça ? Parlons-en →" : "Your city, seen like this? Let's talk →"
    : cat.slug === "restaurants"
      ? lang === "fr" ? "Même idée pour votre table ? Parlons-en →" : "Same idea for your table? Let's talk →"
      : lang === "fr" ? "Même idée pour votre maison ? Parlons-en →" : "Same idea for your house? Let's talk →";

  const no = (n: number) => String(n).padStart(2, "0");

  const cell = (src: string, alt: string, priority: boolean, width = 1066, height = 1600, sizes = "(max-width: 767px) 33vw, 400px") => (
    <div key={src} className={s.cell}>
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} quality={75} />
    </div>
  );

  const filmLabel = lang === "fr"
    ? films.length > 1 ? "Les films" : "Le film"
    : films.length > 1 ? "The films" : "The film";

  return (
    <>
      <main className={s.main}>
        <PageHead
          back={{ href: `/${lang}/photographer/${cat.slug}`, label: cat.label[lang] }}
          eyebrow={[cat.label[lang], item.place?.[lang]].filter(Boolean).join(" · ")}
          title={item.label[lang]}
          lede={item.intro ? (
            <>
              {item.intro[lang]}
              {item.shotAt && <span className={s.shot} style={{ display: "block" }}>{item.shotAt[lang]}</span>}
            </>
          ) : undefined}
          split
        >
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
        </PageHead>

        {shown ? (
          <section
            className={`${s.chapter} ${s.first}`}
            style={{ "--cell": String(shown.ratio) } as React.CSSProperties}
          >
            <div className={s.chapterHead}>
              <h2 className={s.chapterTitle}><b>{no(activeIndex + 1)}</b>{shown.title}</h2>
            </div>
            <ProjectGrid tight keep3>
              {shown.photos.map((p, i) =>
                cell(
                  p.src,
                  `${item.label.en}, ${shown.title}, photograph ${i + 1} by Sandrine Ceuppens`,
                  i < 3,
                  Math.round(1600 * shown.ratio),
                  1600,
                  "(max-width: 767px) 33vw, 460px",
                ),
              )}
            </ProjectGrid>
          </section>
        ) : photos.length > 12 ? (
          <div className={s.grid}>
            <PhotoPager photos={photos} catLabel={`${item.label.en} — ${cat.label.en}`} startIndex={0} />
          </div>
        ) : (
          <ProjectGrid tight keep3 className={s.grid} style={{ "--cell": String(flatRatio) } as React.CSSProperties}>
            {photos.map((p, i) =>
              cell(
                p.src,
                `${item.label.en} — ${cat.label.en} photograph ${i + 1} by Sandrine Ceuppens`,
                i < 6,
                Math.round(1600 * flatRatio),
                1600,
              ),
            )}
          </ProjectGrid>
        )}

        {isRoot && (
          <div id="film" style={{ scrollMarginTop: "24px" }}>
            <CaseFilms films={films} lang={lang} />
          </div>
        )}

        {isRoot && <CaseClient lang={lang} category={cat.slug} caseSlug={item.slug} />}

        <nav className={s.next} aria-label={lang === "fr" ? "Suite" : "More"}>
          <div>{prevHref && <Link href={prevHref}>← {prevLabel}</Link>}</div>
          <Link href={`/${lang}/services`} className={s.nextTalk}>{talk}</Link>
          <div className={s.nextRight}>{nextHref && <Link href={nextHref}>{nextLabel} →</Link>}</div>
        </nav>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: lang === "fr" ? "Photographe" : "Photographer", item: `https://thegirlwithacamera.com/${lang}/photographer` },
          { "@type": "ListItem", position: 2, name: cat.label[lang], item: `https://thegirlwithacamera.com/${lang}/photographer/${cat.slug}` },
          ...(isRoot
            ? [{ "@type": "ListItem", position: 3, name: item.label[lang] }]
            : [
                { "@type": "ListItem", position: 3, name: item.label[lang], item: `https://thegirlwithacamera.com${base}` },
                { "@type": "ListItem", position: 4, name: shown?.title ?? "" },
              ]),
        ],
      }) }} />
    </>
  );
}
