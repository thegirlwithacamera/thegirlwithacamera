import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PHOTO_CATEGORIES, HOME_TILES } from "./photographer/constants";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Photographer",
    description: lang === "fr"
      ? "Portfolio photographique de Sandrine Ceuppens. Hôtels et maisons, restaurants et bars, voyage, portraits. Bruxelles."
      : "Photography portfolio by Sandrine Ceuppens. Hotels and venues, restaurants and bars, travel, portraits. Brussels-based photographer.",
    alternates: { canonical: `/${lang}`, languages: { fr: "/fr", en: "/en" } },
  };
}

// ─────────────────────────────────────────────────────────────
// ACCUEIL — grille de 3 colonnes.
// Une tuile par catégorie, puis les tuiles de HOME_TILES (Film, Travaillons
// ensemble). Les tuiles de catégorie n'affichent aucun texte, celles de
// HOME_TILES en affichent : la grille se lit ainsi comme des travaux d'un côté
// et des portes de l'autre.
// Tout se règle dans app/[lang]/photographer/constants.ts
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
        .cat-tile { display: block; text-decoration: none; }
        .tile-thumb {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #f2f2f2;
        }
        .tile-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .cat-tile:hover .tile-thumb img { transform: scale(1.05); }

        /* Une seule légende pour tout le site : sous l'image, discrète,
           elle ne recouvre jamais la photo. Les catégories sont en gris,
           les deux portes en noir avec une flèche : même taille, signal
           suffisant pour qu'on ne les confonde pas avec du travail. */
        .tile-cap {
          display: block;
          margin-top: 10px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
          text-align: center;
          transition: color 0.25s ease;
        }
        .cat-tile:hover .tile-cap { color: #0a0a0a; }
        .tile-cap.is-door { color: #0a0a0a; }
        .tile-cap.is-door::after { content: " →"; letter-spacing: 0; }
        .door-empty {
          position: absolute;
          inset: 0;
          background: #f4f1ec;
        }

        @media (max-width: 767px) {
          .cat-grid { gap: 8px; padding: 0 12px; }
          .tile-cap { font-size: 8px; letter-spacing: 0.12em; margin-top: 6px; }
        }
      `}</style>

      <h1 className="sr-only">The Girl With A Camera — Sandrine Ceuppens, Photographer Portfolio</h1>
      <main style={{ paddingTop: "16px", background: "#ffffff" }}>
        <div className="cat-grid">
          {PHOTO_CATEGORIES.map((cat, i) => (
            <Link key={cat.slug} href={`/${lang}/photographer/${cat.slug}`} className="cat-tile">
              <span className="tile-thumb">
                <Image
                  src={cat.cover}
                  alt={`${cat.label.en} — photography by Sandrine Ceuppens`}
                  width={1066}
                  height={1600}
                  sizes="(max-width: 767px) 33vw, 360px"
                  priority={i < 3}
                  quality={78}
                  style={cat.coverPosition ? { objectPosition: cat.coverPosition } : undefined}
                />
              </span>
              <span className="tile-cap">{cat.label[lang]}</span>
            </Link>
          ))}

          {HOME_TILES.map((tile) => (
            <Link key={tile.key} href={`/${lang}${tile.href}`} className="cat-tile">
              <span className="tile-thumb">
                {tile.cover ? (
                  <Image
                    src={tile.cover}
                    alt=""
                    width={1066}
                    height={1600}
                    sizes="(max-width: 767px) 33vw, 360px"
                    quality={70}
                    style={tile.coverPosition ? { objectPosition: tile.coverPosition } : undefined}
                  />
                ) : (
                  <span className="door-empty" />
                )}
              </span>
              <span className="tile-cap is-door">{tile.label[lang]}</span>
            </Link>
          ))}
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: "Portfolio by Sandrine Ceuppens",
        description: "Photography portfolio organised by category: hotels and venues, restaurants and bars, travel, portraits",
        associatedMedia: PHOTO_CATEGORIES.map((cat) => ({
          "@type": "ImageObject",
          url: `https://thegirlwithacamera.com${cat.cover}`,
          name: `${cat.label.en} photography`,
          creator: { "@type": "Person", name: "Sandrine Ceuppens" }
        }))
      })}} />
    </>
  );
}
