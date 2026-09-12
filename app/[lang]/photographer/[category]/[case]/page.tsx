import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PHOTO_CATEGORIES, allCases, findCase } from "../../constants";
import { readCasePhotos, countCasePhotos, readCaseCover, readCaseChapters, readPhotoRatio } from "@/lib/portfolio";
import { posterForPath } from "@/lib/creator-videos";
import PhotoPager from "../PhotoPager";
import CaseFilms from "./CaseFilms";
import CaseClient from "../../../components/CaseClient";
import { pageMeta } from "@/lib/seo";
import { PageHead, ProjectGrid } from "../../../components/editorial";
import s from "./page.module.css";

interface Props {
  params: Promise<{ lang: "fr" | "en"; category: string; case: string }>;
}

export function generateStaticParams() {
  return (["fr", "en"] as const).flatMap((lang) =>
    PHOTO_CATEGORIES.flatMap((cat) =>
      cat.cases
        .filter((c) => countCasePhotos(cat.slug, c.slug) > 0)
        .map((c) => ({ lang, category: cat.slug, case: c.slug })),
    ),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category, case: caseSlug } = await params;
  const found = findCase(category, caseSlug);
  if (!found) return {};
  const { cat, item } = found;
  const place = item.place ? `, ${item.place[lang]}` : "";
  // Le titre porte le métier et la ville : "Altstadt Vienna, an SLH Hotel ·
  // Photographe d'hôtel à Vienne". Le nom du lieu seul ne se cherche pas,
  // le métier plus la ville, si. La ville vient de `place`, avant la virgule.
  const town = item.place?.[lang].split(",")[0].trim();
  // Séries de ville : le nom du cas est déjà la ville, et `place` ne porte
  // que le pays. Le titre dit alors "Venise, Italie · Photographe de voyage",
  // pas "photographe de voyage à Italie".
  const where = cat.citySeries
    ? lang === "fr" ? "Photographe de voyage" : "Travel photographer"
    : (() => {
        const trade = cat.slug === "restaurants"
          ? lang === "fr" ? "Photographe de restaurant" : "Restaurant photographer"
          : lang === "fr" ? "Photographe d'hôtel" : "Hotel photographer";
        return town ? (lang === "fr" ? `${trade} à ${town}` : `${trade} in ${town}`) : trade;
      })();
  const heading = cat.citySeries && item.place
    ? `${item.label[lang]}, ${item.place[lang]}`
    : item.label[lang];
  return pageMeta({
    lang,
    path: `/photographer/${cat.slug}/${item.slug}`,
    type: "article",
    title: `${heading} · ${where}`,
    // La phrase du cas fait une meilleure description que le gabarit : elle
    // décrit le lieu au lieu de répéter la catégorie.
    description: item.intro
      ? item.intro[lang]
      : lang === "fr"
        ? `${item.label.fr}${place}, ${cat.label.fr.toLowerCase()} photographiés par Sandrine Ceuppens, The Girl With A Camera.`
        : `${item.label.en}${place}, ${cat.label.en.toLowerCase()} photographed by Sandrine Ceuppens, The Girl With A Camera.`,
    // La carte de partage montre la maison, pas le logo du site : c'est ce
    // lien qu'on envoie à l'hôtel. coverImage l'emporte quand la première
    // image du cas ne fait pas une bonne carte : Altstadt ouvre sur
    // l'escalier, mais c'est une chambre qu'on veut sur le lien envoyé.
    image: item.coverImage ?? readCaseCover(cat.slug, item.slug) ?? undefined,
    imageAlt: `${item.label[lang]}${place}`,
  });
}

