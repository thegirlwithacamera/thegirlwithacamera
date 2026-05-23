export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = 'https://thegirlwithacamera.com';
  const allPhotos = Array.from({ length: 45 }, (_, i) => i + 1);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPhotos
  .map(
    (i) => `
  <url>
    <loc>${baseUrl}/en</loc>
    <image:image>
      <image:loc>${baseUrl}/images/portfolio/${i}.JPG</image:loc>
      <image:title>Portfolio photograph ${i} by Sandrine Ceuppens</image:title>
      <image:caption>Street, documentary, and brand content creation photography</image:caption>
    </image:image>
  </url>`
  )
  .join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
