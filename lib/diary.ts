// ============================================================
//  DIARY, carnet de voyage structure par destination
// ============================================================
//  Le Diary n'est PAS un fil chronologique date. Chaque entree
//  est un VOYAGE (une destination, une serie) avec sa propre
//  page recit : hero, photo essai (texte et photos alternes),
//  puis deux CTA en bas (tirages + newsletter).
//
//  AJOUTER UN VOYAGE :
//  1. Copie un bloc { ... } dans le tableau `trips` ci-dessous.
//  2. Change slug, destination, location, year, cover, intro.
//  3. Ecris l'essai dans `essay` en alternant des blocs
//     { type: "text", content: { fr, en } }
//     { type: "image", src, alt, caption? }
//  4. Mets tes photos dans /public/images/diary/<slug>/ et pointe
//     `cover` et les `src` vers ces fichiers.
//  5. status: "published" pour publier, "soon" pour une carte
//     "bientot" sans page (utile pour teaser une destination).
//
//  REGLE : ne mets pas de copy definitive inventee. Les textes
//  ci-dessous sont des PLACEHOLDERS a remplacer, reperables au
//  prefixe [ ... ].
// ============================================================

export type DiaryBlock =
  | { type: "text"; content: { fr: string; en: string } }
  | { type: "image"; src: string; alt: string; caption?: { fr: string; en: string } };

export interface Trip {
  slug: string;
  destination: string;                 // "Tokyo"
  location: { fr: string; en: string };// "Japon" / "Japan"
  year: string;                        // "2024"
  status: "published" | "soon";
  cover: string;                       // image de la grille + hero
  kicker: string;                      // petite ligne signature en capitales
  intro: { fr: string; en: string };  // chapeau sous le titre du hero
  printsHref: string;                  // lien vers les tirages de cette serie
  essay: DiaryBlock[];                 // texte et photos alternes
}

// ─────────────────────────────────────────────────────────────
//  TES VOYAGES
//  Tokyo est le GABARIT complet a dupliquer.
//  Les images pointent pour l'instant vers des visuels existants
//  (placeholders), remplace-les par tes photos /images/diary/tokyo/.
// ─────────────────────────────────────────────────────────────
export const trips: Trip[] = [
  {
    slug: "tokyo",
    destination: "Tokyo",
    location: { fr: "Japon", en: "Japan" },
    year: "2024",
    status: "published",
    cover: "/videos/city-diary/01-tokyo-poster.jpg",
    kicker: "STREET · DOCUMENTARY · ANALOG",
    intro: {
      fr: "[ Une ou deux phrases d'intro sur ce voyage, l'ambiance, ce que tu cherchais. A remplacer. ]",
      en: "[ One or two intro lines about this trip, the mood, what you were looking for. To replace. ]",
    },
    printsHref: "/shop",
    essay: [
      {
        type: "text",
        content: {
          fr: "[ Premier paragraphe. Pose le decor, comment tu es arrivee, ce que la ville t'a fait au premier regard. A remplacer par ton texte. ]",
          en: "[ First paragraph. Set the scene, how you arrived, what the city did to you at first sight. Replace with your own words. ]",
        },
      },
      {
        type: "image",
        src: "/videos/city-diary/01-tokyo-poster.jpg",
        alt: "Tokyo, placeholder image to replace",
        caption: { fr: "[ Legende de la photo, lieu, moment ]", en: "[ Photo caption, place, moment ]" },
      },
      {
        type: "text",
        content: {
          fr: "[ Deuxieme paragraphe. Une scene precise, une rencontre, un detail. Le texte respire entre les photos. A remplacer. ]",
          en: "[ Second paragraph. A precise scene, an encounter, a detail. The text breathes between the photos. To replace. ]",
        },
      },
      {
        type: "image",
        src: "/videos/city-diary/03-tokyo-poster.jpg",
        alt: "Tokyo by night, placeholder image to replace",
      },
      {
        type: "image",
        src: "/images/portfolio/8.JPG",
        alt: "Placeholder frame to replace with your Tokyo photo",
        caption: { fr: "[ Legende ]", en: "[ Caption ]" },
      },
      {
        type: "text",
        content: {
          fr: "[ Troisieme paragraphe. Ce que tu retiens, ce que la serie raconte au fond. Termine le recit. A remplacer. ]",
          en: "[ Third paragraph. What stays with you, what the series is really about. Close the story. To replace. ]",
        },
      },
      {
        type: "image",
        src: "/images/portfolio/15.JPG",
        alt: "Placeholder frame to replace with your Tokyo photo",
      },
    ],
  },

  // Teaser de destinations a venir (carte "bientot", pas de page).
  {
    slug: "sicile",
    destination: "Sicile",
    location: { fr: "Italie", en: "Italy" },
    year: "2024",
    status: "soon",
    cover: "",
    kicker: "STREET · DOCUMENTARY · ANALOG",
    intro: { fr: "", en: "" },
    printsHref: "/shop",
    essay: [],
  },
  {
    slug: "liege",
    destination: "Liège",
    location: { fr: "Belgique", en: "Belgium" },
    year: "2025",
    status: "soon",
    cover: "",
    kicker: "STREET · DOCUMENTARY · ANALOG",
    intro: { fr: "", en: "" },
    printsHref: "/shop",
    essay: [],
  },
];

export function getPublishedTrips(): Trip[] {
  return trips.filter((t) => t.status === "published");
}

export function getTripBySlug(slug: string): Trip | undefined {
  return trips.find((t) => t.slug === slug);
}
