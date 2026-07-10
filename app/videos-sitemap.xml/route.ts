export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = 'https://thegirlwithacamera.com';
  const videos = [
    { name: 'Tokyo', duration: '120' },
    { name: 'Osaka', duration: '120' },
    { name: 'Tokyo Night', duration: '120' },
    { name: 'Nara', duration: '120' },
    { name: 'Kyoto', duration: '120' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${baseUrl}/en/filmmaker/places</loc>
${videos
  .map(
    (v) => `
    <video:video>
      <video:title>${v.name}</video:title>
      <video:description>Documentary film by Sandrine Ceuppens - ${v.name}</video:description>
      <video:duration>${v.duration}</video:duration>
      <video:tag>documentary</video:tag>
      <video:tag>travel</video:tag>
      <video:tag>photography</video:tag>
      <video:thumbnail_loc>${baseUrl}/og-image.jpg</video:thumbnail_loc>
    </video:video>`
  )
  .join('')}
  </url>
  <url>
    <loc>${baseUrl}/fr/filmmaker/places</loc>
${videos
  .map(
    (v) => `
    <video:video>
      <video:title>${v.name}</video:title>
      <video:description>Film documentaire par Sandrine Ceuppens - ${v.name}</video:description>
      <video:duration>${v.duration}</video:duration>
      <video:tag>documentaire</video:tag>
      <video:tag>voyage</video:tag>
      <video:tag>photographie</video:tag>
      <video:thumbnail_loc>${baseUrl}/og-image.jpg</video:thumbnail_loc>
    </video:video>`
  )
  .join('')}
  </url>
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
