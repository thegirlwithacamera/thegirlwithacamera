import type { Metadata } from "next";
import { site } from "./site";

// ─────────────────────────────────────────────────────────────
// Cartes de partage, source unique.
//
// Avant le 01/09, le bloc Open Graph vivait uniquement dans
// app/[lang]/layout.tsx. Next ne fusionne pas openGraph entre un layout et
// une page : une page qui ne le redéfinit pas hérite du bloc entier. Résultat,
// toutes les pages du site partageaient le même titre, la même description et
// surtout la même og:url, celle de l'accueil. Envoyer à un hôtel le lien de sa
// propre page affichait la carte de la page d'accueil.
//
// pageMeta construit d'un coup le titre, la description, les canoniques et
// les deux blocs de partage. Toute page qui expose generateMetadata passe par
// ici. Le seul argument optionnel est l'image : sans elle, on retombe sur
// /og-image.jpg.
// ─────────────────────────────────────────────────────────────

type Lang = "fr" | "en";

interface PageSeo {
  lang: Lang;
  /** Chemin sans la langue. "" pour l'accueil, "/services", "/photographer/hospitality/dorf". */
  path: string;
  /** Titre sans le suffixe du site : le gabarit du layout l'ajoute. */
  title: string;
  description: string;
  /** Chemin absolu depuis la racine du site, ex "/images/portfolio/travel/villach/1.jpg". */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
}

export function pageMeta({
  lang,
  path,
  title,
  description,
  image,
  imageAlt,
  type = "website",
}: PageSeo): Metadata {
  const url = `${site.url}/${lang}${path}`;
  const shareTitle = title.includes(site.tagline) ? title : `${title} · ${site.tagline}`;

  // og-image.jpg est le seul visuel dont on connaît les dimensions exactes.
  // Pour une couverture de cas, on ne déclare rien : une dimension fausse
  // rogne la carte de travers chez ceux qui la croient.
  const isDefault = !image;
  const imageUrl = `${site.url}${image ?? "/og-image.jpg"}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { fr: `/fr${path}`, en: `/en${path}` },
    },
    openGraph: {
      type,
      url,
      siteName: site.tagline,
      title: shareTitle,
      description,
      locale: lang === "fr" ? "fr_BE" : "en_GB",
      alternateLocale: lang === "fr" ? ["en_GB"] : ["fr_BE"],
      images: [
        isDefault
          ? { url: imageUrl, width: 1200, height: 630, alt: imageAlt ?? site.tagline, type: "image/jpeg" }
          : { url: imageUrl, alt: imageAlt ?? title, type: "image/jpeg" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: site.social.instagramHandle,
      creator: site.social.instagramHandle,
      title: shareTitle,
      description,
      images: [imageUrl],
    },
  };
}
