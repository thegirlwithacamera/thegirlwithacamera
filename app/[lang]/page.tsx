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

        /* Tuiles de porte : titre lisible sur l'image, ou sur fond crème. */
        .door-tile { background: #f4f1ec; text-decoration: none; }
        .door-tile .door-inner {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 18px;
          gap: 8px;
          z-index: 2;
        }
        .door-tile .door-label {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 17px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #0a0a0a;
          font-weight: 400;
        }
        .door-tile .door-note {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8a8175;
        }
        .door-tile.has-cover .door-label,
        .door-tile.has-cover .door-note { color: #fff; }
        .door-tile.has-cover .door-note { color: rgba(255,255,255,0.82); }
        .door-tile .door-scrim {
          position: absolute;
          inset: 0;
          background: rgba(10,10,10,0.32);
          z-index: 1;
          transition: background 0.4s ease;
        }
        .door-tile:hover .door-scrim { background: rgba(10,10,10,0.44); }

        @media (max-width: 767px) {
          .cat-grid { gap: 8px; padding: 0 12px; }
          .door-tile .door-label { font-size: 11px; letter-spacing: 0.12em; }
          .door-tile .door-note { display: none; }
        }
      `}</style>

      <h1 className="sr-only">The Girl With A Camera — Sandrine Ceuppens, Photographer Portfolio</h1>
      <main style={{ paddingTop: "16px", background: "#ffffff" }}>
        <div className="cat-grid">
          {PHOTO_CATEGORIES.map((cat, i) => (
            <Link key={cat.slug} href={`/${lang}/photographer/${cat.slug}`} className="cat-tile" aria-label={cat.label[lang]}>
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
            </Link>
          ))}

          {HOME_TILES.map((tile) => (
            <Link
              key={tile.key}
              href={`/${lang}${tile.href}`}
              className={`cat-tile door-tile${tile.cover ? " has-cover" : ""}`}
              aria-label={tile.label[lang]}
            >
              {tile.cover && (
                <>
                  <Image
                    src={tile.cover}
                    alt=""
                    width={1066}
                    height={1600}
                    sizes="(max-width: 767px) 33vw, 360px"
                    quality={70}
                    style={tile.coverPosition ? { objectPosition: tile.coverPosition } : undefined}
                  />
                  <span className="door-scrim" />
                </>
              )}
              <span className="door-inner">
                <span className="door-label">{tile.label[lang]}</span>
                {tile.note && <span className="door-note">{tile.note[lang]}</span>}
              </span>
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