// "01-suite-du-toit" donne "Suite du toit". Le numéro sert à l'ordre des
// dossiers, il ne s'affiche pas. Une seule majuscule, en tête : ce sont des
// noms de pièces en français, pas des titres à l'anglaise.
function chapterTitle(slug: string): string {
  const t = slug.replace(/^\d+[\s._-]*/, "").replace(/[-_]+/g, " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : slug;
}

// ─────────────────────────────────────────────────────────────
// Page d'un cas : ouverture éditoriale (titre, lieu, date, intro), la
// première image seule dans son format, puis les images du dossier
// public/images/portfolio/<catégorie>/<cas>/ dans l'ordre des numéros.
// Au delà de 12 images, le pager reprend la main.
// ─────────────────────────────────────────────────────────────

export default async function PhotographerCasePage({ params }: Props) {
  const { lang, category, case: caseSlug } = await params;
  const found = findCase(category, caseSlug);
  if (!found) notFound();
  const { cat, item } = found;

  const photos = readCasePhotos(cat.slug, item.slug);
  if (photos.length === 0) notFound();

  const chapters = readCaseChapters(cat.slug, item.slug).map((ch) => ({
    ...ch,
    title: item.chapters?.[ch.slug]?.[lang] ?? chapterTitle(ch.slug),
  }));

  const films = (item.films ?? []).map((f) => ({
    src: f.src,
    poster: posterForPath(f.src),
    label: item.films!.length > 1 ? f.label?.[lang] : undefined,
  }));

  // Image d'ouverture : une photo dédiée si le cas en déclare une, sinon la
  // première du cas ou du premier chapitre. Une image dédiée ne consomme
  // aucune photo de la grille, donc rien ne disparaît des chapitres.
  const openingOwn = item.openingSrc ? { src: item.openingSrc } : null;
  const opening = openingOwn
    ?? (item.openingImage === true || (item.openingImage !== false && chapters.length > 0) ? photos[0] : null);
  const openingTakesFirst = !openingOwn && !!opening;
  const openingAlt = item.intro
    ? `${item.label.en}, ${item.intro.en}`
    : `${item.label.en} — ${cat.label.en} photographed by Sandrine Ceuppens`;

  const rest = openingTakesFirst ? photos.slice(1) : photos;
  // Cas sans chapitres : les cellules prennent le format de la première
  // image de la grille. Le portrait 4:5 reste la règle, mais un cas livré en
  // paysage (Sélys, 3:2) s'affiche en paysage, sans recadrage imposé.
  const flatRatio = chapters.length === 0 && rest[0] ? readPhotoRatio(rest[0].src) : 1066 / 1600;
  const firstChapterRest = openingTakesFirst && chapters.length > 0 ? chapters[0].photos.slice(1) : null;

  // Cas précédent et suivant, dans l'ordre de constants.ts, tous cas confondus.
  const live = allCases().filter((c) => countCasePhotos(c.cat.slug, c.item.slug) > 0);
  const at = live.findIndex((c) => c.cat.slug === cat.slug && c.item.slug === item.slug);
  const prev = at > 0 ? live[at - 1] : null;
  const next = at >= 0 && at < live.length - 1 ? live[at + 1] : null;
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
            <nav className={s.chips} aria-label={lang === "fr" ? "Chapitres" : "Chapters"}>
              {chapters.length > 1 && chapters.map((ch) => (
                <a key={ch.slug} href={`#${ch.slug}`} className={s.chip}>{ch.title}</a>
              ))}
              {/* Le film vit tout en bas, apres toutes les photos. Sans cette
                  pastille, un visiteur venu pour lui doit traverser quatre
                  vingts images pour le trouver. */}
              {films.length > 0 && (
                <a href="#film" className={`${s.chip} ${s.chipFilm}`}>
                  {lang === "fr" ? (films.length > 1 ? "Les films" : "Le film") : films.length > 1 ? "The films" : "The film"}
                </a>
              )}
            </nav>
          )}
        </PageHead>

        {opening && (
          <figure className={s.opening}>
            <span className={s.openingFrame}>
              <Image
                src={opening.src}
                alt={openingAlt}
                width={openingOwn ? 1800 : 1066}
                height={openingOwn ? 1200 : 1600}
                sizes="(max-width: 767px) 100vw, 1200px"
                priority
                quality={80}
                style={{ objectPosition: item.openingPosition ?? "50% 50%" }}
              />
            </span>
            <figcaption className={s.openingCap}>
              <b>01</b>{chapters.length > 0 ? chapters[0].title : item.label[lang]}
            </figcaption>
          </figure>
        )}

        {chapters.length > 0 ? (
          chapters.map((ch, ci) => {
            const list = ci === 0 && firstChapterRest ? firstChapterRest : ch.photos;
            return (
              <section
                key={ch.slug}
                id={ch.slug}
                className={`${s.chapter} ${ci === 0 ? s.first : ""}`}
                style={{ "--cell": String(ch.ratio) } as React.CSSProperties}
              >
                {/* Le premier chapitre est déjà nommé sous l'image d'ouverture. */}
                {ci > 0 && (
                  <div className={s.chapterHead}>
                    <h2 className={s.chapterTitle}><b>{no(ci + 1)}</b>{ch.title}</h2>
                  </div>
                )}
                {list.length > 0 && (
                  <ProjectGrid tight keep3>
                    {list.map((p, i) =>
                      cell(
                        p.src,
                        `${item.label.en}, ${ch.title}, photograph ${i + 1} by Sandrine Ceuppens`,
                        ci === 0 && i < 3,
                        Math.round(1600 * ch.ratio),
                        1600,
                        "(max-width: 767px) 33vw, 460px",
                      ),
                    )}
                  </ProjectGrid>
                )}
              </section>
            );
          })
        ) : rest.length > 12 ? (
          <div className={s.grid}>
            <PhotoPager photos={rest} catLabel={`${item.label.en} — ${cat.label.en}`} startIndex={opening ? 1 : 0} />
          </div>
        ) : (
          <ProjectGrid tight keep3 className={s.grid} style={{ "--cell": String(flatRatio) } as React.CSSProperties}>
            {rest.map((p, i) =>
              cell(
                p.src,
                `${item.label.en} — ${cat.label.en} photograph ${i + (opening ? 2 : 1)} by Sandrine Ceuppens`,
                i < 6,
                Math.round(1600 * flatRatio),
                1600,
              ),
            )}
          </ProjectGrid>
        )}

        <div id="film" style={{ scrollMarginTop: "24px" }}>
          <CaseFilms films={films} lang={lang} />
        </div>

        <CaseClient lang={lang} category={cat.slug} caseSlug={item.slug} />

        <nav className={s.next} aria-label={lang === "fr" ? "Autres projets" : "Other projects"}>
          <div>{prev && <Link href={`/${lang}${prev.href}`}>← {prev.item.short?.[lang] ?? prev.item.label[lang]}</Link>}</div>
          <Link href={`/${lang}/services`} className={s.nextTalk}>{talk}</Link>
          <div className={s.nextRight}>{next && <Link href={`/${lang}${next.href}`}>{next.item.short?.[lang] ?? next.item.label[lang]} →</Link>}</div>
        </nav>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: lang === "fr" ? "Photographe" : "Photographer", item: `https://thegirlwithacamera.com/${lang}/photographer` },
          { "@type": "ListItem", position: 2, name: cat.label[lang], item: `https://thegirlwithacamera.com/${lang}/photographer/${cat.slug}` },
          { "@type": "ListItem", position: 3, name: item.label[lang] },
        ],
      }) }} />
    </>
  );
}
