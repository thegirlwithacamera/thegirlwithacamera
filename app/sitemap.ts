import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { series } from "@/lib/series";
import { getAllPosts } from "@/lib/sanity.queries";

const STATIC_PATHS = ["", "/gallery", "/creation", "/about", "/contact", "/services", "/press", "/legal/privacy", "/legal/mentions"];

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

  const seriesEntries: MetadataRoute.Sitemap = langs.flatMap((lang) =>
    series.map((s) => ({
      url: `${site.url}/${lang}/gallery/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${site.url}/fr/gallery/${s.slug}`,
          en: `${site.url}/en/gallery/${s.slug}`,
        },
      },
    })),
  );

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPosts();
    postEntries = langs.flatMap((lang) =>
      posts.map((p) => ({
        url: `${site.url}/${lang}/blog/${p.slug}`,
        lastModified: p.date ? new Date(p.date) : now,
        changeFrequency: "yearly" as const,
        priority: 0.6,
        alternates: {
          languages: {
            fr: `${site.url}/fr/blog/${p.slug}`,
            en: `${site.url}/en/blog/${p.slug}`,
          },
        },
      })),
    );
  } catch {
    // Sanity not configured locally, skip post entries rather than fail the build.
  }

  return [...staticEntries, ...seriesEntries, ...postEntries];
}
