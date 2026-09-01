import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { PHOTO_CATEGORIES, PHOTO_CATEGORY_SLUGS } from "@/app/[lang]/photographer/constants";
import { countCasePhotos } from "@/lib/portfolio";

const STATIC_PATHS = [
  "",
  // Page d'index du portfolio, créée le 01/09. C'est elle qui vise
  // "photographe hôtellerie Bruxelles".
  "/photographer",
  // Les pages de catégorie sortent de la navigation le 01/09 mais restent
  // indexées : ce sont les seules qui peuvent se positionner sur une requête
  // du type "photographe hôtel Vienne".
  ...PHOTO_CATEGORY_SLUGS.map((s) => `/photographer/${s}`),
  // Une URL par cas : un client, une destination, une série. C'est la page
  // qu'on colle dans un pitch, donc elle doit être indexée.
  ...PHOTO_CATEGORIES.flatMap((cat) =>
    cat.cases
      .filter((c) => countCasePhotos(cat.slug, c.slug) > 0)
      .map((c) => `/photographer/${cat.slug}/${c.slug}`),
  ),
  "/creator",
  "/creator/gear",
  "/creator/lifestyle",
  "/creator/unboxing",
  "/creator/talk",
  "/filmmaker",
  "/filmmaker/places",
  "/filmmaker/cities",
  "/services",
  // La page produits n'est dans aucun menu mais reste indexee : "presets
  // Ricoh GR" est une requete que des gens tapent, et onze epingles
  // Pinterest attendaient une page de vente.
  // "/shop" desactivee le 01/09 : la serie de presets est refaite de zero,
  // la page annoncait encore les 15 presets de l'ancienne. Remettre cette
  // ligne et repasser SHOP_ENABLED a true dans lib/products.ts pour la
  // rallumer.
  "/about",
];
// "/diary" retiré le 01/09 : le Journal, c'est le Substack. La section Diary
// du site faisait doublon et sa page Tokyo était en ligne avec ses blocs de
// gabarit "[To replace]". Les URLs partent en redirection, voir middleware.ts.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const langs: Array<"fr" | "en"> = ["fr", "en"];
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = langs.flatMap((lang) =>
    STATIC_PATHS.map((path) => ({
      url: `${site.url}/${lang}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: {
          fr: `${site.url}/fr${path}`,
          en: `${site.url}/en${path}`,
        },
      },
    })),
  );

  return staticEntries;
}
