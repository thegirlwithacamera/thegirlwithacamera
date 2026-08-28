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
      ? "Portfolio photographique de Sandrine Ceuppens. Hôtels et maisons, restaurants et bars, voyage, portraits. Bruxelles."
      : "Photography portfolio by Sandrine Ceuppens. Hotels and venues, restaurants and bars, travel, portraits. Brussels-based photographer.",
    alternates: { canonical: `/${lang}`, languages: { fr: "/fr", en: "/en" } },
  };
}

// ─────────────────────────────────────────────────────────────
// ACCUEIL — une tuile par catégorie, rien d'autre.
//
// Les tuiles Film et Travaillons ensemble ont été retirées le 27/08 : elles
// dupliquaient Vidéaste et À propos, déjà dans le menu, et une tuile qui est
// un bouton déguisé en photo se repère tout de suite. Le lien commercial
// reste, en une ligne sous la grille.
//
// Nombre de colonnes : 3 si le nombre de catégories est un multiple de 3,
// 2 sinon. Avec 4 catégories, 2 colonnes donnent des images deux fois plus
// grandes et aucune rangée bancale.
//
// Tout se règle dans app/[lang]/photographer/constants.ts
// ─────────────────────────────────────────────────────────────

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const cols = PHOTO_CATEGORIES.length % 3 === 0 ? 3 : 2;
  const workLabel = lang === "fr" ? "Travaillons ensemble" : "Work with me";

  return (
    <>
      <style>{`
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
        .cat-grid {
          display: grid;
          gap: 22px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
        }
        /* Lien commercial : une ligne sous la grille, pas une tuile. */
        .home-work {
          display: block;
          margin: 44px auto 8px;
          text-align: center;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 1px solid #d8d2c8;
          padding-bottom: 5px;
          width: fit-content;
          transition: border-color 0.25s ease;
        }
        .home-work:hover { border-color: #0a0a0a; }
        .cat-tile { display: block; text-decoration: none; }
        .tile-thumb {
          /* span : sans display block, aspect-ratio et position sont ignorés
             et la grille s'effondre. */
          display: block;
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

        @media (max-width: 767px) {
          .cat-grid { gap: 10px; padding: 0 12px; grid-template-columns: repeat(2, 1fr) !important; }
          .tile-cap { font-size: 9px; letter-spacing: 0.14em; margin-top: 7px; }
          .home-work { margin-top: 34px; font-size: 10px; }
        }
      `}</style>

      <h1 className="sr-only">The Girl With A Camera — Sandrine Ceuppens, Photographer Portfolio</h1>
      <main style={{ paddingTop: "16px", background: "#ffffff" }}>
        <div className="cat-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {PHOTO_CATEGORIES.map((cat, i) => (
            <Link key={cat.slug} href={`/${lang}/photographer/${cat.slug}`} className="cat-tile">
              <span className="tile-thumb">
                <Image
                  src={cat.cover}
                  alt={`${cat.label.en} — photography by Sandrine Ceuppens`}
                  width={1066}
                  height={1600}
                  sizes="(max-width: 767px) 50vw, 540px"
                  priority={i < 2}
                  quality={78}
                  style={cat.coverPosition ? { objectPosition: cat.coverPosition } : undefined}
                />
              </span>
              <span className="tile-cap">{cat.label[lang]}</span>
            </Link>
          ))}

        </div>

        <Link href={`/${lang}/about#travailler-avec-moi`} className="home-work">
          {workLabel} →
        </Link>
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
