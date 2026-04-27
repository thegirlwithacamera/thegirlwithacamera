// Source of truth for video work.
// Files live under /public/videos/<project>/<file>.mp4 with a matching -poster.jpg

export type Creation = {
  id: string;
  title: { fr: string; en: string };
  client?: string;
  role: { fr: string; en: string };
  year: string;
  description: { fr: string; en: string };
  videoUrl?: string;
  poster?: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: { fr: string; en: string };
  description: { fr: string; en: string };
  items: Creation[];
};

export const projects: Project[] = [
  {
    slug: "city-diary",
    title: "City Diary",
    subtitle: {
      fr: "Série · vidéo verticale",
      en: "Series · vertical video",
    },
    description: {
      fr: "Un regard sur les villes à travers la caméra. Japon : Tokyo, Osaka, Nara, Kyoto. Une ville par épisode, au format Reel.",
      en: "A look at cities through the camera. Japan : Tokyo, Osaka, Nara, Kyoto. One city per episode, in Reel format.",
    },
    items: [
      {
        id: "city-diary-01-tokyo",
        title: { fr: "City Diary EP 01 · Tokyo", en: "City Diary EP 01 · Tokyo" },
        role: { fr: "Concept · tournage · montage", en: "Concept · shoot · edit" },
        year: "2025",
        description: { fr: "", en: "" },
        videoUrl: "/videos/city-diary/01-tokyo.mp4",
        poster: "/videos/city-diary/01-tokyo-poster.jpg",
      },
      {
        id: "city-diary-02-osaka",
        title: { fr: "City Diary EP 02 · Osaka", en: "City Diary EP 02 · Osaka" },
        role: { fr: "Concept · tournage · montage", en: "Concept · shoot · edit" },
        year: "2025",
        description: { fr: "", en: "" },
        videoUrl: "/videos/city-diary/02-osaka.mp4",
        poster: "/videos/city-diary/02-osaka-poster.jpg",
      },
      {
        id: "city-diary-03-tokyo",
        title: { fr: "City Diary EP 03 · Tokyo", en: "City Diary EP 03 · Tokyo" },
        role: { fr: "Concept · tournage · montage", en: "Concept · shoot · edit" },
        year: "2025",
        description: { fr: "", en: "" },
        videoUrl: "/videos/city-diary/03-tokyo.mp4",
        poster: "/videos/city-diary/03-tokyo-poster.jpg",
      },
      {
        id: "city-diary-04-nara",
        title: { fr: "City Diary EP 04 · Nara", en: "City Diary EP 04 · Nara" },
        role: { fr: "Concept · tournage · montage", en: "Concept · shoot · edit" },
        year: "2025",
        description: { fr: "", en: "" },
        videoUrl: "/videos/city-diary/04-nara.mp4",
        poster: "/videos/city-diary/04-nara-poster.jpg",
      },
      {
        id: "city-diary-05-kyoto",
        title: { fr: "City Diary EP 05 · Kyoto", en: "City Diary EP 05 · Kyoto" },
        role: { fr: "Concept · tournage · montage", en: "Concept · shoot · edit" },
        year: "2025",
        description: { fr: "", en: "" },
        videoUrl: "/videos/city-diary/05-kyoto.mp4",
        poster: "/videos/city-diary/05-kyoto-poster.jpg",
      },
    ],
  },
  {
    slug: "life-diary",
    title: "Life Diary",
    subtitle: {
      fr: "Série · vidéo verticale",
      en: "Series · vertical video",
    },
    description: {
      fr: "Carnets de saisons, de moments, de petits bouts de vie filmés au bon endroit, au bon moment.",
      en: "Notes on seasons, moments, small slices of life caught in the right place, at the right time.",
    },
    items: [
      {
        id: "life-diary-01-cherry-blossom",
        title: { fr: "Life Diary EP 01 · Cherry Blossom", en: "Life Diary EP 01 · Cherry Blossom" },
        role: { fr: "Concept · tournage · montage", en: "Concept · shoot · edit" },
        year: "2026",
        description: { fr: "", en: "" },
        videoUrl: "/videos/life-diary/01-cherry-blossom.mp4",
        poster: "/videos/life-diary/01-cherry-blossom-poster.jpg",
      },
    ],
  },
];
