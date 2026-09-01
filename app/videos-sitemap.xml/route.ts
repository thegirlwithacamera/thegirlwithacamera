import { readDiary } from "@/lib/creator-videos";
import { PUBLISHED_DIARY_CATS } from "@/app/[lang]/filmmaker/constants";
import { findCaseByFilm } from "@/app/[lang]/photographer/constants";
import { site } from "@/lib/site";

export const dynamic = "force-static";

// ─────────────────────────────────────────────────────────────
// Sitemap videos, reecrit le 01/09.
//
// L'ancienne version listait cinq titres ecrits a la main (Tokyo, Osaka,
// Tokyo Night, Nara, Kyoto) sur la page /en/filmmaker/places, alors que ce
// sont des films de ville et que deux d'entre eux ne sont plus publies.
//
// Celle-ci se construit sur les fichiers reellement servis, en respectant
// HIDDEN_FILMS : un film retire du site sort aussi du sitemap. Chaque film
// pointe vers la page ou on peut le regarder, sa page de cas quand il en a
// une, la page Videaste sinon.
// ─────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = site.url;
  const diary = readDiary();
  const langs: Array<"fr" | "en"> = ["fr", "en"];

  const urls: string[] = [];

  for (const lang of langs) {
    for (const cat of PUBLISHED_DIARY_CATS) {
      for (const clip of diary[cat]) {
        const found = findCaseByFilm(clip.src);
        const page = found
          ? `${base}/${lang}/photographer/${found.cat.slug}/${found.item.slug}`
          : `${base}/${lang}/filmmaker`;

        const title = found ? found.item.label[lang] : clip.label;
        const place = found?.item.place ? `, ${found.item.place[lang]}` : "";
        const description = found?.item.intro
          ? found.item.intro[lang]
          : lang === "fr"
            ? `${title}${place}, film par Sandrine Ceuppens.`
            : `${title}${place}, a film by Sandrine Ceuppens.`;

        urls.push(`
  <url>
    <loc>${page}</loc>
    <video:video>
      <video:thumbnail_loc>${base}${esc(clip.poster ?? "/og-image.jpg")}</video:thumbnail_loc>
      <video:title>${esc(`${title}${place}`)}</video:title>
      <video:description>${esc(description)}</video:description>
      <video:content_loc>${base}${esc(clip.src)}</video:content_loc>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>
  </url>`);
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${urls.join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
