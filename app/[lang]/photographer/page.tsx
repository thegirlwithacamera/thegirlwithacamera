import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PHOTO_CATEGORIES } from "./constants";
import { readCaseCover } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export function generateStaticParams() {
  return (["fr", "en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta({
    lang,
    path: "/photographer",
    // Pas de suffixe ici : le gabarit du layout l'ajoute.
    title:
      lang === "fr"
        ? "Photographe hôtellerie et restauration à Bruxelles"
        : "Hospitality and restaurant photographer in Brussels",
    description:
      lang === "fr"
        ? "Sandrine Ceuppens photographie hôtels, maisons d'hôtes, restaurants et bars en Europe. Basée à Bruxelles, disponible en déplacement."
        : "Sandrine Ceuppens photographs hotels, guesthouses, restaurants and bars across Europe. Based in Brussels, available for travel.",
  });
}

// ─────────────────────────────────────────────────────────────
// Page Photographe : la grille de tous les cas, nommés.
//
// Créée le 01/09. /photographer renvoyait une 404 : il n'y avait que les
// pages de catégorie, et la nav pointait vers l'accueil. Une entrée de menu
// qui ramène à la page d'accueil n'est pas une page, et c'est celle-ci qui
// peut se positionner sur « photographe hôtellerie Bruxelles ».
//
// Deux blocs, dans cet ordre :
//   1. les lieux, maisons puis tables ;
//   2. les séries de ville, sous leur propre titre.
//
// La distinction vient de `citySeries` dans constants.ts. Le second bloc
// s'appelait « Séries personnelles » : le mot disait loisir alors que c'est
// une offre, celle qu'achètent les offices du tourisme et les compagnies de
// train. Il se vend maintenant comme tel, avec sa propre phrase.
//
// Les pages de catégorie restent en ligne, hors de la navigation : ce sont
// les seules qui peuvent se positionner sur « photographe hôtel Vienne ».
// On y arrive par l'étiquette sous chaque tuile.
// ─────────────────────────────────────────────────────────────

type Row = {
  key: string;
  href: string;
  cover: string;
  title: string;
  place?: string;
  categoryLabel: string;
  categoryHref: string;
  altEn: string;
  hasFilm: boolean;
};

function buildRows(lang: "fr" | "en", citySeries: boolean): Row[] {
  return PHOTO_CATEGORIES.filter((cat) => Boolean(cat.citySeries) === citySeries).flatMap((cat) =>
    cat.cases.flatMap((item) => {
      const cover = readCaseCover(cat.slug, item.slug);
      if (!cover) return [];
      return [{
        key: `${cat.slug}/${item.slug}`,
        href: `/${lang}/photographer/${cat.slug}/${item.slug}`,
        cover,
        title: item.label[lang],
        place: item.place?.[lang],
        categoryLabel: cat.label[lang],
        categoryHref: `/${lang}/photographer/${cat.slug}`,
        altEn: item.intro
          ? `${item.label.en}, ${item.intro.en}`
          : `${item.label.en} — ${cat.label.en} photography by Sandrine Ceuppens`,
        hasFilm: (item.films?.length ?? 0) > 0,
      }];
    }),
  );
}

