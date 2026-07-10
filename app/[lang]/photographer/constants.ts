// Les 9 catégories de la grille d'accueil (Photographer).
// L'ordre ici = l'ordre dans la grille 3×3.
//
// Pour chaque catégorie :
//   - slug   : segment d'URL (/photographer/<slug>) + nom du dossier photos
//   - label  : texte affiché (identique FR/EN, comme Filmmaker/Creator)
//   - cover  : photo représentative montrée dans la tuile d'accueil
//
// Les photos de chaque catégorie se rangent dans
//   public/images/portfolio/<slug>/
// (à trier comme pour les vidéos). La page /photographer/<slug> les liste.
//
// Pour renommer une catégorie : change label (et slug si tu veux une nouvelle
// URL — pense alors à renommer le dossier). Pour changer la photo de couverture :
// change cover.

export type PhotoCategory = {
  slug: string;
  label: string;
  cover: string;
};

export const PHOTO_CATEGORIES: PhotoCategory[] = [
  { slug: "street",       label: "Street",        cover: "/images/portfolio/4.JPG" },
  { slug: "portrait",     label: "Portrait",      cover: "/images/portfolio/9.JPG" },
  { slug: "fashion",      label: "Fashion",       cover: "/images/portfolio/7.JPG" },
  { slug: "studio",       label: "Studio",        cover: "/images/portfolio/13.JPG" },
  { slug: "travel",       label: "Travel",        cover: "/images/portfolio/16.JPG" },
  { slug: "details",      label: "Details",       cover: "/images/portfolio/12.JPG" },
  { slug: "beauty",       label: "Beauty",        cover: "/images/portfolio/5.JPG" },
  { slug: "architecture", label: "Architecture",  cover: "/images/portfolio/22.JPG" },
  { slug: "black-white",  label: "Black & White", cover: "/images/portfolio/26.JPG" },
];

export const PHOTO_CATEGORY_SLUGS = PHOTO_CATEGORIES.map((c) => c.slug);
