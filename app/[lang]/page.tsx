import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { allCases, HOME_TILES } from "./photographer/constants";
import { readCaseCover } from "@/lib/portfolio";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    // Le title valait "Photographer" tout court : c'est ce que voyaient
    // l'onglet du navigateur et le résultat Google de la page d'accueil.
    title: lang === "fr"
      ? "The Girl With A Camera · Sandrine Ceuppens, photographe et vidéaste à Bruxelles"
      : "The Girl With A Camera · Sandrine Ceuppens, photographer and filmmaker in Brussels",
    description: lang === "fr"
      ? "Photographe et vidéaste pour les hôtels, les maisons d'hôtes, les restaurants et les bars. Sandrine Ceuppens, basée à Bruxelles, en déplacement en Europe."
      : "Photographer and filmmaker for hotels, guesthouses, restaurants and bars. Sandrine Ceuppens, based in Brussels, travelling across Europe.",
    alternates: { canonical: `/${lang}`, languages: { fr: "/fr", en: "/en" } },
  };
}

// ─────────────────────────────────────────────────────────────
// ACCUEIL — tous les projets, un par tuile, puis les deux portes.
//
// Décision de Sandrine du 01/09 en fin de journée : l'accueil montre TOUT,
// projet par projet. Avant, il montrait trois maisons choisies plus une
// porte « Tout le portfolio » ; la page d'accueil EST le portfolio.
//
// L'ordre vient de constants.ts : maisons, tables, villes. Un cas ajouté
// là-bas apparaît ici tout seul.
//
// Trois colonnes sur ordinateur, deux sur téléphone, quel que soit le
// nombre de tuiles. L'ancien calcul passait à deux colonnes dès que le
// total n'était plus un multiple de trois, ce qui devient absurde quand la
// grille grandit.
// ─────────────────────────────────────────────────────────────

export default async function HomePage({ params }: Props) {
  const { lang } = await params;

  // Un cas déclaré mais sans images ne s'affiche pas.
  const homeCases = allCases().flatMap((c) => {
    const cover = readCaseCover(c.cat.slug, c.item.slug);
    return cover ? [{ ...c, cover }] : [];
  });

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
        /* Nom du client en noir, ville et année en gris juste dessous :
           la tuile dit qui, où et quand sans ouvrir la page. */
        .tile-cap.is-case { color: #0a0a0a; }
        .tile-place {
          display: block;
          margin-top: 3px;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #999;
          text-align: center;
        }
        .tile-cap.is-door { color: #0a0a0a; }
        .tile-cap.is-door::after { content: " →"; letter-spacing: 0; }
        .door-empty { position: absolute; inset: 0; background: #f4f1ec; }

        @media (max-width: 767px) {
          .cat-grid { gap: 10px; padding: 0 12px; grid-template-columns: repeat(2, 1fr) !important; }
          .tile-cap { font-size: 9px; letter-spacing: 0.14em; margin-top: 7px; }
        }
      `}</style>

      <h1 className="sr-only">The Girl With A Camera — Sandrine Ceuppens, Photographer Portfolio</h1>
      <main style={{ paddingTop: "16px", background: "#ffffff" }}>
        <div className="cat-grid">
          {homeCases.map((c, i) => (
            <Link key={`${c.cat.slug}/${c.item.slug}`} href={`/${lang}${c.href}`} className="cat-tile">
              <span className="tile-thumb">
                <Image
                  src={c.cover}
                  alt={c.item.intro ? c.item.intro.en : `${c.item.label.en} — ${c.cat.label.en} photographed by Sandrine Ceuppens`}
                  width={1066}
                  height={1600}
                  sizes="(max-width: 767px) 50vw, 380px"
                  priority={i < 2}
                  quality={78}
                  style={c.item.coverPosition ? { objectPosition: c.item.coverPosition } : undefined}
                />
              </span>
              <span className="tile-cap is-case">{c.item.label[lang]}</span>
              {c.item.place && <span className="tile-place">{c.item.place[lang]}</span>}
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
                    sizes="(max-width: 767px) 50vw, 380px"
                    quality={72}
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
        description: "Hotels, guesthouses, restaurants and bars photographed by Sandrine Ceuppens across Europe",
        associatedMedia: homeCases.map((c) => ({
          "@type": "ImageObject",
          url: `https://thegirlwithacamera.com${c.cover}`,
          name: `${c.item.label.en}${c.item.place ? `, ${c.item.place.en}` : ""}`,
          creator: { "@type": "Person", name: "Sandrine Ceuppens" }
        }))
      })}} />
    </>
  );
}
