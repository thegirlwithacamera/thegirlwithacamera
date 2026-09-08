import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PHOTO_CATEGORIES, findCategory } from "../constants";
import { readCaseCover, countCasePhotos } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";
import { PageHead, ProjectCard, ProjectGrid, colsFor } from "../../components/editorial";
import s from "../page.module.css";

interface Props {
  params: Promise<{ lang: "fr" | "en"; category: string }>;
}

// Titres de recherche, une entree par categorie. Ce ne sont pas les libelles
// affiches : ici on ecrit ce que quelqu'un tape, pas ce qu'on met dans un
// menu. Le gabarit du layout ajoute " · The Girl With A Camera".
const SEO_TITLE: Record<"fr" | "en", Record<string, string>> = {
  fr: {
    hospitality: "Photographe d'hôtels et de maisons d'hôtes",
    restaurants: "Photographe de restaurants et de bars",
    travel: "Photographe de voyage et de ville",
  },
  en: {
    hospitality: "Hotel and guesthouse photographer",
    restaurants: "Restaurant and bar photographer",
    travel: "Travel and city photographer",
  },
};

export function generateStaticParams() {
  return (["fr", "en"] as const).flatMap((lang) =>
    PHOTO_CATEGORIES.map((c) => ({ lang, category: c.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category } = await params;
  const cat = findCategory(category);
  if (!cat) return {};
  return pageMeta({
    lang,
    path: `/photographer/${cat.slug}`,
    // Le titre disait "Hôtels & maisons — Photographer" : moitié français
    // moitié anglais, un tiret en guise de ponctuation, et aucun mot que
    // quelqu'un taperait dans une recherche. Il nomme maintenant le métier
    // et la ville.
    title: lang === "fr"
      ? `${SEO_TITLE.fr[cat.slug] ?? cat.label.fr}`
      : `${SEO_TITLE.en[cat.slug] ?? cat.label.en}`,
    description:
      lang === "fr"
        ? `${cat.label.fr} photographiés par Sandrine Ceuppens, en lumière naturelle. Basée à Bruxelles, disponible en déplacement en Europe.`
        : `${cat.label.en} photographed by Sandrine Ceuppens in natural light. Based in Brussels, available for travel across Europe.`,
  });
}

// ─────────────────────────────────────────────────────────────
// Page d'une catégorie : la grille des cas (un client, une destination,
// une série). Un cas déclaré dans constants.ts mais dont le dossier d'images
// est vide n'apparaît pas.
// ─────────────────────────────────────────────────────────────

export default async function PhotographerCategoryPage({ params }: Props) {
  const { lang, category } = await params;
  const cat = findCategory(category);
  if (!cat) notFound();

  const cases = cat.cases
    .map((c) => ({
      ...c,
      cover: readCaseCover(cat.slug, c.slug),
      count: countCasePhotos(cat.slug, c.slug),
    }))
    .filter((c) => c.cover !== null);

  const backLabel = lang === "fr" ? "Tout le portfolio" : "All the work";
  const emptyNote = lang === "fr" ? "Sélection à venir." : "Selection coming soon.";
  const lede =
    cat.citySeries
      ? lang === "fr"
        ? "Des villes regardées tôt, avant la foule, pour ceux qui veulent les montrer autrement."
        : "Cities seen early, before the crowd, for those who want to show them differently."
      : lang === "fr"
        ? "Des lieux photographiés pendant qu'ils vivent, en lumière naturelle."
        : "Places photographed while they are alive, in natural light.";

  return (
    <main className={s.main}>
      <PageHead
        back={{ href: `/${lang}/photographer`, label: backLabel }}
        eyebrow={lang === "fr" ? "Photographe" : "Photographer"}
        title={cat.label[lang]}
        lede={cases.length === 0 ? emptyNote : lede}
        split
      />
      {cases.length > 0 && (
        <ProjectGrid cols={colsFor(cases.length)} className={s.grid}>
          {cases.map((c, i) => (
            <ProjectCard
              key={c.slug}
              href={`/${lang}/photographer/${cat.slug}/${c.slug}`}
              cover={c.cover as string}
              alt={`${c.label.en} — ${cat.label.en} photography by Sandrine Ceuppens`}
              title={c.label[lang]}
              sub={c.place?.[lang]}
              hasFilm={(c.films?.length ?? 0) > 0}
              priority={i < 3}
              coverPosition={c.coverPosition}
              sizes="(max-width: 767px) 50vw, 400px"
            />
          ))}
        </ProjectGrid>
      )}
    </main>
  );
}
