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
  // Nom court, uniquement pour la vignette de l'accueil, où il est posé sur
  // la photo. "Naturel Dorf Schönleitn" en capitales espacées sur une tuile
  // de 380 pixels prenait deux lignes et salissait la grille. Le nom complet
  // reste partout ailleurs : titre de la page du lieu, alt, sitemap, partage.
  // Absent, c'est label qui sert.
  short?: { fr: string; en: string };
  // Lieu affiché sous le titre du cas : ville et pays, ou rien.
  place?: { fr: string; en: string };
  // Deux phrases sous le titre, au dessus des images. La première décrit ce
  // que le lieu fait à l'image, la seconde porte la date. Jamais une critique
  // d'hôtel, jamais un superlatif. Sert aussi d'alt à la première image : une
  // page de douze photos sans un mot ne se positionne sur rien.
  intro?: { fr: string; en: string };
  // Mois et année du tournage, affichés à la suite de l'intro.
  shotAt?: { fr: string; en: string };
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
  // Séries de ville. Sur la page Photographe, ces catégories vont dans leur
  // propre bloc, sous leur propre titre, parce que ce n'est pas la même offre
  // qu'un reportage de maison : on vend un regard sur une ville, pas la visite
  // d'une adresse. Le bloc s'adresse aux offices du tourisme et aux compagnies
  // de train.
  //
  // Renommé le 01/09 (c'était `personal`). Le mot disait travail personnel,
  // donc loisir, alors que c'est une ligne commerciale à part entière.
  citySeries?: boolean;
  cases: PhotoCase[];
};

