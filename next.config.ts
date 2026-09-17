import type { NextConfig } from "next";

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
    ],
  },
  async redirects() {
    return [
      // Refonte du 16/09 : site en anglais, menu Destinations, Content
      // creator, Journal, About, Contact. La page Services laisse la place à
      // Contact (plus de liste d'offres), Photographer à Destinations, et le
      // journal revient sur le site. Substack est abandonné.
      { source: "/en/services", destination: "/en/contact", permanent: true },
      { source: "/en/photographer", destination: "/en/destinations", permanent: true },
      { source: "/en/diary", destination: "/en/journal", permanent: true },
      { source: "/en/journal/series/:key", destination: "/en/journal/category/:key", permanent: true },
      // 17/09 : les six premiers articles sont repassés en brouillon, décision
      // de Sandrine, pour les refaire en vrais guides. Leurs adresses renvoient
      // vers le journal en attendant (redirection temporaire).
      { source: "/en/journal/:slug(vienna-slow-guide|interrail-twelve-stops|interrail-how-i-used-the-pass|interrail-what-i-packed|whats-in-my-camera-bag|my-first-drone)", destination: "/en/journal", permanent: false },
      { source: "/en/journal/category/:key", destination: "/en/journal", permanent: false },
      { source: "/en/journal/destination/:key", destination: "/en/journal/category/:key", permanent: true },
      { source: "/en/diary/:slug", destination: "/en/journal", permanent: true },
      // 16/09, suite : plus aucune page hors menu. Vidéaste et les pages de
      // catégorie photo renvoient vers Destinations, où vivent les projets et
      // leurs films. Les projets retirés (Italie, Japon, Belgique, voir
      // HIDDEN_CASES) aussi. Les pages de projet autrichiennes restent.
      { source: "/en/filmmaker", destination: "/en/destinations", permanent: false },
      { source: "/en/filmmaker/:path*", destination: "/en/destinations", permanent: false },
      { source: "/en/photographer/:category(hospitality|restaurants|travel)", destination: "/en/destinations", permanent: false },
      { source: "/en/photographer/restaurants/:path*", destination: "/en/destinations", permanent: false },
      { source: "/en/photographer/travel/:case(tokyo|kyoto|napoli|burano|venezia|palermo)", destination: "/en/destinations", permanent: false },
      { source: "/en/photographer/travel/:case(tokyo|kyoto|napoli|burano|venezia|palermo)/:path*", destination: "/en/destinations", permanent: false },
      { source: "/en/shop", destination: "/en", permanent: false },
      // /da was a half-built page with missing assets, keep the URL valuable
      { source: "/da", destination: "/en/contact", permanent: true },
      { source: "/fr/da", destination: "/fr/services", permanent: true },
      { source: "/en/da", destination: "/en/services", permanent: true },
      // Pointait vers /film, une route qui n'existe pas : la page s'appelle
      // /filmmaker. Corrigé le 01/09.
      { source: "/fr/video", destination: "/fr/filmmaker", permanent: true },
      { source: "/en/video", destination: "/en/filmmaker", permanent: true },
      // Videaste decoupe en cinq rubriques le 12/09 : "Maisons & tables" se
      // separe en Hotels, Tables et Spa, et les trains sortent de Voyage.
      // L'ancienne URL /filmmaker/places etait en ligne et dans les
      // sitemaps, elle mene a la rubrique qui a repris ses films.
      { source: "/fr/filmmaker/places", destination: "/fr/filmmaker/hotels", permanent: true },
      { source: "/en/filmmaker/places", destination: "/en/filmmaker/hotels", permanent: true },
      // Portraits retire du site le 01/09. Les trois URLs restaient
      // indexees, elles renvoient vers la page Photographe.
      { source: "/fr/photographer/portraits", destination: "/fr/photographer", permanent: true },
      { source: "/en/photographer/portraits", destination: "/en/photographer", permanent: true },
      { source: "/fr/photographer/portraits/:slug", destination: "/fr/photographer", permanent: true },
      { source: "/en/photographer/portraits/:slug", destination: "/en/photographer", permanent: true },
      // Portfolio : passage aux catégories par mission et aux cas (2026-08-27).
      // Les anciens slugs par genre photo restent indexés, ils pointent vers
      // la catégorie qui a absorbé leurs images. Ceux dont les images sont
      // sorties de la grille renvoient à l'accueil ou à Creator.
      // /photographer/travel est le seul ancien slug encore valide tel quel.
      // Sélys : rangé dans Restaurants & bars le 08/09, seuls le restaurant
      // et le spa ont été couverts.
      { source: "/fr/photographer/hospitality/van-der-valk-selys", destination: "/fr/photographer/restaurants/van-der-valk-selys", permanent: true },
      { source: "/en/photographer/hospitality/van-der-valk-selys", destination: "/en/photographer/restaurants/van-der-valk-selys", permanent: true },
      { source: "/fr/photographer/details", destination: "/fr/photographer/restaurants", permanent: true },
      { source: "/en/photographer/details", destination: "/en/photographer/restaurants", permanent: true },
      { source: "/fr/photographer/architecture", destination: "/fr/creator", permanent: true },
      { source: "/en/photographer/architecture", destination: "/en/creator", permanent: true },
      { source: "/fr/photographer/jewelry", destination: "/fr/photographer", permanent: true },
      { source: "/en/photographer/jewelry", destination: "/en/photographer", permanent: true },
      { source: "/fr/photographer/conceptual", destination: "/fr", permanent: true },
      { source: "/en/photographer/conceptual", destination: "/en", permanent: true },
      { source: "/fr/photographer/creative", destination: "/fr", permanent: true },
      { source: "/en/photographer/creative", destination: "/en", permanent: true },
      { source: "/fr/photographer/studio", destination: "/fr/photographer", permanent: true },
      { source: "/en/photographer/studio", destination: "/en/photographer", permanent: true },
      { source: "/fr/photographer/venues", destination: "/fr/photographer/restaurants", permanent: true },
      { source: "/en/photographer/venues", destination: "/en/photographer/restaurants", permanent: true },
      { source: "/fr/photographer/portrait", destination: "/fr/photographer", permanent: true },
      { source: "/en/photographer/portrait", destination: "/en/photographer", permanent: true },
      { source: "/fr/photographer/street", destination: "/fr/photographer/travel", permanent: true },
      { source: "/en/photographer/street", destination: "/en/photographer/travel", permanent: true },
      { source: "/fr/photographer/fashion", destination: "/fr/photographer", permanent: true },
      { source: "/en/photographer/fashion", destination: "/en/photographer", permanent: true },
      { source: "/fr/photographer/events", destination: "/fr", permanent: true },
      { source: "/en/photographer/events", destination: "/en", permanent: true },
      { source: "/fr/photographer/product", destination: "/fr/creator", permanent: true },
      { source: "/en/photographer/product", destination: "/en/creator", permanent: true },
      { source: "/fr/photographer/beauty", destination: "/fr/photographer", permanent: true },
      // Vidéaste : Quotidien, Coulisses et Mode retirés le 28/08, la page ne
      // montre plus que du travail de lieu.
      { source: "/fr/filmmaker/lifestyle", destination: "/fr/filmmaker", permanent: true },
      { source: "/en/filmmaker/lifestyle", destination: "/en/filmmaker", permanent: true },
      { source: "/fr/filmmaker/bts", destination: "/fr/filmmaker", permanent: true },
      { source: "/en/filmmaker/bts", destination: "/en/filmmaker", permanent: true },
      { source: "/fr/filmmaker/fashion", destination: "/fr/filmmaker", permanent: true },
      { source: "/en/filmmaker/fashion", destination: "/en/filmmaker", permanent: true },

      { source: "/en/photographer/beauty", destination: "/en/photographer", permanent: true },
    ];
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
