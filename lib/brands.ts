// Clients / partenaires, source unique pour la bande "Ils me font confiance".
// Utilisee par la page About et la page Creator via le composant TrustLogos.
// logo : chemin d'un fichier dans public/images/brands/, sinon le nom s'affiche
// en texte. tall : pour les logos ronds/carres (badge) qui paraissent trop
// petits a la hauteur standard pensee pour les wordmarks larges.
export type Brand = { name: string; logo?: string; tall?: boolean };

export const BRANDS: Brand[] = [
  { name: "RICOH EUROPE", logo: "/images/brands/ricoh.svg" },
  { name: "PENTAX EUROPE", logo: "/images/brands/pentax-black.png" },
  { name: "INSTA360", logo: "/images/brands/insta360-wordmark.svg" },
  { name: "EDIFIER", logo: "/images/brands/edifier.png" },
  { name: "TELESIN", logo: "/images/brands/telesin.png" },
  { name: "L'ORÉAL", logo: "/images/brands/loreal.svg" },
  { name: "YES THEORY", logo: "/images/brands/yes-theory.png", tall: true },
  { name: "COLOC HOUSING", logo: "/images/brands/coloc-housing.png" },
  { name: "VAN DER VALK SELYS", logo: "/images/brands/van-der-valk-selys.png" },
  { name: "DAO LIÈGE", logo: "/images/brands/dao-liege.png" },
  { name: "CÉ-PAGES", logo: "/images/brands/ce-pages.png" },
];

// Label de la bande, bilingue (source unique).
export const TRUST_LABEL: Record<"fr" | "en", string> = {
  fr: "ILS ME FONT CONFIANCE",
  en: "ALREADY WORKING WITH",
};