export const PHOTO_CATEGORIES: PhotoCategory[] = [
  {
    slug: "hospitality",
    label: { fr: "Hôtels & maisons", en: "Hotels & venues" },
    cover: "/images/portfolio/hospitality/naturel-dorf-schonleitn/1.jpg",
    cases: [
      {
        slug: "naturel-dorf-schonleitn",
        label: { fr: "Naturel Dorf Schönleitn", en: "Naturel Dorf Schönleitn" },
        short: { fr: "Dorf Schönleitn", en: "Dorf Schönleitn" },
        place: { fr: "Carinthie, Autriche", en: "Carinthia, Austria" },
        intro: {
          fr: "Un village de chalets en bois posé au dessus du lac de Faak, en Carinthie, où la lumière du matin arrive tard et reste basse.",
          en: "A village of wooden chalets above Lake Faak, in Carinthia, where the morning light arrives late and stays low.",
        },
        shotAt: {
          fr: "Photographié sur deux jours, en août 2026.",
          en: "Photographed over two days, August 2026.",
        },
      },
      {
        slug: "hotel-rathaus-wien",
        label: { fr: "Hotel Rathaus Wien", en: "Hotel Rathaus Wien" },
        short: { fr: "Rathaus Wien", en: "Rathaus Wien" },
        place: { fr: "Vienne, Autriche", en: "Vienna, Austria" },
        intro: {
          fr: "Une maison viennoise à deux pas du Rathaus, une salle de bain vert profond, des fenêtres qui donnent directement sur la rue.",
          en: "A Viennese house a few steps from the Rathaus, a deep green bathroom, windows opening straight onto the street.",
        },
        shotAt: {
          fr: "Photographié début septembre 2026.",
          en: "Photographed in early September 2026.",
        },
      },
      {
        // Une seule adresse, deux films. Dao n'est pas un restaurant voisin :
        // c'est le spa du Sélys, au premier étage, et le fichier qui porte son
        // nom montre le sauna, le mur de sel et le salon de repos. Le fichier
        // "VanDerValk Sélys" montre la salle et le bar. Les noms de fichiers
        // sont donc trompeurs, ce sont les libellés ci dessous qui font foi à
        // l'écran ; on ne renomme rien sans le dire à Sandrine.
        //
        // Le cas est déclaré avant l'arrivée des photos du restaurant. Tant
        // que le dossier public/images/portfolio/hospitality/van-der-valk-selys
        // est vide, la page n'existe pas, le cas n'apparaît ni en accueil ni
        // dans la catégorie, et la page Vidéaste affiche le nom sans proposer
        // de lien. Le jour où les images arrivent, tout s'allume seul.
        slug: "van-der-valk-selys",
        label: { fr: "Van der Valk Sélys", en: "Van der Valk Sélys" },
        short: { fr: "Sélys Liège", en: "Sélys Liège" },
        place: { fr: "Liège, Belgique", en: "Liège, Belgium" },
        // À RELIRE PAR SANDRINE : écrit d'après les films, pas d'après le
        // séjour. Deux phrases, le lieu et la date, jamais une critique.
        intro: {
          fr: "Un hôtel liégeois qui tient une table et un spa sous le même toit, du sauna au mur de sel jusqu'à la salle du soir.",
          en: "A Liège hotel holding a table and a spa under one roof, from the sauna and the salt wall through to the evening dining room.",
        },
        shotAt: {
          fr: "Photographié en juillet 2026.",
          en: "Photographed in July 2026.",
        },
        films: [
          { src: "/videos/creator/CINEMATIC/PLACES/VanDerValk Sélys.mp4", label: { fr: "Le restaurant", en: "The restaurant" } },
          { src: "/videos/creator/CINEMATIC/PLACES/Dao Liège.mp4", label: { fr: "Le spa", en: "The spa" } },
        ],
      },
      // Coloc Housing retiré le 01/09, décision de Sandrine. La collaboration
      // s'est terminée sur un retrait de licence de sa part. Les images et le
      // film restent sur le disque, rien n'est supprimé : c'est la publication
      // qui s'arrête. Le film est masqué de la page Vidéaste via HIDDEN_FILMS
      // dans app/[lang]/filmmaker/constants.ts, et le logo est sorti de
      // lib/brands.ts.
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
        intro: {
          fr: "Un bar à vin liégeois photographié pendant le service, en lumière existante, sans rien déplacer.",
          en: "A Liège wine bar photographed during service, in the light that was there, with nothing moved.",
        },
        // Pas de shotAt : la date du tournage n'est pas retrouvée. À ajouter.
        films: [{ src: "/videos/creator/CINEMATIC/PLACES/Cé-Pages.mp4" }],
      },
      // En attente : selys-liege, 6 images sur un disque non disponible.
    ],
  },
  {
    slug: "travel",
    label: { fr: "Voyage", en: "Travel" },
    cover: "/images/portfolio/travel/tokyo/1.jpg",
    citySeries: true,
    cases: [
      {
        // Première commande de la catégorie Voyage : un office du tourisme,
        // pas une série personnelle. Elle est en tête du bloc pour ça.
        slug: "villach",
        label: { fr: "Region Villach", en: "Region Villach" },
        short: { fr: "Villach", en: "Villach" },
        place: { fr: "Carinthie, Autriche", en: "Carinthia, Austria" },
        intro: {
          fr: "Une ville de Carinthie sous ses parapluies suspendus, un lac turquoise à dix minutes, et la brume qui descend sur les montagnes au matin.",
          en: "A Carinthian town under its hanging umbrellas, a turquoise lake ten minutes away, and the mist coming down on the mountains in the morning.",
        },
        shotAt: {
          fr: "Photographié sur trois jours, en août 2026, pour Region Villach Tourismus.",
          en: "Photographed over three days, August 2026, for Region Villach Tourismus.",
        },
        films: [{ src: "/videos/creator/CINEMATIC/CITIES/Villach.mp4" }],
      },
      {
        slug: "tokyo",
        label: { fr: "Tokyo", en: "Tokyo" },
        place: { fr: "Japon", en: "Japan" },
        intro: {
          fr: "Tokyo à cinq heures du matin, puis la nuit. Deux villes qui ne se ressemblent pas.",
          en: "Tokyo at five in the morning, then at night. Two cities that look nothing alike.",
        },
        films: [
          { src: "/videos/creator/CINEMATIC/CITIES/City Diary Tokyo.mp4", label: { fr: "Le jour", en: "Daytime" } },
          { src: "/videos/creator/CINEMATIC/CITIES/City Diary Tokyo Night.mp4", label: { fr: "La nuit", en: "By night" } },
        ],
      },
      {
        slug: "kyoto",
        label: { fr: "Kyoto", en: "Kyoto" },
        place: { fr: "Japon", en: "Japan" },
        intro: {
          fr: "Kyoto sous la pluie et au crépuscule, les torii quand il n'y a plus personne devant.",
          en: "Kyoto in the rain and at dusk, the torii when there is no longer anyone standing in front of them.",
        },
        films: [{ src: "/videos/creator/CINEMATIC/CITIES/City Diary Kyoto.mp4" }],
      },
      {
        slug: "napoli",
        label: { fr: "Napoli", en: "Napoli" },
        place: { fr: "Italie", en: "Italy" },
        intro: {
          fr: "Naples de bonne heure, quand les rues appartiennent encore à ceux qui y vivent.",
          en: "Naples early on, while the streets still belong to the people who live in them.",
        },
      },
      {
        slug: "venezia",
        label: { fr: "Venezia", en: "Venezia" },
        place: { fr: "Italie", en: "Italy" },
        intro: {
          fr: "Venise en dehors des heures où on la photographie, tôt, avant que les ponts se remplissent.",
          en: "Venice outside the hours when everyone photographs it, early, before the bridges fill.",
        },
      },
      {
        slug: "burano",
        label: { fr: "Burano", en: "Burano" },
        place: { fr: "Italie", en: "Italy" },
        intro: {
          fr: "Burano et ses façades, une île où la couleur est le sujet et où il faut arriver avant les bateaux.",
          en: "Burano and its façades, an island where colour is the subject and where you have to arrive before the boats.",
        },
      },
      {
        slug: "palermo",
        label: { fr: "Palermo", en: "Palermo" },
        place: { fr: "Italie", en: "Italy" },
        intro: {
          fr: "Palerme au réveil, les marchés avant la foule et le rouge qui traverse le gris des rues.",
          en: "Palermo waking up, the markets before the crowd, and the red that runs through the grey of the streets.",
        },
      },
      // En attente : koln, firenze, cefalu, faro, kawaguchiko, osaka, nara.
      // Osaka et Nara ont leur film dans CITIES mais pas encore assez de
      // photos : un cas s'ouvre sur des images, le film vient après.
      // Napoli, Venezia et Burano n'ont pas de film.
    ],
  },
  // Portraits retiré le 01/09, décision de Sandrine : « on ne garde que ce qui
  // amène du business ». Deux cas, aucun client hôtelier derrière, aucune
  // requête de recherche qui mène ici. Les dossiers d'images restent en place,
  // il suffit de remettre le bloc ci-dessous pour republier la catégorie :
  //
  // {
  //   slug: "portraits",
  //   label: { fr: "Portraits", en: "Portraits" },
  //   cover: "/images/portfolio/portraits/silke-hamers/1.jpg",
  //   cases: [
  //     { slug: "silke-hamers", label: { fr: "Silke Hamers", en: "Silke Hamers" } },
  //     { slug: "studio-nb", label: { fr: "Studio, noir et blanc", en: "Studio, black & white" } },
  //   ],
  // },
  //
  // Ce n'est pas le portrait qui sort du métier : les visages du personnel
  // d'une maison restent dans le reportage de cette maison.
  //
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

