import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PHOTO_CATEGORIES, findCase } from "../../../constants";
import { readCaseChapters, countCasePhotos } from "@/lib/portfolio";
import CaseView, { chapterTitle } from "../CaseView";
import { pageMeta } from "@/lib/seo";

// ─────────────────────────────────────────────────────────────
// Une pièce d'un cas à chapitres, sur sa propre page.
//
// La première pièce n'a pas de page ici : elle vit à l'adresse du cas, qui
// est déjà en ligne et déjà partagée. Demander /<cas>/<premiere-piece>
// tomberait donc en 404 ; on ne génère pas cette adresse et rien n'y mène.
// ─────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ lang: "fr" | "en"; category: string; case: string; chapter: string }>;
}

export function generateStaticParams() {
  return (["fr", "en"] as const).flatMap((lang) =>
    PHOTO_CATEGORIES.flatMap((cat) =>
      cat.cases.flatMap((c) =>
        readCaseChapters(cat.slug, c.slug)
          .slice(1)
          .map((ch) => ({ lang, category: cat.slug, case: c.slug, chapter: ch.slug })),
      ),
    ),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category, case: caseSlug, chapter } = await params;
  const found = findCase(category, caseSlug);
  if (!found) return {};
  const { cat, item } = found;
  const chapters = readCaseChapters(cat.slug, item.slug);
  const ch = chapters.find((c) => c.slug === chapter);
  if (!ch) return {};
  const title = item.chapters?.[ch.slug]?.[lang] ?? chapterTitle(ch.slug);
  const town = item.place?.[lang].split(",")[0].trim();
  const trade = cat.slug === "restaurants"
    ? lang === "fr" ? "Photographe de restaurant" : "Restaurant photographer"
    : lang === "fr" ? "Photographe d'hôtel" : "Hotel photographer";
  const where = town ? (lang === "fr" ? `${trade} à ${town}` : `${trade} in ${town}`) : trade;

  return pageMeta({
    lang,
    path: `/photographer/${cat.slug}/${item.slug}/${ch.slug}`,
    type: "article",
    title: `${title}, ${item.label[lang]} · ${where}`,
    description: lang === "fr"
      ? `${title}, ${item.label.fr}. Photographies par Sandrine Ceuppens, The Girl With A Camera.`
      : `${title}, ${item.label.en}. Photographs by Sandrine Ceuppens, The Girl With A Camera.`,
    image: ch.photos[0]?.src,
    imageAlt: `${item.label[lang]}, ${title}`,
  });
}

export default async function CaseChapterPage({ params }: Props) {
  const { lang, category, case: caseSlug, chapter } = await params;
  const found = findCase(category, caseSlug);
  if (!found) notFound();
  const { cat, item } = found;
  if (countCasePhotos(cat.slug, item.slug) === 0) notFound();

  const chapters = readCaseChapters(cat.slug, item.slug);
  const at = chapters.findIndex((c) => c.slug === chapter);
  // Index 0 exclu : cette pièce est la page du cas.
  if (at < 1) notFound();

  return <CaseView lang={lang} cat={cat} item={item} activeChapter={chapter} />;
}
