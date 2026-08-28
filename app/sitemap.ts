import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getPublishedTrips } from "@/lib/diary";
import { PHOTO_CATEGORIES, PHOTO_CATEGORY_SLUGS } from "@/app/[lang]/photographer/constants";
import { countCasePhotos } from "@/lib/portfolio";

// "/shop" retire tant que la boutique est hors ligne.
const STATIC_PATHS = [
  "",
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
  "/diary",
  "/about",
];

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

  const diaryEntries: MetadataRoute.Sitemap = langs.flatMap((lang) =>
    getPublishedTrips().map((trip) => ({
      url: `${site.url}/${lang}/diary/${trip.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          fr: `${site.url}/fr/diary/${trip.slug}`,
          en: `${site.url}/en/diary/${trip.slug}`,
        },
      },
    })),
  );

  return [...staticEntries, ...diaryEntries];
}