// Retrouve le cas auquel un film est rattaché, à partir du chemin du fichier.
// Sert à la page Vidéaste : une vignette de film affiche la ville de son
// adresse, et pointe vers ses photos, au lieu de n'être qu'un titre déduit
// d'un nom de fichier. Un film sans cas (Dao Liège, Van der Valk Sélys)
// renvoie undefined, la vignette se contente alors de son titre.
export function findCaseByFilm(src: string) {
  for (const cat of PHOTO_CATEGORIES) {
    for (const item of cat.cases) {
      const film = item.films?.find((f) => f.src === src);
      if (film) return { cat, item, film };
    }
  }
  return undefined;
}

// ─────────────────────────────────────────────────────────────
// Les projets montrés sur la page d'accueil.
//
// Décision de Sandrine du 01/09, en fin de journée : l'accueil montre
// TOUS les projets, un par tuile. Plus de sélection, plus de tuile
// « Tout le portfolio » : la page d'accueil EST le portfolio.
//
// L'ordre vient de PHOTO_CATEGORIES : les maisons, puis les tables, puis
// les villes. Un cas ajouté dans constants.ts apparaît donc tout seul en
// page d'accueil, sans rien d'autre à toucher.
//
// Un cas dont le dossier d'images est vide n'apparaît pas : c'est
// app/[lang]/page.tsx qui vérifie, avec readCaseCover.
// ─────────────────────────────────────────────────────────────

export function allCases() {
  return PHOTO_CATEGORIES.flatMap((cat) =>
    cat.cases.map((item) => ({
      cat,
      item,
      href: `/photographer/${cat.slug}/${item.slug}`,
    })),
  );
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
  // La porte « Tout le portfolio » est retirée en fin de journée du 01/09 :
  // l'accueil affiche maintenant tous les projets, elle pointait vers une
  // page qui dit la même chose.
  {
    key: "film",
    href: "/filmmaker",
    label: { fr: "Film", en: "Film" },
    // Vue aérienne de Naturel Dorf Schönleitn, image extraite du rush drone du
    // 27/08. Elle remplace une bambouseraie : jolie, mais elle disait "voyage"
    // à un hôtelier venu chercher un film de sa maison.
    //
    // Deux règles apprises à leurs dépens :
    // - le fichier vit dans /images/tiles et surtout pas dans /images/film ni
    //   /videos/city-diary, tous deux listés dans .vercelignore : un fichier
    //   peut être dans git et absent du site ;
    // - nouveau nom plutôt qu'un écrasement de film.jpg. next/image sert les
    //   versions optimisées avec un cache long sur une URL inchangée, donc
    //   remplacer un fichier sous le même nom laisse l'ancienne image en place
    //   dans les navigateurs qui l'ont déjà vue.
    cover: "/images/tiles/film-schonleitn.jpg",
  },
  {
    key: "about",
    // Cette tuile porte le portrait de Sandrine, donc elle mène à sa page.
    // Elle pointait vers l'offre, qui vit maintenant sur /services, présente
    // dans le menu. À propos est passé dans le "+" le 01/09 : la tuile est
    // son chemin visible, et une photo de quelqu'un qui mène à une grille de
    // tarifs était de toute façon une fausse piste.
    href: "/about",
    label: { fr: "À propos", en: "About" },
    cover: "/images/about/hero.jpg",
  },
];