export default async function PhotographerPage({ params }: Props) {
  const { lang } = await params;
  const places = buildRows(lang, false);
  const cities = buildRows(lang, true);

  const intro =
    lang === "fr"
      ? "Je photographie des lieux qui reçoivent et les gens qui les font vivre. Maisons, tables, rues et voyages, en lumière naturelle, sans mise en scène ajoutée."
      : "I photograph places that welcome people, and the people who keep them running. Houses, tables, streets and journeys, in natural light, with nothing staged on top.";
  const citiesHead = lang === "fr" ? "Voyage" : "Travel";
  const citiesSub = lang === "fr" ? "Mon œil sur la ville" : "The city, the way I see it";
  const citiesLede =
    lang === "fr"
      ? "Une ville regardée à cinq heures du matin, les marchés avant la foule, les rues avant qu'elles se remplissent. Pour un office du tourisme, une compagnie de train, ou une maison qui veut montrer sa ville autant que ses murs."
      : "A city at five in the morning, the markets before the crowd, the streets before they fill. For a tourism board, a rail company, or a house that wants to show its city as much as its walls.";
  const ctaText = lang === "fr" ? "Un projet en tête ?" : "Have a project in mind?";
  const ctaLink = lang === "fr" ? "Travaillons ensemble →" : "Work with me →";

  // Trois colonnes des qu'il y a trois cas, quel que soit le total. L'ancien
  // calcul passait a deux colonnes des que le nombre n'etait plus un multiple
  // de trois : avec quatre maisons, la page affichait deux enormes vignettes
  // par rangee. Le meme calcul avait ete retire de l'accueil le 01/09, il
  // dormait encore ici.
  const cols = (n: number) => (n <= 2 ? n : 3);

  const grid = (rows: Row[]) => (
    <div
      className="case-grid"
      style={{
        // Largeur d'une vignette, en flex : la place restante moins les
        // gouttieres, divisee par le nombre de colonnes.
        ["--cols" as string]: String(cols(rows.length)),
        maxWidth: cols(rows.length) === 1 ? "460px" : cols(rows.length) === 2 ? "900px" : undefined,
      }}
    >
      {rows.map((r, i) => (
        <div key={r.key} className="case-item">
          <Link href={r.href} className="case-card">
            <div className="case-thumb">
              <Image
                src={r.cover}
                alt={r.altEn}
                width={1066}
                height={1600}
                sizes="(max-width: 767px) 50vw, 420px"
                priority={i < 3}
                quality={78}
              />
              {r.hasFilm && (
                <span className="case-film-flag" aria-hidden="true">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              )}
            </div>
            <div className="case-meta">
              <p className="case-title">
                {r.title}
                {r.place && <span className="case-place">{r.place}</span>}
              </p>
            </div>
          </Link>
          <Link href={r.categoryHref} className="case-cat">{r.categoryLabel}</Link>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <style>{`
        .cat-head { text-align: center; padding: 8px 20px 10px; }
        .cat-head h1 {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 26px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          margin: 0 0 6px;
          font-weight: 400;
        }
        .page-intro {
          max-width: 560px;
          margin: 14px auto 34px;
          padding: 0 20px;
          font-size: 14px;
          line-height: 1.65;
          color: #525252;
          text-align: center;
        }
        /* Flex et non grid : le nombre de cas n'est pas un multiple de
           trois, et une derniere rangee a une seule vignette collee a gauche
           avec deux trous a droite se lit comme un bug. Centree, elle se lit
           comme une mise en page. Meme traitement que les chapitres d'un cas. */
        .case-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 22px;
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .case-item {
          display: block;
          flex: 0 0 calc((100% - (var(--cols, 3) - 1) * 22px) / var(--cols, 3));
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
        .case-film-flag {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: rgba(10, 10, 10, 0.45);
          backdrop-filter: blur(4px);
          padding-left: 2px;
        }
        .case-meta { padding: 10px 2px 0; text-align: center; }
        .case-title {
          margin: 0;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0a0a0a;
          font-weight: 400;
        }
        .case-place { color: #b3aca2; margin-left: 6px; }
        /* Étiquette de catégorie : le seul chemin qui reste vers les pages de
           catégorie, sorties de la navigation mais gardées pour la recherche. */
        .case-cat {
          display: block;
          margin-top: 4px;
          text-align: center;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c4bdb3;
          text-decoration: none;
        }
        .case-cat:hover { color: #0a0a0a; }
        /* Le bloc Voyage porte un vrai titre, pas une etiquette de section :
           c'est une offre, elle a droit au meme traitement que le haut de
           page. */
        .section-block { text-align: center; margin: 88px 0 30px; }
        .section-head {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 22px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          font-weight: 400;
          margin: 0 0 6px;
        }
        .section-sub {
          margin: 0;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
        }
        .section-lede {
          max-width: 560px;
          margin: 16px auto 0;
          padding: 0 20px;
          font-size: 14px;
          line-height: 1.65;
          color: #525252;
        }
        .page-cta { text-align: center; padding: 76px 20px 0; }
        .page-cta p { margin: 0 0 10px; font-size: 13px; color: #525252; }
        .page-cta a {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 1px solid #0a0a0a;
          padding-bottom: 2px;
        }
        @media (max-width: 767px) {
          .case-grid { gap: 10px; padding: 0 12px; max-width: none !important; }
          .case-item { flex-basis: calc((100% - 10px) / 2) !important; }
          .cat-head h1 { font-size: 18px; }
          .page-intro { font-size: 13px; margin-bottom: 26px; }
          .case-title { font-size: 8px; letter-spacing: 0.12em; }
          .case-place { margin-left: 4px; }
          .case-meta { padding-top: 6px; }
          .section-block { margin: 62px 0 22px; }
          .section-head { font-size: 17px; }
          .section-lede { font-size: 13px; }
        }
      `}</style>

      <main style={{ paddingTop: "16px", paddingBottom: "72px", background: "#ffffff" }}>
        <div className="cat-head">
          <h1>{lang === "fr" ? "Photographe" : "Photographer"}</h1>
        </div>
        <p className="page-intro">{intro}</p>

        {places.length > 0 && grid(places)}

        {cities.length > 0 && (
          <>
            <div className="section-block">
              <h2 className="section-head">{citiesHead}</h2>
              <p className="section-sub">{citiesSub}</p>
              <p className="section-lede">{citiesLede}</p>
            </div>
            {grid(cities)}
          </>
        )}

        <div className="page-cta">
          <p>{ctaText}</p>
          <Link href={`/${lang}/services`}>{ctaLink}</Link>
        </div>
      </main>
    </>
  );
}
