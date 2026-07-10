import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PHOTO_CATEGORIES } from "./photographer/constants";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Photographer",
    description: lang === "fr"
      ? "Portfolio photographique de Sandrine Ceuppens. Street, portrait, fashion, studio, travel, details, beauty. Bruxelles."
      : "Photography portfolio by Sandrine Ceuppens. Street, portrait, fashion, studio, travel, details, beauty. Brussels-based photographer.",
    alternates: { canonical: `/${lang}`, languages: { fr: "/fr", en: "/en" } },
  };
}

// ─────────────────────────────────────────────────────────────
// ACCUEIL — grille 3×3 : une catégorie par tuile, une photo par catégorie.
// Les catégories et leurs photos de couverture se règlent dans
// app/[lang]/photographer/constants.ts
// Chaque tuile mène à /photographer/<slug>.
// ─────────────────────────────────────────────────────────────

export default async function HomePage({ params }: Props) {
  const { lang } = await params;

  return (
    <>
      <style>{`
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .cat-tile {
          display: block;
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #f2f2f2;
        }
        .cat-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .cat-tile:hover img { transform: scale(1.05); }
        .cat-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%);
          transition: background 0.3s;
        }
        .cat-tile:hover .cat-scrim {
          background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
        }
        .cat-label {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 16px;
          text-align: center;
          font-family: var(--font-serif), Georgia, serif;
          font-size: 17px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ffffff;
          text-shadow: 0 1px 8px rgba(0,0,0,0.35);
        }
        @media (max-width: 767px) {
          .cat-grid { gap: 8px; padding: 0 12px; }
          .cat-label { font-size: 10px; letter-spacing: 0.1em; bottom: 8px; }
        }
      `}</style>

      <h1 className="sr-only">The Girl With A Camera — Sandrine Ceuppens, Photographer Portfolio</h1>
      <main style={{ paddingTop: "16px", background: "#ffffff" }}>
        <div className="cat-grid">
          {PHOTO_CATEGORIES.map((cat, i) => (
            <Link key={cat.slug} href={`/${lang}/photographer/${cat.slug}`} className="cat-tile" aria-label={cat.label}>
              <Image
                src={cat.cover}
                alt={`${cat.label} — photography by Sandrine Ceuppens`}
                width={1066}
                height={1600}
                sizes="(max-width: 767px) 33vw, 360px"
                priority={i < 3}
                quality={78}
              />
              <span className="cat-scrim" />
              <span className="cat-label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: "Portfolio by Sandrine Ceuppens",
        description: "Photography portfolio organised by category: street, portrait, fashion, studio, travel, details, beauty, architecture, black & white",
        associatedMedia: PHOTO_CATEGORIES.map((cat) => ({
          "@type": "ImageObject",
          url: `https://thegirlwithacamera.com${cat.cover}`,
          name: `${cat.label} photography`,
          creator: { "@type": "Person", name: "Sandrine Ceuppens" }
        }))
      })}} />
    </>
  );
}
