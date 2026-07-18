import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      { source: "/fr/photographer/studio", destination: "/fr/photographer/jewelry", permanent: true },
      { source: "/en/photographer/studio", destination: "/en/photographer/jewelry", permanent: true },
      { source: "/fr/photographer/details", destination: "/fr/photographer/venues", permanent: true },
      { source: "/en/photographer/details", destination: "/en/photographer/venues", permanent: true },
      { source: "/fr/photographer/architecture", destination: "/fr/photographer/product", permanent: true },
      { source: "/en/photographer/architecture", destination: "/en/photographer/product", permanent: true },
      { source: "/fr/photographer/creative", destination: "/fr/photographer/conceptual", permanent: true },
      { source: "/en/photographer/creative", destination: "/en/photographer/conceptual", permanent: true },
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
