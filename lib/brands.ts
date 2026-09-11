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
  // Sorti de la bande "Ils m'ont fait confiance", garde sur la page du cas.
  // Dao est le spa du Selys, pas une autre adresse : dans la bande il se
  // lisait comme un client de plus, alors qu'en bas de la page Selys il dit
  // quelque chose de vrai, deux espaces couverts chez le meme client.
  bandHidden?: boolean;
};

// Le vert du logo Rathaus Wein & Design, #becaac, donnait 1,7 contre 1 sur blanc :
// il se lisait comme une trace, pas comme un nom. Meme teinte, assombrie
// jusqu'a 4,7 contre 1, dans hotel-rathaus-wien-dark.svg. L'original est
// garde a cote.
//
// Quatre logos arrivaient en rectangle plein : Van der Valk sur vert fonce,
// Ce Pages sur violet, European Sleeper sur prune, Altstadt sur blanc opaque. Dans une rangee de logos
// detoures, un aplat de couleur se lit comme une vignette et casse la ligne.
// Ils passent en version monochrome sombre sur fond transparent, suffixe
// -mono, traitement courant pour un mur de clients. Les fichiers d'origine
// restent dans public/images/brands : il suffit de retirer le suffixe pour
// revenir en arriere.
export const BRANDS: Brand[] = [
  // Stays & places : les adresses ou l'on dort et ou l'on mange.
  // MK HOTELS retire le 05/09, decision de Sandrine : le travail n'est pas au
  // niveau du reste. Le cas et le film sont retires en meme temps. Le fichier
  // mk-hotels.png reste dans public/images/brands, remettre la ligne suffit.
  { name: "DORF SCHÖNLEITN", logo: "/images/brands/dorf-schonleitn.svg", cat: "stays", href: "/photographer/hospitality/naturel-dorf-schonleitn", hrefLabel: { fr: "Photos & film", en: "Photographs & film" } },
  { name: "VAN DER VALK SÉLYS", logo: "/images/brands/van-der-valk-selys-mono.png", cat: "stays", href: "/photographer/restaurants/van-der-valk-selys", hrefLabel: { fr: "Photos & film", en: "Photographs & film" } },
  { name: "DAO LIÈGE", logo: "/images/brands/dao-liege.png", cat: "stays", href: "/photographer/restaurants/van-der-valk-selys", hrefLabel: { fr: "Film", en: "Film" }, bandHidden: true },
  // Etapes du voyage Interrail, actees mais pas encore tournees.
  // Vienne 31 aout au 4 septembre, Prague 4 au 7 septembre.
  { name: "HOTEL RATHAUS WEIN & DESIGN", logo: "/images/brands/hotel-rathaus-wien-dark.svg", cat: "stays", href: "/photographer/hospitality/hotel-rathaus-wien", hrefLabel: { fr: "Photos & film", en: "Photographs & film" } },
  { name: "ALTSTADT VIENNA, AN SLH HOTEL", logo: "/images/brands/altstadt-mono.png", cat: "stays", href: "/photographer/hospitality/altstadt-vienna", hrefLabel: { fr: "Photos", en: "Photographs" } },
  { name: "AT THE GOLDEN PEAR", logo: "/images/brands/golden-pear.png", tall: true, cat: "stays", pending: true },
  { name: "PRAGUESTREAM", logo: "/images/brands/prague-stream.png", cat: "stays", pending: true },

  { name: "CÉ-PAGES", logo: "/images/brands/ce-pages-mono.png", cat: "stays", href: "/photographer/restaurants/ce-pages", hrefLabel: { fr: "Photos & film", en: "Photographs & film" } },

  // City & travel : ceux qui font venir les gens, transporteurs et offices de
  // tourisme. C'est l'autre moitie du marche hotelier, et pour une maison
  // c'est la preuve qu'une destination entiere a confie son image.
  { name: "INTERRAIL", logo: "/images/brands/interrail.svg", cat: "travel" },
  { name: "EUROPEAN SLEEPER", logo: "/images/brands/european-sleeper-mono.png", cat: "travel" },
  // Logo en pastille, avec sa carte blanche et son ombre : il a besoin de la
  // hauteur des badges pour rester lisible entre deux wordmarks larges.
  { name: "KÄRNTEN", logo: "/images/brands/karnten.svg", tall: true, cat: "travel", href: "/photographer/travel/villach", hrefLabel: { fr: "Photos & film", en: "Photographs & film" } },
  // Pastille ronde : meme traitement que Kärnten.
  { name: "VISIT GRAZ", logo: "/images/brands/visit-graz.png", tall: true, cat: "travel", href: "/photographer/travel/graz", hrefLabel: { fr: "Photos & film", en: "Photographs & film" } },

  // Brands. Sans logo, le nom s'affiche en toutes lettres : mieux vaut citer
  // le client que l'omettre en attendant son fichier.
  //
  // Liens vers Creator ouverts le 05/09, decision de Sandrine. Le 31/08 on
  // avait laisse ces logos muets pour qu'un directeur d'hotel ne lise pas
  // d'abord du test de materiel ; le regroupement par categorie fait deja ce
  // travail, les adresses passent avant et il ne les voit qu'apres.
  //
  // Legende "Videos" et pas "Film" : sur ce site Film designe les diaries
  // cinematiques de la page Videaste. Le contenu Creator est du format court
  // de marque, ce n'est pas la meme promesse et un directeur d'hotel qui clique
  // doit savoir lequel des deux il ouvre.
  //
  // Quatre marques restent muettes faute de destination reelle : Godox et
  // Tilta n'ont aucun film en ligne, Stubble & Co non plus, et le film Edifier
  // est un diary de categorie lifestyle, non publiee (PUBLISHED_DIARY_CATS
  // dans app/[lang]/filmmaker/constants.ts). Le jour ou leur contenu sort, il
  // suffit d'ajouter la ligne.
  { name: "RICOH EUROPE", logo: "/images/brands/ricoh.svg", cat: "brand", href: "/creator/gear#ricoh", hrefLabel: { fr: "Vidéos", en: "Videos" } },
  { name: "PENTAX EUROPE", logo: "/images/brands/pentax-black.png", cat: "brand", href: "/creator/gear#pentax", hrefLabel: { fr: "Vidéos", en: "Videos" } },
  { name: "INSTA360", logo: "/images/brands/insta360-wordmark.svg", cat: "brand", href: "/creator/gear#insta360", hrefLabel: { fr: "Vidéos", en: "Videos" } },
  { name: "GODOX", logo: "/images/brands/godox.png", cat: "brand" },
  // Le SVG fourni etait en gris tres clair, pense pour un fond sombre :
  // invisible sur blanc. Recolore en noir, aucune autre retouche.
  { name: "TILTA", logo: "/images/brands/tilta.svg", cat: "brand" },
  { name: "EDIFIER", logo: "/images/brands/edifier.png", cat: "brand" },
  { name: "TELESIN", logo: "/images/brands/telesin.png", cat: "brand", href: "/creator/unboxing#telesin", hrefLabel: { fr: "Vidéos", en: "Videos" } },
  // Logo empile, pictogramme au dessus du nom : a la hauteur des wordmarks il
  // devient illisible, il prend donc celle des badges.
  { name: "STUBBLE & CO", logo: "/images/brands/stubble-and-co.png", tall: true, cat: "brand" },
];

