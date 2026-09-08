import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PHOTO_CATEGORIES, findCase } from "../../constants";
import { readCasePhotos, countCasePhotos, readCaseCover, readCaseChapters, readPhotoRatio } from "@/lib/portfolio";
import { posterForPath } from "@/lib/creator-videos";
import PhotoPager from "../PhotoPager";
import CaseFilms from "./CaseFilms";
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
  return pageMeta({
    lang,
    path: `/photographer/${cat.slug}/${item.slug}`,
    type: "article",
    title: `${item.label[lang]} · ${cat.label[lang]}`,
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

  // Image d'ouverture : la première du cas, ou du premier chapitre.
  const opening = item.openingImage === false ? null : photos[0];
  const openingRatio = opening ? readPhotoRatio(opening.src) : 1;
  const openingAlt = item.intro
    ? `${item.label.en}, ${item.intro.en}`
    : `${item.label.en} — ${cat.label.en} photographed by Sandrine Ceuppens`;

  const rest = opening ? photos.slice(1) : photos;
  const firstChapterRest = opening && chapters.length > 0 ? chapters[0].photos.slice(1) : null;

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
          eyebrow={cat.label[lang]}
          title={item.label[lang]}
          meta={[item.place?.[lang]]}
          lede={item.intro?.[lang]}
        >
          {item.shotAt && <p className={s.shot}>{item.shotAt[lang]}</p>}
        </PageHead>

        {opening && (
          <figure className={s.opening}>
            <Image
              src={opening.src}
              alt={openingAlt}
              width={Math.round(1600 * openingRatio)}
              height={1600}
              sizes="(max-width: 767px) 100vw, 1200px"
              priority
              quality={80}
            />
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
                {/* Le premier chapitre porte le nom de la maison : son titre
                    ferait doublon avec le h1 juste au dessus. */}
                {ci > 0 && (
                  <div className={s.chapterHead}>
                    <h2 className={s.chapterTitle}>{ch.title}</h2>
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
          <ProjectGrid tight keep3 className={s.grid}>
            {rest.map((p, i) =>
              cell(
                p.src,
                `${item.label.en} — ${cat.label.en} photograph ${i + (opening ? 2 : 1)} by Sandrine Ceuppens`,
                i < 6,
              ),
            )}
          </ProjectGrid>
        )}

        <CaseFilms films={films} lang={lang} />
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
