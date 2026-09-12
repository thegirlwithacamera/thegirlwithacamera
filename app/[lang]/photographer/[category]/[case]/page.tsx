import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PHOTO_CATEGORIES, allCases, findCase } from "../../constants";
import { countCasePhotos, readCaseCover } from "@/lib/portfolio";
import CaseView from "./CaseView";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: "fr" | "en"; category: string; case: string }>;
}

export function generateStaticParams() {
  return (["fr", "en"] as const).flatMap((lang) =>
    PHOTO_CATEGORIES.flatMap((cat) =>
      cat.cases
        .filter((c) => countCasePhotos(cat.slug, c.slug) > 0)
        .map((c) => ({ lang, category: cat.slug, case: c.slug })),
    ),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category, case: caseSlug } = await params;
  const found = findCase(category, caseSlug);
  if (!found) return {};
  const { cat, item } = found;
  const place = item.place ? `, ${item.place[lang]}` : "";
  // Le titre porte le métier et la ville : "Altstadt Vienna, an SLH Hotel ·
  // Photographe d'hôtel à Vienne". Le nom du lieu seul ne se cherche pas,
  // le métier plus la ville, si. La ville vient de `place`, avant la virgule.
  const town = item.place?.[lang].split(",")[0].trim();
  // Séries de ville : le nom du cas est déjà la ville, et `place` ne porte
  // que le pays. Le titre dit alors "Venise, Italie · Photographe de voyage",
  // pas "photographe de voyage à Italie".
  const where = cat.citySeries
    ? lang === "fr" ? "Photographe de voyage" : "Travel photographer"
    : (() => {
        const trade = cat.slug === "restaurants"
          ? lang === "fr" ? "Photographe de restaurant" : "Restaurant photographer"
          : lang === "fr" ? "Photographe d'hôtel" : "Hotel photographer";
        return town ? (lang === "fr" ? `${trade} à ${town}` : `${trade} in ${town}`) : trade;
      })();
  const heading = cat.citySeries && item.place
    ? `${item.label[lang]}, ${item.place[lang]}`
    : item.label[lang];
  return pageMeta({
    lang,
    path: `/photographer/${cat.slug}/${item.slug}`,
    type: "article",
    title: `${heading} · ${where}`,
    // La phrase du cas fait une meilleure description que le gabarit : elle
    // décrit le lieu au lieu de répéter la catégorie.
    description: item.intro
      ? item.intro[lang]
      : lang === "fr"
        ? `${item.label.fr}${place}, ${cat.label.fr.toLowerCase()} photographiés par Sandrine Ceuppens, The Girl With A Camera.`
        : `${item.label.en}${place}, ${cat.label.en.toLowerCase()} photographed by Sandrine Ceuppens, The Girl With A Camera.`,
    // La carte de partage montre la maison, pas le logo du site : c'est ce
    // lien qu'on envoie à l'hôtel. coverImage l'emporte quand la première
    // image du cas ne fait pas une bonne carte : Altstadt ouvre sur
    // l'escalier, mais c'est une chambre qu'on veut sur le lien envoyé.
    image: item.coverImage ?? readCaseCover(cat.slug, item.slug) ?? undefined,
    imageAlt: `${item.label[lang]}${place}`,
  });
}

// ─────────────────────────────────────────────────────────────
// Page d'entrée d'un cas. Un cas simple s'affiche en entier ici. Un cas à
// chapitres montre sa première pièce et porte le film ; les autres pièces
// ont chacune leur page, sous /<cas>/<piece>. Tout le rendu est dans
// CaseView, partagé par les deux routes.
// ─────────────────────────────────────────────────────────────

export default async function PhotographerCasePage({ params }: Props) {
  const { lang, category, case: caseSlug } = await params;
  const found = findCase(category, caseSlug);
  if (!found) notFound();
  const { cat, item } = found;
  if (countCasePhotos(cat.slug, item.slug) === 0) notFound();

  return <CaseView lang={lang} cat={cat} item={item} />;
}
