import type { NextConfig } from "next";

// ─────────────────────────────────────────────────────────────
// Anciennes adresses.
//
// Chaque règle est écrite sans langue et part directement vers sa page
// finale, en un seul saut, depuis /en/x, /fr/x et /x. Avant le 07/10, une
// règle n'existait souvent qu'en /en : /fr/x passait par le middleware
// (/fr/x -> /en/x) puis par la règle, deux redirections au lieu d'une, et
// certaines destinations redirigeaient encore (/video -> /filmmaker ->
// /destinations). D'où deux règles :
// - la destination est toujours une page qui existe, jamais une adresse
//   elle-même redirigée. Si une page cible disparaît, mettre à jour ici les
//   règles qui pointent vers elle ;
// - l'ordre compte : la première règle qui correspond l'emporte.
// ─────────────────────────────────────────────────────────────

const LANG_PREFIXES = ["/en", "/fr", ""];

type OldUrl = { from: string; to: string; permanent: boolean };

const OLD_URLS: OldUrl[] = [
  // Refonte du 16/09 : site en anglais, menu Destinations, Content
  // creator, Journal, About, Contact. La page Services laisse la place à
  // Contact (plus de liste d'offres), Photographer à Destinations, et le
  // journal revient sur le site. Substack est abandonné.
  { from: "/services", to: "/en/contact", permanent: true },
  { from: "/photographer", to: "/en/destinations", permanent: true },
  { from: "/diary", to: "/en/journal", permanent: true },
  // 17/09 : les six premiers articles sont repassés en brouillon, décision
  // de Sandrine, pour les refaire en vrais guides. Leurs adresses renvoient
  // vers le journal en attendant (redirection temporaire).
  { from: "/journal/:slug(interrail-twelve-stops|interrail-how-i-used-the-pass|interrail-what-i-packed|whats-in-my-camera-bag|my-first-drone)", to: "/en/journal", permanent: false },
  { from: "/journal/:kind(category|series|destination)/:key(interrail)", to: "/en/journal", permanent: false },
  { from: "/journal/series/:key", to: "/en/journal/category/:key", permanent: true },
  { from: "/journal/destination/:key", to: "/en/journal/category/:key", permanent: true },
  { from: "/diary/:slug", to: "/en/journal", permanent: true },
  // 16/09, suite : plus aucune page hors menu. Vidéaste et les pages de
  // catégorie photo renvoient vers Destinations, où vivent les projets et
  // leurs films. Les pages de projet autrichiennes restent.
  // /filmmaker/:path* couvre aussi les anciennes rubriques (places, lifestyle,
  // bts, fashion) qui avaient chacune leur règle.
  { from: "/filmmaker", to: "/en/destinations", permanent: false },
  { from: "/filmmaker/:path*", to: "/en/destinations", permanent: false },
  { from: "/photographer/:category(hospitality|restaurants|travel)", to: "/en/destinations/all", permanent: false },
  { from: "/shop", to: "/en", permanent: false },
  // Anciennes adresses d'avant la refonte, encore connues de Google
  // (Search Console, 404 du 07/10). /video menait à Vidéaste, elle va
  // directement là où Vidéaste renvoie aujourd'hui.
  { from: "/video", to: "/en/destinations", permanent: true },
  { from: "/press", to: "/en/about", permanent: true },
  { from: "/creation", to: "/en/creator", permanent: true },
  { from: "/gallery/:path*", to: "/en/destinations/all", permanent: true },
  // Anciennes sections de Creator, aussi gérées par la page
  // creator/[...section] : les déclarer ici évite le saut par le middleware.
  { from: "/creator/diary/:path*", to: "/en/destinations", permanent: true },
  { from: "/creator/experiences", to: "/en/creator/lifestyle", permanent: true },
  // /da was a half-built page with missing assets, keep the URL valuable
  { from: "/da", to: "/en/contact", permanent: true },
  // Portraits retire du site le 01/09. Les URLs restaient indexees, elles
  // renvoyaient vers la page Photographe, devenue Destinations.
  { from: "/photographer/portraits", to: "/en/destinations", permanent: true },
  { from: "/photographer/portraits/:slug", to: "/en/destinations", permanent: true },
  // Portfolio : passage aux catégories par mission et aux cas (2026-08-27).
  // Les anciens slugs par genre photo restent indexés, ils pointent vers
  // la page qui a absorbé leurs images. Ceux dont les images sont sorties
  // de la grille renvoient à l'accueil ou à Creator. Ceux qui menaient à une
  // catégorie (restaurants, travel) suivent sa redirection temporaire vers
  // toutes les destinations, et restent donc temporaires.
  // Sélys : rangé dans Restaurants & bars le 08/09, seuls le restaurant
  // et le spa ont été couverts.
  { from: "/photographer/hospitality/van-der-valk-selys", to: "/en/photographer/restaurants/van-der-valk-selys", permanent: true },
  { from: "/photographer/:slug(details|venues|street)", to: "/en/destinations/all", permanent: false },
  { from: "/photographer/:slug(architecture|product)", to: "/en/creator", permanent: true },
  { from: "/photographer/:slug(jewelry|studio|portrait|fashion|beauty)", to: "/en/destinations", permanent: true },
  { from: "/photographer/:slug(conceptual|creative|events)", to: "/en", permanent: true },
];

const nextConfig: NextConfig = {
  // Les pages lisent public/images et public/videos avec fs uniquement au
  // build (pages SSG). Sans cette exclusion, Vercel embarque les fichiers
  // dans chaque fonction serveur, qui dépasse la limite de 250 Mo.
  outputFileTracingExcludes: {
    "*": ["./public/images/**", "./public/videos/**"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Vignettes du flux Instagram de l'accueil. Meta sert les images depuis
      // scontent-xxx.cdninstagram.com, et parfois depuis fbcdn.net.
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
  async redirects() {
    return OLD_URLS.flatMap(({ from, to, permanent }) =>
      LANG_PREFIXES.map((prefix) => ({ source: `${prefix}${from}`, destination: to, permanent })),
    );
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
