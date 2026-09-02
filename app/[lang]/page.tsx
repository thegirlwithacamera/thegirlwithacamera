import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { allCases, HOME_TILES } from "./photographer/constants";
import { readCaseCover, readCaseChapters } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

// Génération statique des deux langues au build. Indispensable depuis que
// l'accueil lit public/images avec fs pour trouver les couvertures : sur
// Vercel, next.config.ts exclut public/ des fonctions serveur, donc une page
// rendue à la demande ne voit aucun fichier et la grille sort vide. C'est
// exactement ce qui est arrivé au premier déploiement de cette version.
export function generateStaticParams() {
  return (["fr", "en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta({
    lang,
    path: "",
    // Le title valait "Photographer" tout court : c'est ce que voyaient
    // l'onglet du navigateur et le résultat Google de la page d'accueil.
    title: lang === "fr"
      ? "The Girl With A Camera · Sandrine Ceuppens, photographe et vidéaste à Bruxelles"
      : "The Girl With A Camera · Sandrine Ceuppens, photographer and filmmaker in Brussels",
    description: lang === "fr"
      ? "Photographe et vidéaste pour les hôtels, les maisons d'hôtes, les restaurants et les bars. Sandrine Ceuppens, basée à Bruxelles, en déplacement en Europe."
      : "Photographer and filmmaker for hotels, guesthouses, restaurants and bars. Sandrine Ceuppens, based in Brussels, travelling across Europe.",
  });
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
  //
  // Un cas à chapitres marqué chapterTiles sort une tuile par chapitre plutôt
  // qu'une tuile pour lui. Décision de Sandrine du 02/09 : Altstadt, ce sont
  // neuf chambres dessinées chacune par quelqu'un d'autre, et une vignette
  // unique n'en montrait qu'une. La tuile porte le nom de la chambre, la
  // ligne du dessous dit la maison et la ville, et le lien ouvre la page du
  // lieu à l'ancre du chapitre. Une chambre ne fait pas une page : le cas
  // reste un seul cas, une seule URL, un seul texte.
  const homeCases = allCases().flatMap((c) => {
    if (c.item.chapterTiles) {
      const chapters = readCaseChapters(c.cat.slug, c.item.slug);
      if (chapters.length > 0) {
        return chapters.map((ch) => ({
          ...c,
          key: `${c.cat.slug}/${c.item.slug}/${ch.slug}`,
          cover: ch.photos[0].src,
          name: c.item.chapters?.[ch.slug]?.[lang] ?? ch.slug,
          sub: c.item.place
            ? `${c.item.label[lang]} · ${c.item.place[lang]}`
            : c.item.label[lang],
          href: `${c.href}#${ch.slug}`,
        }));
      }
    }
    const cover = readCaseCover(c.cat.slug, c.item.slug);
    return cover
      ? [{
          ...c,
          key: `${c.cat.slug}/${c.item.slug}`,
          cover,
          name: c.item.short?.[lang] ?? c.item.label[lang],
          sub: c.item.place ? c.item.place[lang] : undefined,
          href: c.href,
        }]
      : [];
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

        /* ── La legende vit sur la photo ──────────────────────────────
           Decision du 01/09 au soir. Douze tuiles portaient chacune deux
           lignes sous l'image, nom et lieu : la grille contenait plus de
           texte que de photos et l'oeil lisait au lieu de regarder.
           Le nom passe sur l'image, court, discret au repos, net au
           survol, et le lieu n'apparait qu'au survol. Le nom complet
           reste sur la page du lieu, dans l'alt et dans le partage.

           Le voile est indispensable : un nom blanc sur un ciel blanc de
           Villach ne se lit pas. Il ne couvre que le bas de l'image et
           s'assombrit legerement au survol.

           Au repos le nom est deja lisible, pas seulement devine : sur
           telephone il n'y a pas de survol, et c'est le seul etat que la
           moitie des visiteurs verra. */
        .tile-veil {
          position: absolute;
          inset: auto 0 0 0;
          height: 46%;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0));
          opacity: 0.78;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .cat-tile:hover .tile-veil { opacity: 1; }

        .tile-name {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 13px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffffff;
          opacity: 0.82;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .cat-tile:hover .tile-name { opacity: 1; }

        /* Le lieu n'existe qu'au survol. Il reste dans le HTML, donc lu par
           un lecteur d'ecran et par Google, simplement invisible au repos. */
        .tile-loc {
          display: block;
          margin-top: 4px;
          font-size: 9px;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.88);
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .cat-tile:hover .tile-loc { opacity: 1; transform: none; }

        .tile-name.is-door::after { content: " →"; letter-spacing: 0; }

        @media (prefers-reduced-motion: reduce) {
          .tile-veil, .tile-name, .tile-loc, .tile-thumb img { transition: none; }
        }

        .door-empty { position: absolute; inset: 0; background: #f4f1ec; }

        @media (max-width: 767px) {
          .cat-grid { gap: 10px; padding: 0 12px; grid-template-columns: repeat(2, 1fr) !important; }
          .tile-name { left: 10px; right: 10px; bottom: 10px; font-size: 9px; letter-spacing: 0.14em; }
          .tile-loc { font-size: 8px; }
        }
      `}</style>

      <h1 className="sr-only">The Girl With A Camera — Sandrine Ceuppens, Photographer Portfolio</h1>
      <main style={{ paddingTop: "16px", background: "#ffffff" }}>
        <div className="cat-grid">
          {homeCases.map((c, i) => (
            <Link key={c.key} href={`/${lang}${c.href}`} className="cat-tile">
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
                <span className="tile-veil" />
                <span className="tile-name">
                  {c.name}
                  {c.sub && <span className="tile-loc">{c.sub}</span>}
                </span>
              </span>
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
                <span className="tile-veil" />
                <span className="tile-name is-door">{tile.label[lang]}</span>
              </span>
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
