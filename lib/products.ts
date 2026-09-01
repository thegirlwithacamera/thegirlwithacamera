// ─────────────────────────────────────────────────────────────
// Les produits numériques.
//
// Ils ne sont pas vendus par le site : la vente, la livraison et la TVA
// européenne sont portées par Gumroad, qui est vendeur de référence depuis
// janvier 2025. Le site ne fait que la vitrine, ce qui évite de remonter un
// tunnel de paiement, une base de données et un webhook comme l'ancienne
// boutique de tirages, sortie le 01/09.
//
// La page /shop n'est pas dans la navigation, décision du 01/09 : un hôtelier
// qui regarde le portfolio ne doit pas croiser un bouton d'achat. Elle reste
// indexable, parce que « presets Ricoh GR » est une requête que des gens
// tapent vraiment. C'est un lien à mettre en bio, dans le Substack et sur
// Pinterest.
//
// AJOUTER UN PRODUIT : une entrée ici, rien d'autre. `live: false` le prépare
// sans l'afficher.
// ─────────────────────────────────────────────────────────────

export type Product = {
  slug: string;
  live: boolean;
  title: { fr: string; en: string };
  kind: { fr: string; en: string };
  blurb: { fr: string; en: string };
  url: string;
  cover?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "ricoh-presets",
    live: true,
    title: { fr: "15 presets Lightroom", en: "15 Lightroom presets" },
    kind: { fr: "Presets", en: "Presets" },
    blurb: {
      fr: "Mon rendu cinématique en trois familles, froide, douce et chaude. Desktop, Classic et mobile.",
      en: "My cinematic look in three families, cold, soft and warm. Desktop, Classic and mobile.",
    },
    url: "https://sandrine783.gumroad.com/l/ricoh-presets",
  },
  // En préparation, dans l'ordre décidé le 01/09. Passer `live` à true quand
  // le fichier est en ligne sur Gumroad et que l'URL est la bonne.
  {
    slug: "how-i-shoot",
    live: false,
    title: { fr: "How I shoot", en: "How I shoot" },
    kind: { fr: "Guide", en: "Guide" },
    blurb: {
      fr: "Photographier une ville à cinq heures du matin. Les réglages, les heures, et les trois règles qui décident du reste.",
      en: "Photographing a city at five in the morning. The settings, the hours, and the three rules that decide the rest.",
    },
    url: "",
  },
  {
    slug: "pitch-hotels",
    live: false,
    title: { fr: "Pitcher les hôtels", en: "Pitching hotels" },
    kind: { fr: "Guide et modèles", en: "Guide and templates" },
    blurb: {
      fr: "Trouver la bonne adresse, écrire au bon interlocuteur, chiffrer, et céder les bons droits. Avec les modèles que j'utilise.",
      en: "Finding the right address, writing to the right person, quoting, and licensing properly. With the templates I use.",
    },
    url: "",
  },
];

export const LIVE_PRODUCTS = PRODUCTS.filter((p) => p.live && p.url);
