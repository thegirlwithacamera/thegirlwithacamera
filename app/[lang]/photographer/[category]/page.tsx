import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PHOTO_CATEGORIES, findCategory } from "../constants";
import { readCaseCover, countCasePhotos } from "@/lib/portfolio";

interface Props {
  params: Promise<{ lang: "fr" | "en"; category: string }>;
}

export function generateStaticParams() {
  return (["fr", "en"] as const).flatMap((lang) =>
    PHOTO_CATEGORIES.map((c) => ({ lang, category: c.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category } = await params;
  const cat = findCategory(category);
  if (!cat) return {};
  return {
    title: `${cat.label[lang]} — Photographer`,
    description:
      lang === "fr"
        ? `${cat.label.fr} — photographies par Sandrine Ceuppens, The Girl With A Camera. Bruxelles.`
        : `${cat.label.en} — photography by Sandrine Ceuppens, The Girl With A Camera. Brussels-based.`,
    alternates: {
      canonical: `/${lang}/photographer/${cat.slug}`,
      languages: { fr: `/fr/photographer/${cat.slug}`, en: `/en/photographer/${cat.slug}` },
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Page d'une catégorie : la grille des cas (un client, une destination,
// une série). Un cas déclaré dans constants.ts mais dont le dossier d'images
// est vide n'apparaît pas.
// ─────────────────────────────────────────────────────────────

export default async function PhotographerCategoryPage({ params }: Props) {
  const { lang, category } = await params;
  const cat = findCategory(category);
  if (!cat) notFound();

  const cases = cat.cases
    .map((c) => ({
      ...c,
      cover: readCaseCover(cat.slug, c.slug),
      count: countCasePhotos(cat.slug, c.slug),
    }))
    .filter((c) => c.cover !== null);

  const backLabel = lang === "fr" ? "← Toutes les catégories" : "← All categories";
  const emptyNote = lang === "fr" ? "Sélection à venir." : "Selection coming soon.";

  return (
    <>
      <style>{`
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
        .cat-head { text-align: center; padding: 8px 20px 28px; }
        .cat-head h1 {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 26px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          margin: 0 0 6px;
          font-weight: 400;
        }
        .cat-head .cat-note { font-size: 11px; letter-spacing: 0.14em; color: #999; font-style: italic; }
        .cat-back {
          display: inline-block;
          margin: 0 auto 4px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          text-decoration: none;
        }
        .cat-back:hover { color: #0a0a0a; }
        .case-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .case-card { display: block; text-decoration: none; }
        .case-thumb {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #f2f2f2;
        }
        .case-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .case-card:hover .case-thumb img { transform: scale(1.05); }
        .case-meta { padding: 12px 2px 0; text-align: center; }
        .case-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 15px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0a0a0a;
          margin: 0;
          font-weight: 400;
        }
        .case-place {
          display: block;
          margin-top: 4px;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #999;
        }
        @media (max-width: 767px) {
          .case-grid { gap: 10px; padding: 0 12px; }
          .cat-head h1 { font-size: 18px; }
          .case-title { font-size: 11px; letter-spacing: 0.08em; }
          .case-place { font-size: 9px; }
          .case-meta { padding-top: 8px; }
        }
      `}</style>

      <main style={{ paddingTop: "16px", paddingBottom: "48px", background: "#ffffff" }}>
        <div className="cat-head">
          <div>
            <Link href={`/${lang}`} className="cat-back">{backLabel}</Link>
          </div>
          <h1>{cat.label[lang]}</h1>
          {cases.length === 0 && <p className="cat-note">{emptyNote}</p>}
        </div>

        {cases.length > 0 && (
          <div className="case-grid">
            {cases.map((c, i) => (
              <Link
                key={c.slug}
                href={`/${lang}/photographer/${cat.slug}/${c.slug}`}
                className="case-card"
              >
                <div className="case-thumb">
                  <Image
                    src={c.cover as string}
                    alt={`${c.label.en} — ${cat.label.en} photography by Sandrine Ceuppens`}
                    width={1066}
                    height={1600}
                    sizes="(max-width: 767px) 33vw, 420px"
                    priority={i < 3}
                    quality={78}
                    style={c.coverPosition ? { objectPosition: c.coverPosition } : undefined}
                  />
                </div>
                <div className="case-meta">
                  <p className="case-title">{c.label[lang]}</p>
                  {c.place && <span className="case-place">{c.place[lang]}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
