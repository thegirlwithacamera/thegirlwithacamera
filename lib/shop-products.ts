export interface ProductVariant {
  type: 'a5-print' | 'a4-print' | 'a3-print';
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  orientation: 'horizontal' | 'vertical';
  variants: ProductVariant[];
  descriptionEn: string;
  descriptionFr: string;
}

// 27 portfolio images with tiered print options
// A5+A4+A3 (products 1-8): all three sizes available
// A5+A4 (products 9-19): two sizes available
// A5-only (products 20-27): A5 prints only

export const SHOP_PRODUCTS: Product[] = [
  // TIER 1: A5+A4+A3 (Premium - all sizes)
  {
    id: 'shop-01',
    name: 'Geometry in Motion',
    image: '/images/portfolio/shop-1.JPG',
    orientation: 'horizontal',
    descriptionEn: 'Clean lines, bold colors, human presence. A study in composition where every element serves the narrative.',
    descriptionFr: 'Des lignes épurées, des couleurs audacieuses, une présence humaine. Une étude de composition où chaque élément raconte une histoire.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
      { type: 'a3-print', label: 'A3 Print', price: 8500 },
    ],
  },
  {
    id: 'shop-02',
    name: 'Stillness',
    image: '/images/portfolio/shop-2.JPG',
    orientation: 'horizontal',
    descriptionEn: 'In quiet moments, I find truth. This image captures the essence of patience and presence.',
    descriptionFr: 'Dans les moments de silence, je trouve la vérité. Cette image capture l\'essence de la patience et de la présence.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
      { type: 'a3-print', label: 'A3 Print', price: 8500 },
    ],
  },
  {
    id: 'shop-03',
    name: 'Urban Texture',
    image: '/images/portfolio/shop-3.JPG',
    orientation: 'vertical',
    descriptionEn: 'The city speaks through layers. Weathered surfaces, worn details, stories written in time.',
    descriptionFr: 'La ville s\'exprime par couches. Des surfaces usées, des détails patinés, des histoires écrites dans le temps.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
      { type: 'a3-print', label: 'A3 Print', price: 8500 },
    ],
  },
  {
    id: 'shop-04',
    name: 'Contemplation',
    image: '/images/portfolio/shop-4.JPG',
    orientation: 'vertical',
    descriptionEn: 'A moment suspended in time. Introspection captured in light and shadow.',
    descriptionFr: 'Un moment suspendu dans le temps. L\'introspection capturée dans la lumière et l\'ombre.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
      { type: 'a3-print', label: 'A3 Print', price: 8500 },
    ],
  },
  {
    id: 'shop-05',
    name: 'Authentic Light',
    image: '/images/portfolio/shop-5.JPG',
    orientation: 'vertical',
    descriptionEn: 'No filters, no pretense. Just natural light finding its way through the frame.',
    descriptionFr: 'Pas de filtres, pas de prétention. Juste la lumière naturelle qui trouve son chemin dans le cadre.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
      { type: 'a3-print', label: 'A3 Print', price: 8500 },
    ],
  },
  {
    id: 'shop-06',
    name: 'Everyday Poetry',
    image: '/images/portfolio/shop-6.JPG',
    orientation: 'vertical',
    descriptionEn: 'Beauty exists in the mundane. I photograph the extraordinary within ordinary moments.',
    descriptionFr: 'La beauté existe dans le quotidien. Je photographie l\'extraordinaire dans les moments ordinaires.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
      { type: 'a3-print', label: 'A3 Print', price: 8500 },
    ],
  },
  {
    id: 'shop-07',
    name: 'Depth & Emotion',
    image: '/images/portfolio/shop-7.JPG',
    orientation: 'vertical',
    descriptionEn: 'Layered narratives. What we see on the surface only hints at the stories beneath.',
    descriptionFr: 'Des récits en couches. Ce que nous voyons en surface ne suggère que les histoires cachées.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
      { type: 'a3-print', label: 'A3 Print', price: 8500 },
    ],
  },
  {
    id: 'shop-08',
    name: 'Raw Elegance',
    image: '/images/portfolio/shop-8.JPG',
    orientation: 'vertical',
    descriptionEn: 'Refined simplicity. Where minimalism meets emotion, and silence speaks volumes.',
    descriptionFr: 'Simplicité raffinée. Où le minimalisme rencontre l\'émotion, et le silence parle fort.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
      { type: 'a3-print', label: 'A3 Print', price: 8500 },
    ],
  },

  // TIER 2: A5+A4 (Mid-tier - A5 and A4)
  {
    id: 'shop-09',
    name: 'Moment of Grace',
    image: '/images/portfolio/shop-9.JPG',
    orientation: 'vertical',
    descriptionEn: 'Caught between seconds. That fleeting instant where everything aligns perfectly.',
    descriptionFr: 'Pris entre les secondes. Cet instant fugace où tout s\'aligne parfaitement.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
    ],
  },
  {
    id: 'shop-10',
    name: 'Documentary Heart',
    image: '/images/portfolio/shop-10.JPG',
    orientation: 'vertical',
    descriptionEn: 'Real people, real moments. Documentary photography at its core.',
    descriptionFr: 'Des gens vrais, des moments vrais. La photographie documentaire à l\'état pur.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
    ],
  },
  {
    id: 'shop-11',
    name: 'Urban Narrative',
    image: '/images/portfolio/shop-11.JPG',
    orientation: 'horizontal',
    descriptionEn: 'Cities tell stories. Every corner, every facade, every shadow speaks.',
    descriptionFr: 'Les villes racontent des histoires. Chaque coin, chaque façade, chaque ombre parle.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
    ],
  },
  {
    id: 'shop-12',
    name: 'Parallel Worlds',
    image: '/images/portfolio/shop-12.JPG',
    orientation: 'horizontal',
    descriptionEn: 'Contrasts create meaning. Light against dark, presence against absence.',
    descriptionFr: 'Les contrastes créent du sens. La lumière contre l\'obscurité, la présence contre l\'absence.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
    ],
  },
  {
    id: 'shop-13',
    name: 'Whispered Stories',
    image: '/images/portfolio/shop-13.JPG',
    orientation: 'vertical',
    descriptionEn: 'Soft narratives. Not loud, but deeply felt. Subtle truths in muted tones.',
    descriptionFr: 'Récits doux. Pas bruyants, mais profondément ressentis. Vérités subtiles dans des tons étouffés.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
    ],
  },
  {
    id: 'shop-14',
    name: 'Presence & Space',
    image: '/images/portfolio/shop-14.JPG',
    orientation: 'vertical',
    descriptionEn: 'How we occupy space. The relationship between the figure and the void.',
    descriptionFr: 'Comment on occupe l\'espace. La relation entre la figure et le vide.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
    ],
  },
  {
    id: 'shop-15',
    name: 'Archive of Light',
    image: '/images/portfolio/shop-15.JPG',
    orientation: 'vertical',
    descriptionEn: 'Golden hour doesn\'t last long. I chase the light that reveals truth.',
    descriptionFr: 'L\'heure d\'or ne dure pas longtemps. Je chasse la lumière qui révèle la vérité.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
    ],
  },
  {
    id: 'shop-16',
    name: 'Solitude & Connection',
    image: '/images/portfolio/shop-16.JPG',
    orientation: 'vertical',
    descriptionEn: 'Alone yet together. The paradox of human experience captured in a single frame.',
    descriptionFr: 'Seul mais ensemble. Le paradoxe de l\'expérience humaine capturé dans un seul cadre.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
    ],
  },
  {
    id: 'shop-17',
    name: 'Framed Silence',
    image: '/images/portfolio/shop-17.JPG',
    orientation: 'vertical',
    descriptionEn: 'What\'s not said is often the most important. Silence has a language all its own.',
    descriptionFr: 'Ce qui n\'est pas dit est souvent le plus important. Le silence a son propre langage.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
    ],
  },
  {
    id: 'shop-18',
    name: 'Between Moments',
    image: '/images/portfolio/shop-18.JPG',
    orientation: 'vertical',
    descriptionEn: 'The in-between spaces. Where anticipation meets reflection.',
    descriptionFr: 'Les espaces entre-deux. Où l\'anticipation rencontre la réflexion.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
    ],
  },
  {
    id: 'shop-19',
    name: 'Visual Rhythm',
    image: '/images/portfolio/shop-19.JPG',
    orientation: 'vertical',
    descriptionEn: 'Patterns and repetitions. The music of the visual world.',
    descriptionFr: 'Les modèles et les répétitions. La musique du monde visuel.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
      { type: 'a4-print', label: 'A4 Print', price: 6500 },
    ],
  },

  // TIER 3: A5-only (Entry-level - A5 prints only)
  {
    id: 'shop-20',
    name: 'Fragment of Time',
    image: '/images/portfolio/shop-20.JPG',
    orientation: 'vertical',
    descriptionEn: 'A small window into a larger story.',
    descriptionFr: 'Une petite fenêtre sur une plus grande histoire.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
    ],
  },
  {
    id: 'shop-21',
    name: 'Sketched Moment',
    image: '/images/portfolio/shop-21.JPG',
    orientation: 'vertical',
    descriptionEn: 'Quick studies of light and form.',
    descriptionFr: 'Des études rapides de lumière et de forme.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
    ],
  },
  {
    id: 'shop-22',
    name: 'Detail & Nuance',
    image: '/images/portfolio/shop-22.JPG',
    orientation: 'horizontal',
    descriptionEn: 'Sometimes the small things matter most.',
    descriptionFr: 'Parfois, les petites choses comptent le plus.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
    ],
  },
  {
    id: 'shop-23',
    name: 'Study in Softness',
    image: '/images/portfolio/shop-23.JPG',
    orientation: 'vertical',
    descriptionEn: 'Gentle observation of everyday moments.',
    descriptionFr: 'Observation douce des moments quotidiens.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
    ],
  },
  {
    id: 'shop-24',
    name: 'Layered Composition',
    image: '/images/portfolio/shop-24.JPG',
    orientation: 'vertical',
    descriptionEn: 'Building depth through visual layers.',
    descriptionFr: 'Construire de la profondeur par des couches visuelles.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
    ],
  },
  {
    id: 'shop-25',
    name: 'Minimal Truth',
    image: '/images/portfolio/shop-25.JPG',
    orientation: 'vertical',
    descriptionEn: 'Less is more. Purity in simplicity.',
    descriptionFr: 'Moins c\'est plus. La pureté dans la simplicité.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
    ],
  },
  {
    id: 'shop-26',
    name: 'Textured Dreams',
    image: '/images/portfolio/shop-26.JPG',
    orientation: 'vertical',
    descriptionEn: 'Where texture becomes emotion.',
    descriptionFr: 'Où la texture devient émotion.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
    ],
  },
  {
    id: 'shop-27',
    name: 'Quiet Observation',
    image: '/images/portfolio/shop-27.JPG',
    orientation: 'vertical',
    descriptionEn: 'Patient watching of the ordinary.',
    descriptionFr: 'Observation patiente de l\'ordinaire.',
    variants: [
      { type: 'a5-print', label: 'A5 Print', price: 4000 },
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return SHOP_PRODUCTS.find(p => p.id === id);
}

export function getMinPrice(): number {
  return Math.min(...SHOP_PRODUCTS.flatMap(p => p.variants.map(v => v.price)));
}
