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
// Intertitres traduits, contrairement a la nav : la nav est faite d'enseignes,
// ces intertitres sont du contenu et se lisent dans la langue de la page.
export type BrandCat = "stays" | "travel" | "brand";
// href : chemin interne, sans prefixe de langue, vers le travail fait pour ce
// client. Un logo n'est cliquable que s'il mene quelque part de reel : une
// page vide derriere un logo vaut moins que pas de lien du tout. Les clients
// dont le contenu n'est pas encore en ligne restent de simples images, et le
// jour ou leur page existe il suffit d'ajouter la ligne.
export type Brand = {
  name: string;
  logo?: string;
  tall?: boolean;
  cat: BrandCat;
  href?: string;
  // Ce qu'on trouve au bout du lien, affiche sous le logo. Deux mots maximum :
  // c'est une legende, pas une phrase.
  hrefLabel?: { fr: string; en: string };
  // Collab actee mais pas encore tournee : le fichier est pret, le nom
  // n'apparait pas. La bande dit "ils me font confiance" au passe ; afficher
  // une maison avant d'y avoir mis les pieds, c'est signer a sa place, et si
  // ca tombe a l'eau c'est une fausse reference sur un site commercial.
  // Passer pending a false le jour du tournage, rien d'autre a faire.
  pending?: boolean;
};

export const BRANDS: Brand[] = [
  // Stays & places : les adresses ou l'on dort et ou l'on mange.
  { name: "MK HOTELS", logo: "/images/brands/mk-hotels.png", cat: "stays" },
  { name: "DORF SCHÖNLEITN", logo: "/images/brands/dorf-schonleitn.svg", cat: "stays", href: "/photographer/hospitality/naturel-dorf-schonleitn", hrefLabel: { fr: "Photos", en: "Photographs" } },
  { name: "VAN DER VALK SELYS", logo: "/images/brands/van-der-valk-selys.png", cat: "stays", href: "/filmmaker", hrefLabel: { fr: "Film", en: "Film" } },
  { name: "COLOC HOUSING", logo: "/images/brands/coloc-housing.png", cat: "stays", href: "/photographer/hospitality/coloc-housing", hrefLabel: { fr: "Photos & film", en: "Photographs & film" } },
  { name: "DAO LIÈGE", logo: "/images/brands/dao-liege.png", cat: "stays", href: "/filmmaker", hrefLabel: { fr: "Film", en: "Film" } },
  // Etapes du voyage Interrail, actees mais pas encore tournees.
  // Vienne 31 aout au 4 septembre, Prague 4 au 7 septembre.
  { name: "HOTEL RATHAUS WIEN", logo: "/images/brands/hotel-rathaus-wien.svg", cat: "stays", pending: true },
  { name: "ALTSTADT VIENNA", logo: "/images/brands/altstadt.png", cat: "stays", pending: true },
  { name: "AT THE GOLDEN PEAR", logo: "/images/brands/golden-pear.png", tall: true, cat: "stays", pending: true },
  { name: "PRAGUESTREAM", logo: "/images/brands/prague-stream.png", cat: "stays", pending: true },

  { name: "CÉ-PAGES", logo: "/images/brands/ce-pages.png", cat: "stays", href: "/photographer/restaurants/ce-pages", hrefLabel: { fr: "Photos & film", en: "Photographs & film" } },

  // City & travel : ceux qui font venir les gens, transporteurs et offices de
  // tourisme. C'est l'autre moitie du marche hotelier, et pour une maison
  // c'est la preuve qu'une destination entiere a confie son image.
  { name: "INTERRAIL", logo: "/images/brands/interrail.svg", cat: "travel" },
  { name: "EUROPEAN SLEEPER", logo: "/images/brands/european-sleeper.png", cat: "travel" },
  // Logo en pastille, avec sa carte blanche et son ombre : il a besoin de la
  // hauteur des badges pour rester lisible entre deux wordmarks larges.
  { name: "KÄRNTEN", logo: "/images/brands/karnten.svg", tall: true, cat: "travel" },
  // Pastille ronde : meme traitement que Kärnten.
  { name: "VISIT GRAZ", logo: "/images/brands/visit-graz.png", tall: true, cat: "travel" },

  // Brands. Sans logo, le nom s'affiche en toutes lettres : mieux vaut citer
  // le client que l'omettre en attendant son fichier.
  { name: "RICOH EUROPE", logo: "/images/brands/ricoh.svg", cat: "brand" },
  { name: "PENTAX EUROPE", logo: "/images/brands/pentax-black.png", cat: "brand" },
  { name: "INSTA360", logo: "/images/brands/insta360-wordmark.svg", cat: "brand" },
  { name: "GODOX", logo: "/images/brands/godox.png", cat: "brand" },
  // Le SVG fourni etait en gris tres clair, pense pour un fond sombre :
  // invisible sur blanc. Recolore en noir, aucune autre retouche.
  { name: "TILTA", logo: "/images/brands/tilta.svg", cat: "brand" },
  { name: "EDIFIER", logo: "/images/brands/edifier.png", cat: "brand" },
  { name: "TELESIN", logo: "/images/brands/telesin.png", cat: "brand" },
  // Logo empile, pictogramme au dessus du nom : a la hauteur des wordmarks il
  // devient illisible, il prend donc celle des badges.
  { name: "STUBBLE & CO", logo: "/images/brands/stubble-and-co.png", tall: true, cat: "brand" },
];

// Ordre d'affichage : les adresses d'abord.
export const BRAND_CATS: readonly BrandCat[] = ["stays", "travel", "brand"];

export function brandsIn(cat: BrandCat): Brand[] {
  return BRANDS.filter((b) => b.cat === cat && !b.pending);
}

// Label de la bande, bilingue (source unique).
export const TRUST_LABEL: Record<"fr" | "en", string> = {
  fr: "ILS ME FONT CONFIANCE",
  en: "ALREADY WORKING WITH",
};

// Intertitres des deux groupes.
export const CAT_LABEL: Record<BrandCat, Record<"fr" | "en", string>> = {
  stays: { fr: "HÔTELS, MAISONS & TABLES", en: "STAYS & PLACES" },
  travel: { fr: "VILLES & VOYAGE", en: "CITY & TRAVEL" },
  brand: { fr: "MARQUES", en: "BRANDS" },
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
