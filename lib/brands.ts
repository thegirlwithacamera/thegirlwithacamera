// Clients / partenaires, source unique pour la bande "Ils me font confiance".
// Utilisee par la page About et la page Creator via le composant TrustLogos.
//
// logo : chemin d'un fichier dans public/images/brands/, sinon le nom s'affiche
// en texte. tall : pour les logos ronds/carres (badge) qui paraissent trop
// petits a la hauteur standard pensee pour les wordmarks larges.
//
// cat : depuis le 31/08 la bande est groupee. En vrac, un directeur d'hotel
// lisait cinq marques de materiel avant d'arriver a la premiere maison et en
// concluait que le metier c'etait le test de materiel. Les adresses passent
// donc devant, sous leur propre intertitre, et la page Creator n'affiche que
// les marques.
export type BrandCat = "hospitality" | "brand";
export type Brand = { name: string; logo?: string; tall?: boolean; cat: BrandCat };

export const BRANDS: Brand[] = [
  // Maisons, tables et destinations.
  { name: "MK HOTELS", logo: "/images/brands/mk-hotels.png", cat: "hospitality" },
  { name: "DORF SCHÖNLEITN", logo: "/images/brands/dorf-schonleitn.svg", cat: "hospitality" },
  // Logo en pastille, avec sa carte blanche et son ombre : il a besoin de la
  // hauteur des badges pour rester lisible entre deux wordmarks larges.
  { name: "KÄRNTEN", logo: "/images/brands/karnten.svg", tall: true, cat: "hospitality" },
  { name: "VAN DER VALK SELYS", logo: "/images/brands/van-der-valk-selys.png", cat: "hospitality" },
  { name: "COLOC HOUSING", logo: "/images/brands/coloc-housing.png", cat: "hospitality" },
  { name: "DAO LIÈGE", logo: "/images/brands/dao-liege.png", cat: "hospitality" },
  { name: "CÉ-PAGES", logo: "/images/brands/ce-pages.png", cat: "hospitality" },

  // Marques.
  { name: "RICOH EUROPE", logo: "/images/brands/ricoh.svg", cat: "brand" },
  { name: "PENTAX EUROPE", logo: "/images/brands/pentax-black.png", cat: "brand" },
  { name: "INSTA360", logo: "/images/brands/insta360-wordmark.svg", cat: "brand" },
  { name: "EDIFIER", logo: "/images/brands/edifier.png", cat: "brand" },
  { name: "TELESIN", logo: "/images/brands/telesin.png", cat: "brand" },
  { name: "L'ORÉAL", logo: "/images/brands/loreal.svg", cat: "brand" },
  { name: "YES THEORY", logo: "/images/brands/yes-theory.png", tall: true, cat: "brand" },
];

// Ordre d'affichage : les adresses d'abord.
export const BRAND_CATS: readonly BrandCat[] = ["hospitality", "brand"];

export function brandsIn(cat: BrandCat): Brand[] {
  return BRANDS.filter((b) => b.cat === cat);
}

// Label de la bande, bilingue (source unique).
export const TRUST_LABEL: Record<"fr" | "en", string> = {
  fr: "ILS ME FONT CONFIANCE",
  en: "ALREADY WORKING WITH",
};

// Intertitres des deux groupes.
export const CAT_LABEL: Record<BrandCat, Record<"fr" | "en", string>> = {
  hospitality: {
    fr: "MAISONS, TABLES ET DESTINATIONS",
    en: "HOTELS, TABLES AND DESTINATIONS",
  },
  brand: { fr: "MARQUES", en: "BRANDS" },
};