// Ordre d'affichage : les adresses d'abord.
export const BRAND_CATS: readonly BrandCat[] = ["stays", "travel", "brand"];

export function brandsIn(cat: BrandCat): Brand[] {
  return BRANDS.filter((b) => b.cat === cat && !b.pending && !b.bandHidden);
}

// Label de la bande, bilingue (source unique).
export const TRUST_LABEL: Record<"fr" | "en", string> = {
  fr: "ILS M'ONT FAIT CONFIANCE",
  en: "THEY TRUSTED ME",
};

// Intertitres des deux groupes.
export const CAT_LABEL: Record<BrandCat, Record<"fr" | "en", string>> = {
  stays: { fr: "HÔTELS, MAISONS & TABLES", en: "HOTELS, HOUSES & TABLES" },
  travel: { fr: "VILLES & VOYAGE", en: "CITIES & TRAVEL" },
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

// Logos du ou des clients d'un cas, pour la page du cas elle meme.
// Pose le 10/09 : jusque la, la preuve qu'un cas etait une commande vivait
// uniquement sur About, alors que la plupart des visiteurs arrivent
// directement sur une page de cas depuis une recherche ou un lien partage.
//
// Pas la bande complete, un seul logo, celui du client de ce cas. Une rangee
// de quinze marques sur une page qui ne montre que des photos vole
// l'attention, et c'est deja ce qui avait fait reordonner la bande le 31/08.
//
// Rien de nouveau a maintenir : chaque logo porte deja le chemin de son cas
// dans href, on relit ce champ a l'envers. Un cas sans client, une serie de
// ville personnelle par exemple, ne renvoie rien et n'affiche donc rien :
// l'absence est plus juste qu'un logo emprunte.
export function brandsForCase(category: string, caseSlug: string): Brand[] {
  const path = `/photographer/${category}/${caseSlug}`;
  return BRANDS.filter((b) => !b.pending && b.logo && b.href === path);
}

// "Une commande de" : la ligne qui introduit le ou les logos sur un cas.
export const COMMISSION_LABEL: Record<"fr" | "en", string> = {
  fr: "UNE COMMANDE DE",
  en: "COMMISSIONED BY",
};
