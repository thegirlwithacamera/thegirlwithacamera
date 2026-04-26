// Source of truth for video work. Each entry can render either as an Instagram
// embed (instagramId) or as a self-hosted video (videoUrl + poster). Prefer
// videoUrl when you have it — embeds are heavy and rely on Instagram being up.

export type Creation = {
  id: string;
  title: { fr: string; en: string };
  client?: string;
  role: { fr: string; en: string };
  year: string;
  description: { fr: string; en: string };
  instagramId?: string;
  videoUrl?: string;     // mp4/webm self-hosted, OR Mux/Cloudflare Stream
  poster?: string;       // local path under /public for the still
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
      fr: "Série en cours · vidéo verticale",
      en: "Ongoing series · vertical video",
    },
    description: {
      fr: "Un regard sur les villes à travers la caméra. Bruxelles et au-delà — une ville par épisode, au format Reel.",
      en: "A look at cities through the camera. Brussels and beyond — one city per episode, in Reel format.",
    },
    items: [
      { id: "DWOJ3UHowD_", title: { fr: "City Diary #1", en: "City Diary #1" }, role: { fr: "Concept · tournage · montage", en: "Concept · shoot · edit" }, year: "2026", description: { fr: "", en: "" }, instagramId: "DWOJ3UHowD_" },
      { id: "DWgSNrkoCd5", title: { fr: "City Diary #2", en: "City Diary #2" }, role: { fr: "Concept · tournage · montage", en: "Concept · shoot · edit" }, year: "2026", description: { fr: "", en: "" }, instagramId: "DWgSNrkoCd5" },
      { id: "DWx4W3MoGDI", title: { fr: "City Diary #3", en: "City Diary #3" }, role: { fr: "Concept · tournage · montage", en: "Concept · shoot · edit" }, year: "2026", description: { fr: "", en: "" }, instagramId: "DWx4W3MoGDI" },
    ],
  },
  {
    slug: "shot-on",
    title: "Shot on ___",
    subtitle: {
      fr: "Vidéo produit · brand content",
      en: "Product video · brand content",
    },
    description: {
      fr: "Une vidéo d'utilisation, une photo résultat. Le produit vu de l'intérieur — ce qu'il fait, pas ce qu'il prétend.",
      en: "One usage video, one resulting still. The product seen from within — what it does, not what it claims.",
    },
    items: [
      { id: "DUn2--IjF3p", title: { fr: "Shot on Pentax", en: "Shot on Pentax" }, client: "Pentax Europe", role: { fr: "Brand content", en: "Brand content" }, year: "2025", description: { fr: "", en: "" }, instagramId: "DUn2--IjF3p" },
      { id: "DUp4zqDDFa_", title: { fr: "Shot on Ricoh", en: "Shot on Ricoh" }, client: "Ricoh Europe", role: { fr: "Brand content", en: "Brand content" }, year: "2025", description: { fr: "", en: "" }, instagramId: "DUp4zqDDFa_" },
      { id: "DUnhKNkDC4R", title: { fr: "Shot on Ricoh", en: "Shot on Ricoh" }, client: "Ricoh Europe", role: { fr: "Brand content", en: "Brand content" }, year: "2025", description: { fr: "", en: "" }, instagramId: "DUnhKNkDC4R" },
      { id: "DUvghGGjAXo", title: { fr: "Shot on Pentax", en: "Shot on Pentax" }, client: "Pentax Europe", role: { fr: "Brand content", en: "Brand content" }, year: "2025", description: { fr: "", en: "" }, instagramId: "DUvghGGjAXo" },
    ],
  },
];
