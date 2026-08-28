// ─────────────────────────────────────────────────────────────
// Structure du portfolio photo.
//
// Deux niveaux :
//   catégorie          /photographer/<catégorie>
//   cas                /photographer/<catégorie>/<cas>
//
// Un cas, c'est un client, une destination ou une série. Jamais une image seule.
//
// Les fichiers se rangent dans
//   public/images/portfolio/<catégorie>/<cas>/
// numérotés 1, 2, 3... L'ordre des numéros est l'ordre d'affichage, et le
// fichier 1 sert de couverture à la vignette du cas.
//
// Règles de remplissage (voir aussi _MAPPING.md dans le dossier des images) :
//   - le nombre d'images d'un cas est un multiple de 3
//   - en dessous du plancher, le cas part dans _en-attente/ plutôt que sur le site
//   - deux cadrages proches ne se suivent jamais
//
// Un cas déclaré ici mais dont le dossier est vide n'est pas affiché : la
// déclaration dit l'intention, le système de fichiers décide de la visibilité.
// C'est ce qui permet de préparer un cas avant d'avoir les images.
// ─────────────────────────────────────────────────────────────

// Un film rattaché à un cas. Le chemin doit pointer dans
// public/videos/creator/ : c'est le seul dossier vidéo réellement déployé.
// public/videos/* est ignoré par git, _originals/ et city-diary/ le sont par
// Vercel. Un fichier posé ailleurs s'affiche en local et nulle part ailleurs.
// Le label ne sert que quand un cas a plusieurs films ; avec un seul film,
// le titre de la page suffit.
export type CaseFilm = {
  src: string;
  label?: { fr: string; en: string };
};

export type PhotoCase = {
  slug: string;
  label: { fr: string; en: string };
  // Lieu affiché sous le titre du cas : ville et pays, ou rien.
  place?: { fr: string; en: string };
  // Position CSS object-position pour le crop 4:5 de la vignette du cas.
  coverPosition?: string;
  // Films tournés sur place, affichés sous les photos, dans leur format natif.
  // Une adresse se visite en photo et en mouvement : les deux vivent sur la
  // même page. La page Vidéaste reste pour les lieux sans photos.
  films?: CaseFilm[];
};

export type PhotoCategory = {
  slug: string;
  label: { fr: string; en: string };
  // Photo représentative montrée sur la tuile d'accueil.
  cover: string;
  coverPosition?: string;
  cases: PhotoCase[];
};

export const PHOTO_CATEGORIES: PhotoCategory[] = [
  {
    slug: "hospitality",
    label: { fr: "Hôtels & maisons", en: "Hotels & venues" },
    cover: "/images/portfolio/hospitality/naturel-dorf-schonleitn/3.jpg",
    cases: [
      {
        slug: "naturel-dorf-schonleitn",
        label: { fr: "Naturel Dorf Schönleitn", en: "Naturel Dorf Schönleitn" },
        place: { fr: "Carinthie, Autriche", en: "Carinthia, Austria" },
      },
      {
        slug: "coloc-housing",
        label: { fr: "Coloc Housing", en: "Coloc Housing" },
        place: { fr: "Liège, Belgique", en: "Liège, Belgium" },
        // Un seul film, celui de la maison. Le second montrait la vie sur
        // place et tirait la page vers le reportage.
        films: [{ src: "/videos/creator/CINEMATIC/PLACES/Coloc Housing.mp4" }],
      },
    ],
  },
  {
    slug: "restaurants",
    label: { fr: "Restaurants & bars", en: "Restaurants & bars" },
    cover: "/images/portfolio/restaurants/ce-pages/1.jpg",
    cases: [
      {
        slug: "ce-pages",
        label: { fr: "Cé Pages", en: "Cé Pages" },
        place: { fr: "Liège, Belgique", en: "Liège, Belgium" },
        films: [{ src: "/videos/creator/CINEMATIC/PLACES/Cé-Pages.mp4" }],
      },
      // En attente : selys-liege, 6 images sur un disque non disponible.
    ],
  },
  {
    slug: "travel",
    label: { fr: "Voyage", en: "Travel" },
    cover: "/images/portfolio/travel/tokyo/1.jpg",
    cases: [
      { slug: "tokyo",   label: { fr: "Tokyo",   en: "Tokyo" },   place: { fr: "Japon", en: "Japan" } },
      { slug: "kyoto",   label: { fr: "Kyoto",   en: "Kyoto" },   place: { fr: "Japon", en: "Japan" } },
      { slug: "napoli",  label: { fr: "Napoli",  en: "Napoli" },  place: { fr: "Italie", en: "Italy" } },
      { slug: "venezia", label: { fr: "Venezia", en: "Venezia" }, place: { fr: "Italie", en: "Italy" } },
      { slug: "burano",  label: { fr: "Burano",  en: "Burano" },  place: { fr: "Italie", en: "Italy" } },
      { slug: "palermo", label: { fr: "Palermo", en: "Palermo" }, place: { fr: "Italie", en: "Italy" } },
      // En attente : koln, firenze, cefalu, faro, kawaguchiko, osaka, nara.
    ],
  },
  {
    slug: "portraits",
    label: { fr: "Portraits", en: "Portraits" },
    cover: "/images/portfolio/portraits/silke-hamers/1.jpg",
    cases: [
      { slug: "silke-hamers", label: { fr: "Silke Hamers", en: "Silke Hamers" } },
      {
        slug: "studio-nb",
        label: { fr: "Studio, noir et blanc", en: "Studio, black & white" },
      },
    ],
  },
  // En attente : editorial, un seul cas de 3 images (bijoux).
];

export const PHOTO_CATEGORY_SLUGS = PHOTO_CATEGORIES.map((c) => c.slug);

export function findCategory(slug: string) {
  return PHOTO_CATEGORIES.find((c) => c.slug === slug);
}

export function findCase(categorySlug: string, caseSlug: string) {
  const cat = findCategory(categorySlug);
  if (!cat) return undefined;
  const item = cat.cases.find((c) => c.slug === caseSlug);
  return item ? { cat, item } : undefined;
}

// ─────────────────────────────────────────────────────────────
// Tuiles d'accueil qui ne sont pas des catégories.
// Elles complètent la grille et se lisent comme des portes : les tuiles de
// catégorie portent une légende grise, celles-ci une légende noire suivie
// d'une flèche. Même gabarit, signal suffisant.
// L'ordre ci-dessous est l'ordre d'affichage, après les catégories.
// ─────────────────────────────────────────────────────────────

export type HomeTile = {
  key: string;
  href: string;
  label: { fr: string; en: string };
  cover?: string;
  coverPosition?: string;
};

export const HOME_TILES: HomeTile[] = [
  {
    key: "film",
    href: "/filmmaker",
    label: { fr: "Film", en: "Film" },
    // Image extraite d'un original City Diary. Rangée dans /images/tiles et
    // surtout pas dans /images/film ni /videos/city-diary : ces deux dossiers
    // sont listés dans .vercelignore, donc jamais déployés. Un fichier peut
    // être dans git et absent du site.
    cover: "/images/tiles/film.jpg",
  },
  {
    key: "work",
    href: "/about#travailler-avec-moi",
    label: { fr: "Travaillons ensemble", en: "Work with me" },
    cover: "/images/about/hero.jpg",
  },
];
