import type { Metadata } from "next";
import { PHOTO_CATEGORIES } from "./constants";
import { readCaseCover } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";
import { Closing, Cta, Eyebrow, Lede, PageHead, ProjectCard, ProjectGrid, SectionBar, colsFor } from "../components/editorial";
import s from "./page.module.css";

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
        ? "Sandrine Ceuppens photographie hôtels, maisons d'hôtes, restaurants et bars partout dans le monde. Basée à Bruxelles."
        : "Sandrine Ceuppens photographs hotels, guesthouses, restaurants and bars worldwide. Based in Brussels.",
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

  const title =
    lang === "fr"
      ? "Des lieux qui reçoivent, et *les gens qui les font vivre*."
      : "Places that welcome, and *the people who keep them running*.";
  const intro =
    lang === "fr"
      ? "Maisons, tables, rues et voyages, en lumière naturelle, sans mise en scène ajoutée."
      : "Houses, tables, streets and journeys, in natural light, with nothing staged on top.";
  const citiesHead = lang === "fr" ? "Voyage" : "Travel";
  const citiesSub = lang === "fr" ? "Mon œil sur la ville" : "The city, the way I see it";
  const citiesLede =
    lang === "fr"
      ? "Une ville regardée à cinq heures du matin, les marchés avant la foule, les rues avant qu'elles se remplissent. Pour un office du tourisme, une compagnie de train, ou une maison qui veut montrer sa ville autant que ses murs."
      : "A city at five in the morning, the markets before the crowd, the streets before they fill. For a tourism board, a rail company, or a house that wants to show its city as much as its walls.";
  const ctaText = lang === "fr" ? "Un projet en tête ?" : "Have a project in mind?";
  const ctaLink = lang === "fr" ? "Travaillons ensemble →" : "Work with me →";

  const grid = (rows: Row[]) => (
    <ProjectGrid cols={colsFor(rows.length)}>
      {rows.map((r, i) => (
        <ProjectCard
          key={r.key}
          href={r.href}
          cover={r.cover}
          alt={r.altEn}
          title={r.title}
          sub={r.place}
          note={r.categoryLabel}
          noteHref={r.categoryHref}
          hasFilm={r.hasFilm}
          priority={i < 3}
          sizes="(max-width: 767px) 50vw, 400px"
        />
      ))}
    </ProjectGrid>
  );

  return (
    <main className={s.main}>
      <PageHead
        eyebrow={lang === "fr" ? "Photographe" : "Photographer"}
        title={title}
        lede={intro}
        split
      />

      {places.length > 0 && (
        <section className={s.section}>
          <SectionBar label={lang === "fr" ? "Hôtels, maisons & tables" : "Hotels, houses & tables"} />
          {grid(places)}
        </section>
      )}

      {cities.length > 0 && (
        <section className={s.section}>
          <SectionBar label={citiesHead} sub={citiesSub} />
          <Lede className={s.lede} tone="stone" align="left">{citiesLede}</Lede>
          {grid(cities)}
        </section>
      )}

      <Closing>
        <Eyebrow>{ctaText}</Eyebrow>
        <p><Cta href={`/${lang}/services`} variant="serif">{ctaLink}</Cta></p>
      </Closing>
    </main>
  );
}
