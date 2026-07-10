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

// Convention : dans chaque dossier, la photo "1" est aussi la couverture
// affichée sur la tuile d'accueil.
export const PHOTO_CATEGORIES: PhotoCategory[] = [
  { slug: "street",       label: "Street",       cover: "/images/portfolio/street/1.jpg" },
  { slug: "portrait",     label: "Portrait",     cover: "/images/portfolio/portrait/1.jpg" },
  { slug: "fashion",      label: "Fashion",      cover: "/images/portfolio/fashion/1.jpg" },
  { slug: "studio",       label: "Studio",       cover: "/images/portfolio/studio/1.jpg" },
  { slug: "travel",       label: "Travel",       cover: "/images/portfolio/travel/1.jpg" },
  { slug: "details",      label: "Details",      cover: "/images/portfolio/details/1.jpg" },
  { slug: "beauty",       label: "Beauty",       cover: "/images/portfolio/beauty/1.jpg" },
  { slug: "architecture", label: "Architecture", cover: "/images/portfolio/architecture/1.jpg" },
  { slug: "creative",     label: "Creative",     cover: "/images/portfolio/creative/1.jpg" },
];

export const PHOTO_CATEGORY_SLUGS = PHOTO_CATEGORIES.map((c) => c.slug);
