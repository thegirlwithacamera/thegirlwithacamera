import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { site } from "@/lib/site";
import { PHOTO_CATEGORIES } from "@/app/[lang]/photographer/constants";
import { countCasePhotos, readCaseChapters } from "@/lib/portfolio";

// Date de dernière modification d'un cas : celle de son dossier d'images.
// Une date honnête vaut mieux qu'un "aujourd'hui" sur toutes les pages, que
// Google finit par ignorer.
function caseModified(category: string, caseSlug: string): Date {
  const dir = path.join(process.cwd(), "public", "images", "portfolio", category, caseSlug);
  try {
    return fs.statSync(dir).mtime;
  } catch {
    return new Date();
  }
}

type Entry = { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly"; lastModified: Date };

function buildPaths(): Entry[] {
  const now = new Date();
  const out: Entry[] = [
    // L'accueil et les quatre pages qui vendent quelque chose passent avant
    // le reste.
    { path: "", priority: 1, changeFrequency: "weekly", lastModified: now },
    { path: "/destinations", priority: 0.9, changeFrequency: "weekly", lastModified: now },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { path: "/journal", priority: 0.7, changeFrequency: "weekly", lastModified: now },
    { path: "/creator", priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { path: "/about", priority: 0.6, changeFrequency: "yearly", lastModified: now },
  ];

  // Pages de cas : le fond du site, une par client ou par ville.
  for (const cat of PHOTO_CATEGORIES) {
    for (const c of cat.cases) {
      if (countCasePhotos(cat.slug, c.slug) === 0) continue;
      out.push({
        path: `/photographer/${cat.slug}/${c.slug}`,
        priority: 0.7,
        changeFrequency: "yearly",
        lastModified: caseModified(cat.slug, c.slug),
      });
      // Pieces d'un cas a chapitres : depuis le 12/09 chacune a sa page.
      // La premiere est la page du cas elle meme, deja poussee ci dessus.
      for (const ch of readCaseChapters(cat.slug, c.slug).slice(1)) {
        out.push({
          path: `/photographer/${cat.slug}/${c.slug}/${ch.slug}`,
          priority: 0.6,
          changeFrequency: "yearly",
          lastModified: caseModified(cat.slug, c.slug),
        });
      }
    }
  }

  for (const s of ["gear", "lifestyle", "unboxing", "talk"]) {
    out.push({ path: `/creator/${s}`, priority: 0.6, changeFrequency: "monthly", lastModified: now });
  }

  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const langs: Array<"fr" | "en"> = ["en"];

  return langs.flatMap((lang) =>
    buildPaths().map((e) => ({
      url: `${site.url}/${lang}${e.path}`,
      lastModified: e.lastModified,
      changeFrequency: e.changeFrequency,
      priority: e.priority,
      alternates: {
        languages: {
          en: `${site.url}/en${e.path}`,
          "x-default": `${site.url}/en${e.path}`,
        },
      },
    })),
  );
}
