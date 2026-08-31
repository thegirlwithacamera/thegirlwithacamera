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
//
// Intertitres en anglais dans les deux langues, comme la nav : ce sont des
// enseignes de rubrique, pas des phrases.
export type BrandCat = "stays" | "travel" | "brand";
export type Brand = { name: string; logo?: string; tall?: boolean; cat: BrandCat };

export const BRANDS: Brand[] = [
  // Stays & places : les adresses ou l'on dort et ou l'on mange.
  { name: "MK HOTELS", logo: "/images/brands/mk-hotels.png", cat: "stays" },
  { name: "DORF SCHÖNLEITN", logo: "/images/brands/dorf-schonleitn.svg", cat: "stays" },
  { name: "VAN DER VALK SELYS", logo: "/images/brands/van-der-valk-selys.png", cat: "stays" },
  { name: "COLOC HOUSING", logo: "/images/brands/coloc-housing.png", cat: "stays" },
  { name: "DAO LIÈGE", logo: "/images/brands/dao-liege.png", cat: "stays" },
  { name: "CÉ-PAGES", logo: "/images/brands/ce-pages.png", cat: "stays" },

  // City & travel : ceux qui font venir les gens, transporteurs et offices de
  // tourisme. C'est l'autre moitie du marche hotelier, et pour une maison
  // c'est la preuve qu'une destination entiere a confie son image.
  { name: "INTERRAIL", cat: "travel" },
  { name: "EUROPEAN SLEEPER", cat: "travel" },
  // Logo en pastille, avec sa carte blanche et son ombre : il a besoin de la
  // hauteur des badges pour rester lisible entre deux wordmarks larges.
  { name: "KÄRNTEN", logo: "/images/brands/karnten.svg", tall: true, cat: "travel" },
  { name: "VISIT GRAZ", cat: "travel" },

  // Brands. Sans logo, le nom s'affiche en toutes lettres : mieux vaut citer
  // le client que l'omettre en attendant son fichier.
  { name: "RICOH EUROPE", logo: "/images/brands/ricoh.svg", cat: "brand" },
  { name: "PENTAX EUROPE", logo: "/images/brands/pentax-black.png", cat: "brand" },
  { name: "INSTA360", logo: "/images/brands/insta360-wordmark.svg", cat: "brand" },
  { name: "GODOX", cat: "brand" },
  { name: "TILTA", cat: "brand" },
  { name: "EDIFIER", logo: "/images/brands/edifier.png", cat: "brand" },
  { name: "TELESIN", logo: "/images/brands/telesin.png", cat: "brand" },
  { name: "STUBBLE & CO", cat: "brand" },
];

// Ordre d'affichage : les adresses d'abord.
export const BRAND_CATS: readonly BrandCat[] = ["stays", "travel", "brand"];

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
  stays: { fr: "STAYS & PLACES", en: "STAYS & PLACES" },
  travel: { fr: "CITY & TRAVEL", en: "CITY & TRAVEL" },
  brand: { fr: "BRANDS", en: "BRANDS" },
};

// Une ligne de contexte sous un groupe, quand les logos seuls disent moins que
// la verite. Ricoh et Pentax lus comme deux marques de materiel racontent un
// partenariat produit ; la meme paire, avec Arles, raconte que deux maisons ont
// choisi ces images pour le festival de reference en Europe. C'est la place de
// cette ligne : sous les logos qu'elle requalifie, pas dans les offres, ou une
// exposition n'a rien a voir avec ce qu'on achete.
export const CAT_NOTE: Partial<Record<BrandCat, Record<"fr" | "en", string>>> = {
  brand: {
    fr: "Ricoh France et Pentax Europe ont exposé mon travail aux Rencontres d'Arles.",
    en: "Ricoh France and Pentax Europe exhibited my work at Les Rencontres d'Arles.",
  },
};
