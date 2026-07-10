import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PHOTO_CATEGORIES } from "../constants";
import { readCategoryPhotos } from "@/lib/portfolio";

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
  const cat = PHOTO_CATEGORIES.find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: `${cat.label} — Photographer`,
    description:
      lang === "fr"
        ? `${cat.label} — photographies par Sandrine Ceuppens, The Girl With A Camera. Bruxelles.`
        : `${cat.label} — photography by Sandrine Ceuppens, The Girl With A Camera. Brussels-based.`,
    alternates: {
      canonical: `/${lang}/photographer/${cat.slug}`,
      languages: { fr: `/fr/photographer/${cat.slug}`, en: `/en/photographer/${cat.slug}` },
    },
  };
}

export default async function PhotographerCategoryPage({ params }: Props) {
  const { lang, category } = await params;
  const cat = PHOTO_CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  // Photos triées dans public/images/portfolio/<slug>/. Tant que le dossier
  // est vide, on montre la photo de couverture seule.
  const photos = readCategoryPhotos(cat.slug);
  const list = photos.length > 0 ? photos : [{ src: cat.cover }];
  const empty = photos.length === 0;
  const emptyNote = lang === "fr" ? "Sélection à venir." : "Selection coming soon.";
  const backLabel = lang === "fr" ? "← Toutes les catégories" : "← All categories";

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
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .photo-grid.is-empty { max-width: 460px; grid-template-columns: 1fr; }
        .photo-cell { display: block; aspect-ratio: 1066 / 1600; overflow: hidden; position: relative; background: #f2f2f2; }
        .photo-cell img { width: 100%; height: 100%; object-fit: cover; display: block; }
        @media (max-width: 767px) {
          .photo-grid { gap: 8px; padding: 0 12px; }
          .cat-head h1 { font-size: 18px; }
        }
      `}</style>

      <main style={{ paddingTop: "16px", paddingBottom: "60px", background: "#ffffff" }}>
        <div className="cat-head">
          <div>
            <Link href={`/${lang}`} className="cat-back">{backLabel}</Link>
          </div>
          <h1>{cat.label}</h1>
          {empty && <p className="cat-note">{emptyNote}</p>}
        </div>

        <div className={`photo-grid${empty ? " is-empty" : ""}`}>
          {list.map((p, i) => (
            <div key={i} className="photo-cell">
              <Image
                src={p.src}
                alt={`${cat.label} photograph ${i + 1} by Sandrine Ceuppens`}
                width={1066}
                height={1600}
                sizes="(max-width: 767px) 33vw, 420px"
                priority={i < 6}
                quality={75}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
