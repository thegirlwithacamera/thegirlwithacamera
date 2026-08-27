import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PHOTO_CATEGORIES, findCase } from "../../constants";
import { readCasePhotos, countCasePhotos } from "@/lib/portfolio";
import PhotoPager from "../PhotoPager";

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
  return {
    title: `${item.label[lang]} — ${cat.label[lang]}`,
    description:
      lang === "fr"
        ? `${item.label.fr}${place} — ${cat.label.fr.toLowerCase()} photographiés par Sandrine Ceuppens, The Girl With A Camera.`
        : `${item.label.en}${place} — ${cat.label.en.toLowerCase()} photographed by Sandrine Ceuppens, The Girl With A Camera.`,
    alternates: {
      canonical: `/${lang}/photographer/${cat.slug}/${item.slug}`,
      languages: {
        fr: `/fr/photographer/${cat.slug}/${item.slug}`,
        en: `/en/photographer/${cat.slug}/${item.slug}`,
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Page d'un cas : les images du dossier
// public/images/portfolio/<catégorie>/<cas>/, dans l'ordre des numéros.
// Au delà de 9 images, le pager reprend la main.
// ─────────────────────────────────────────────────────────────

export default async function PhotographerCasePage({ params }: Props) {
  const { lang, category, case: caseSlug } = await params;
  const found = findCase(category, caseSlug);
  if (!found) notFound();
  const { cat, item } = found;

  const photos = readCasePhotos(cat.slug, item.slug);
  if (photos.length === 0) notFound();

  const backLabel =
    lang === "fr" ? `← ${cat.label.fr}` : `← ${cat.label.en}`;

  return (
    <>
      <style>{`
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
        .cat-head .case-place { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #999; }
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
        .photo-cell { display: block; aspect-ratio: 1066 / 1600; overflow: hidden; position: relative; background: #f2f2f2; }
        .photo-cell img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pager-outer { max-width: 1260px; margin: 0 auto; padding: 0 20px; }
        .pager-viewport { overflow: hidden; outline: none; }
        .pager-track { display: flex; transition: transform 0.45s ease; }
        .pager-page {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }
        .pager-dots { display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 28px; }
        .pager-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d4d4d4;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .pager-dot:hover { background: #999; }
        .pager-dot.is-active { background: #0a0a0a; transform: scale(1.4); }
        @media (max-width: 767px) {
          .photo-grid { gap: 8px; padding: 0 12px; }
          .pager-outer { padding: 0 12px; }
          .pager-page { gap: 8px; }
          .cat-head h1 { font-size: 18px; }
        }
      `}</style>

      <main style={{ paddingTop: "16px", paddingBottom: "24px", background: "#ffffff" }}>
        <div className="cat-head">
          <div>
            <Link href={`/${lang}/photographer/${cat.slug}`} className="cat-back">{backLabel}</Link>
          </div>
          <h1>{item.label[lang]}</h1>
          {item.place && <span className="case-place">{item.place[lang]}</span>}
        </div>

        {photos.length > 9 ? (
          <PhotoPager photos={photos} catLabel={`${item.label.en} — ${cat.label.en}`} />
        ) : (
          <div className="photo-grid">
            {photos.map((p, i) => (
              <div key={i} className="photo-cell">
                <Image
                  src={p.src}
                  alt={`${item.label.en} — ${cat.label.en} photograph ${i + 1} by Sandrine Ceuppens`}
                  width={1066}
                  height={1600}
                  sizes="(max-width: 767px) 33vw, 420px"
                  priority={i < 6}
                  quality={75}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
