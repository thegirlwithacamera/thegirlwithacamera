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
  { slug: "street",       label: "Street",       cover: "/images/portfolio/street/7.jpg" },
  { slug: "portrait",     label: "Portrait",     cover: "/images/portfolio/portrait/2.jpg" },
  { slug: "fashion",      label: "Fashion",      cover: "/images/portfolio/fashion/3.jpg" },
  { slug: "studio",       label: "Studio",       cover: "/images/portfolio/studio/3.jpg" },
  { slug: "travel",       label: "Travel",       cover: "/images/portfolio/travel/5.jpg" },
  // Details : photos a venir (mardi). Couverture provisoire en attendant.
  { slug: "details",      label: "Details",      cover: "/images/portfolio/12.JPG" },
  { slug: "beauty",       label: "Beauty",       cover: "/images/portfolio/beauty/1.jpg" },
  { slug: "architecture", label: "Architecture", cover: "/images/portfolio/architecture/2.jpg" },
  { slug: "art",          label: "Art",          cover: "/images/portfolio/art/4.jpg" },
];

export const PHOTO_CATEGORY_SLUGS = PHOTO_CATEGORIES.map((c) => c.slug);
