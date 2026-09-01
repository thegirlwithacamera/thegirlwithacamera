import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    // Les trois sitemaps sont annonces. Avant le 01/09, robots ne declarait
    // que le principal : les sitemaps images et videos existaient et aucun
    // moteur ne les lisait. Pour un portfolio de photographe, le sitemap
    // images est celui qui porte le contenu.
    sitemap: [
      `${site.url}/sitemap.xml`,
      `${site.url}/images-sitemap.xml`,
      `${site.url}/videos-sitemap.xml`,
    ],
    host: site.url,
  };
}
