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
      // /da was a half-built page with missing assets, keep the URL valuable
      { source: "/da", destination: "/fr/services", permanent: true },
      { source: "/fr/da", destination: "/fr/services", permanent: true },
      { source: "/en/da", destination: "/en/services", permanent: true },
      { source: "/fr/video", destination: "/fr/film", permanent: true },
      { source: "/en/video", destination: "/en/film", permanent: true },
      // Portfolio : catégories renommées (2026-07-16)
      { source: "/fr/photographer/details", destination: "/fr/photographer/venues", permanent: true },
      { source: "/en/photographer/details", destination: "/en/photographer/venues", permanent: true },
      { source: "/fr/photographer/architecture", destination: "/fr/photographer/product", permanent: true },
      { source: "/en/photographer/architecture", destination: "/en/photographer/product", permanent: true },
      // Portfolio : Studio et Événements remplacent Bijoux et Conceptuel (2026-07-19).
      // Les photos bijoux vivent maintenant dans studio ; conceptual/creative
      // n'ont plus d'équivalent direct -> events (même case de la grille).
      { source: "/fr/photographer/jewelry", destination: "/fr/photographer/studio", permanent: true },
      { source: "/en/photographer/jewelry", destination: "/en/photographer/studio", permanent: true },
      { source: "/fr/photographer/conceptual", destination: "/fr/photographer/events", permanent: true },
      { source: "/en/photographer/conceptual", destination: "/en/photographer/events", permanent: true },
      { source: "/fr/photographer/creative", destination: "/fr/photographer/events", permanent: true },
      { source: "/en/photographer/creative", destination: "/en/photographer/events", permanent: true },
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
