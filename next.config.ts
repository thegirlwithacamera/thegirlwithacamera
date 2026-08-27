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
      // Portfolio : passage aux catégories par mission et aux cas (2026-08-27).
      // Les anciens slugs par genre photo restent indexés, ils pointent vers
      // la catégorie qui a absorbé leurs images. Ceux dont les images sont
      // sorties de la grille renvoient à l'accueil ou à Creator.
      // /photographer/travel est le seul ancien slug encore valide tel quel.
      { source: "/fr/photographer/details", destination: "/fr/photographer/restaurants", permanent: true },
      { source: "/en/photographer/details", destination: "/en/photographer/restaurants", permanent: true },
      { source: "/fr/photographer/architecture", destination: "/fr/creator", permanent: true },
      { source: "/en/photographer/architecture", destination: "/en/creator", permanent: true },
      { source: "/fr/photographer/jewelry", destination: "/fr/photographer/portraits", permanent: true },
      { source: "/en/photographer/jewelry", destination: "/en/photographer/portraits", permanent: true },
      { source: "/fr/photographer/conceptual", destination: "/fr", permanent: true },
      { source: "/en/photographer/conceptual", destination: "/en", permanent: true },
      { source: "/fr/photographer/creative", destination: "/fr", permanent: true },
      { source: "/en/photographer/creative", destination: "/en", permanent: true },
      { source: "/fr/photographer/studio", destination: "/fr/photographer/portraits", permanent: true },
      { source: "/en/photographer/studio", destination: "/en/photographer/portraits", permanent: true },
      { source: "/fr/photographer/venues", destination: "/fr/photographer/restaurants", permanent: true },
      { source: "/en/photographer/venues", destination: "/en/photographer/restaurants", permanent: true },
      { source: "/fr/photographer/portrait", destination: "/fr/photographer/portraits", permanent: true },
      { source: "/en/photographer/portrait", destination: "/en/photographer/portraits", permanent: true },
      { source: "/fr/photographer/street", destination: "/fr/photographer/travel", permanent: true },
      { source: "/en/photographer/street", destination: "/en/photographer/travel", permanent: true },
      { source: "/fr/photographer/fashion", destination: "/fr/photographer/portraits", permanent: true },
      { source: "/en/photographer/fashion", destination: "/en/photographer/portraits", permanent: true },
      { source: "/fr/photographer/events", destination: "/fr", permanent: true },
      { source: "/en/photographer/events", destination: "/en", permanent: true },
      { source: "/fr/photographer/product", destination: "/fr/creator", permanent: true },
      { source: "/en/photographer/product", destination: "/en/creator", permanent: true },
      { source: "/fr/photographer/beauty", destination: "/fr/photographer/portraits", permanent: true },
      { source: "/en/photographer/beauty", destination: "/en/photographer/portraits", permanent: true },
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
