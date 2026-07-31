import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getPublishedTrips } from "@/lib/diary";
import { PHOTO_CATEGORY_SLUGS } from "@/app/[lang]/photographer/constants";

// "/shop" retire tant que la boutique est hors ligne.
const STATIC_PATHS = [
  "",
  ...PHOTO_CATEGORY_SLUGS.map((s) => `/photographer/${s}`),
  "/creator",
  "/creator/gear",
  "/creator/lifestyle",
  "/creator/unboxing",
  "/creator/talk",
  "/filmmaker",
  "/filmmaker/places",
  "/filmmaker/cities",
  "/filmmaker/lifestyle",
  "/filmmaker/fashion",
  "/filmmaker/bts",
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
