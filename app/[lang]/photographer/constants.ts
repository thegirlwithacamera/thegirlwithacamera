// Les 9 catégories de la grille d'accueil (Photographer).
// L'ordre ici = l'ordre dans la grille 3×3.
//
// Pour chaque catégorie :
//   - slug        : segment d'URL (/photographer/<slug>) + nom du dossier photos
//   - label.fr/en : texte affiché (utilisé dans les titres de page, alt text, JSON-LD —
//                   la grille d'accueil elle-même n'affiche aucun texte sur les tuiles)
//   - cover       : photo représentative montrée dans la tuile d'accueil
//
// Les photos de chaque catégorie se rangent dans
//   public/images/portfolio/<slug>/
// La page /photographer/<slug> les liste, triées par nom de fichier (ordre
// choisi à la main en renumérotant les fichiers). Convention : la photo
// "1" de chaque dossier est aussi la couverture affichée sur la tuile
// d'accueil.
//
// Pour renommer une catégorie : change label.fr/label.en (et slug si tu veux
// une nouvelle URL — pense alors à renommer le dossier).

export type PhotoCategory = {
  slug: string;
  label: { fr: string; en: string };
  cover: string;
};

export const PHOTO_CATEGORIES: PhotoCategory[] = [
  { slug: "studio",       label: { fr: "Studio",       en: "Studio" },       cover: "/images/portfolio/studio/1.jpg" },
  { slug: "travel",       label: { fr: "Voyage",       en: "Travel" },       cover: "/images/portfolio/travel/1.jpg" },
  { slug: "fashion",      label: { fr: "Mode",         en: "Fashion" },      cover: "/images/portfolio/fashion/1.jpg" },
  { slug: "details",      label: { fr: "Détails",      en: "Details" },      cover: "/images/portfolio/details/1.jpg" },
  { slug: "portrait",     label: { fr: "Portrait",     en: "Portrait" },     cover: "/images/portfolio/portrait/1.jpg" },
  { slug: "street",       label: { fr: "Rue",          en: "Street" },       cover: "/images/portfolio/street/1.jpg" },
  { slug: "beauty",       label: { fr: "Beauté",       en: "Beauty" },       cover: "/images/portfolio/beauty/1.jpg" },
  { slug: "architecture", label: { fr: "Architecture", en: "Architecture" }, cover: "/images/portfolio/architecture/1.jpg" },
  { slug: "creative",     label: { fr: "Créatif",      en: "Creative" },     cover: "/images/portfolio/creative/1.jpg" },
];

export const PHOTO_CATEGORY_SLUGS = PHOTO_CATEGORIES.map((c) => c.slug);
