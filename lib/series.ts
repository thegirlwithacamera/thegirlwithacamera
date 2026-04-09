export interface Series {
  slug: string;
  title: string;
  year: string;
  cover: string;
  description: { fr: string; en: string };
  photos: string[];
}

export const series: Series[] = [
  {
    slug: "mestieri",
    title: "Mestieri",
    year: "2026",
    cover: "/images/series/mestieri/cover.jpg",
    description: {
      fr: "Mestieri, en italien : les métiers. Une série sur les gestes du travail, photographiée en Sicile. Des corps absorbés par la tâche, des mains qui font, des silhouettes que l'on reconnaît de dos. La dignité ordinaire de ceux qui fabriquent, vendent, réparent.",
      en: "Mestieri, Italian for trades, crafts, callings. A series on the gestures of work, photographed in Sicily. Bodies absorbed in the task, hands that make, silhouettes recognised from behind. The ordinary dignity of those who build, sell, repair.",
    },
    photos: [],
  },
  {
    slug: "color-hunting",
    title: "Color Hunting",
    year: "2026",
    cover: "/images/series/color-hunting/cover.jpg",
    description: {
      fr: "Une pratique de l'attention. Trouver la couleur là où personne ne la cherche : un marquage au sol, un volet, une ombre portée. Color Hunting est une collection d'accidents chromatiques prélevés dans la rue, sur pellicule.",
      en: "A practice of attention. Finding colour where no one looks for it: road markings, shutters, cast shadows. Color Hunting is a collection of chromatic accidents lifted from the street, on film.",
    },
    photos: [],
  },
  {
    slug: "workers",
    title: "Workers",
    year: "2025",
    cover: "/images/series/workers/cover.jpg",
    description: {
      fr: "Osaka, Tokyo, Kyoto. Des hommes en costume qui attendent, qui discutent, qui traversent. Le Japon au travail, saisi dans les interstices, entre deux réunions, au bord du trottoir, sous les néons.",
      en: "Osaka, Tokyo, Kyoto. Men in suits who wait, talk, cross the street. Japan at work, caught in the margins, between two meetings, at the kerb, under the neon.",
    },
    photos: [],
  },
];

export function getSeriesBySlug(slug: string): Series | undefined {
  return series.find((s) => s.slug === slug);
}
