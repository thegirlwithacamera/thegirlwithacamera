import { PHOTO_CATEGORIES } from "@/app/[lang]/photographer/constants";
import { readCasePhotos } from "@/lib/portfolio";
import { site } from "@/lib/site";

export const dynamic = "force-static";

// ─────────────────────────────────────────────────────────────
// Sitemap images, reecrit le 01/09.
//
// L'ancienne version listait 45 images a des adresses du type
// /images/portfolio/1.JPG, une structure qui n'existe plus depuis le
// passage aux cas. Elle envoyait donc Google chercher 45 fichiers absents,
// toutes rattachees a la seule page /en. C'est pire que pas de sitemap.
//
// Celle-ci se construit sur les memes donnees que le site : une entree par
// page de cas, avec les images reellement servies, leur titre et la phrase
// du cas en legende. Elle se met a jour toute seule quand un cas s'ajoute.
//
// Pour un portfolio de photographe, c'est le sitemap qui compte le plus :
// les pages ont peu de texte, les images sont le contenu.
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
  const langs: Array<"fr" | "en"> = ["fr", "en"];

  const urls: string[] = [];

  for (const lang of langs) {
    for (const cat of PHOTO_CATEGORIES) {
      for (const item of cat.cases) {
        const photos = readCasePhotos(cat.slug, item.slug);
        if (photos.length === 0) continue;

        const place = item.place ? `, ${item.place[lang]}` : "";
        const caption = item.intro
          ? item.intro[lang]
          : `${item.label[lang]}${place}, ${cat.label[lang].toLowerCase()}`;

        const images = photos
          .map(
            (p, i) => `
    <image:image>
      <image:loc>${base}${esc(p.src)}</image:loc>
      <image:title>${esc(`${item.label[lang]}${place}`)}${i > 0 ? ` ${i + 1}` : ""}</image:title>
      <image:caption>${esc(caption)}</image:caption>
    </image:image>`,
          )
          .join("");

        urls.push(`
  <url>
    <loc>${base}/${lang}/photographer/${cat.slug}/${item.slug}</loc>${images}
  </url>`);
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
