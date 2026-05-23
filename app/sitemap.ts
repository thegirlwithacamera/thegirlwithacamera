import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { series } from "@/lib/series";
import { getAllPosts } from "@/lib/sanity.queries";

const STATIC_PATHS = ["", "/film", "/creator", "/about"];

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
