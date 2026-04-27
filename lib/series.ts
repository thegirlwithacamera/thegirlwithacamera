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
    slug: "dramatic-bw",
    title: "Dramatic B&W",
    year: "2026",
    cover: "/images/series/dramatic-bw/cover.JPG",
    description: {
      fr: "Ma première série. Des autoportraits en noir et blanc, travaillés dans le contraste et le grain. Un face-à-face avec soi-même, entre ombre et lumière. Chercher ce que la couleur cache, trouver ce que le noir révèle.",
      en: "My first series. Self-portraits in black and white, built on contrast and grain. A face-to-face with oneself, between shadow and light. Seeking what colour conceals, finding what black reveals.",
    },
    photos: [
      "/images/series/dramatic-bw/01.JPG",
      "/images/series/dramatic-bw/02.JPG",
      "/images/series/dramatic-bw/03.JPG",
      "/images/series/dramatic-bw/04.JPG",
      "/images/series/dramatic-bw/05.JPG",
      "/images/series/dramatic-bw/06.JPG",
    ],
  },
  {
    slug: "behind-doors",
    title: "Behind Doors",
    year: "2026",
    cover: "/images/series/behind-doors/cover.JPG",
    description: {
      fr: "Sicile. Depuis le seuil, depuis la rue, depuis l'extérieur. Des gens au travail, pris dans leur intérieur. Derrière les portes ouvertes, la vie continue sans se soucier d'être regardée. Une série sur le dedans vu du dehors.",
      en: "Sicily. From the threshold, from the street, from outside. People at work, caught in their interiors. Behind open doors, life goes on without caring to be seen. A series on the inside as seen from the outside.",
    },
    photos: [
      "/images/series/behind-doors/01.JPG",
      "/images/series/behind-doors/02.JPG",
      "/images/series/behind-doors/03.JPG",
      "/images/series/behind-doors/04.JPG",
      "/images/series/behind-doors/05.JPG",
      "/images/series/behind-doors/06.JPG",
      "/images/series/behind-doors/07.JPG",
      "/images/series/behind-doors/08.JPG",
      "/images/series/behind-doors/09.JPG",
      "/images/series/behind-doors/10.JPG",
      "/images/series/behind-doors/11.JPG",
      "/images/series/behind-doors/12.JPG",
    ],
  },
  {
    slug: "mercato",
    title: "Mercato",
    year: "2026",
    cover: "/images/series/mercato/cover.jpg",
    description: {
      fr: "Les marchés siciliens. Des étals qui débordent, des voix qui s'entremêlent, des mains qui pèsent, qui tendent, qui comptent. Le mercato comme espace de théâtre ordinaire : couleurs criardes, gestes précis, lumière de midi.",
      en: "Sicilian markets. Stalls overflowing, voices intertwining, hands weighing, reaching, counting. The mercato as a stage for the ordinary : vivid colours, precise gestures, midday light.",
    },
    photos: [
      "/images/series/mercato/01.JPG",
      "/images/series/mercato/02.JPG",
      "/images/series/mercato/03.JPG",
      "/images/series/mercato/04.JPG",
      "/images/series/mercato/05.JPG",
      "/images/series/mercato/06.JPG",
      "/images/series/mercato/07.JPG",
      "/images/series/mercato/08.JPG",
      "/images/series/mercato/09.JPG",
    ],
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
    photos: [
      "/images/series/color-hunting/01.JPG",
      "/images/series/color-hunting/02.JPG",
      "/images/series/color-hunting/03.JPG",
      "/images/series/color-hunting/04.JPG",
      "/images/series/color-hunting/05.JPG",
      "/images/series/color-hunting/06.JPG",
      "/images/series/color-hunting/07.JPG",
      "/images/series/color-hunting/08.JPG",
      "/images/series/color-hunting/09.JPG",
      "/images/series/color-hunting/10.JPG",
      "/images/series/color-hunting/11.JPG",
    ],
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
    photos: [
      "/images/series/workers/01.JPG",
      "/images/series/workers/02.JPG",
      "/images/series/workers/03.JPG",
      "/images/series/workers/04.JPG",
      "/images/series/workers/05.JPG",
      "/images/series/workers/06.JPG",
      "/images/series/workers/07.JPG",
      "/images/series/workers/08.JPG",
      "/images/series/workers/09.JPG",
      "/images/series/workers/10.JPG",
      "/images/series/workers/11.JPG",
      "/images/series/workers/1762828619000_R0013321.JPG",
    ],
  },
];

export function getSeriesBySlug(slug: string): Series | undefined {
  return series.find((s) => s.slug === slug);
}

export function getAdjacentSeries(slug: string): { prev: Series | null; next: Series | null } {
  const i = series.findIndex((s) => s.slug === slug);
  if (i === -1) return { prev: null, next: null };
  const prev = i > 0 ? series[i - 1] : series[series.length - 1];
  const next = i < series.length - 1 ? series[i + 1] : series[0];
  return { prev, next };
}
