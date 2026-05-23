export interface ProductVariant {
  type: 'a4-print' | 'a3-print' | 'a4-frame' | 'a3-frame';
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  variants: ProductVariant[];
  descriptionEn: string;
  descriptionFr: string;
}

// 9 portfolio images with 4 format options each
export const SHOP_PRODUCTS: Product[] = [
  {
    id: 'img-01',
    name: 'Urban Stories',
    image: '/images/portfolio/8.JPG',
    descriptionEn: 'This portrait captures a moment of quiet confidence. Shot in natural light against the urban backdrop, it\'s about the stories we carry in our gaze. That\'s what I photograph - the real, unguarded moments.',
    descriptionFr: 'Ce portrait saisit un moment de confiance tranquille. Photographié en lumière naturelle face au décor urbain, c\'est une histoire gravée dans le regard. C\'est ce que je photographie - les moments vrais, sans filtre.',
    variants: [
      { type: 'a4-print', label: 'Intimate Print A4', price: 6500 },
      { type: 'a3-print', label: 'Statement Print A3', price: 8500 },
      { type: 'a4-frame', label: 'Gallery Frame A4', price: 11000 },
      { type: 'a3-frame', label: 'Gallery Frame A3', price: 12000 },
    ],
  },
  {
    id: 'img-02',
    name: 'Composition',
    image: '/images/portfolio/12.JPG',
    descriptionEn: 'Symmetry and light. This image is about balance - how a single frame can hold silence and emotion at the same time. It\'s my favorite kind of composition.',
    descriptionFr: 'Symétrie et lumière. Cette image parle d\'équilibre - comment un seul cadre peut tenir le silence et l\'émotion ensemble. C\'est mon genre de composition préféré.',
    variants: [
      { type: 'a4-print', label: 'Intimate Print A4', price: 6500 },
      { type: 'a3-print', label: 'Statement Print A3', price: 8500 },
      { type: 'a4-frame', label: 'Gallery Frame A4', price: 11000 },
      { type: 'a3-frame', label: 'Gallery Frame A3', price: 12000 },
    ],
  },
  {
    id: 'img-03',
    name: 'Authentic Frames',
    image: '/images/portfolio/14.JPG',
    descriptionEn: 'Real faces, real light, real stories. No filters, no pretense. Just a person and a camera. This is where I find truth in photography.',
    descriptionFr: 'Des visages vrais, une lumière vraie, des histoires vraies. Pas de filtres, pas de prétention. Juste une personne et un appareil photo. C\'est là que je trouve la vérité en photographie.',
    variants: [
      { type: 'a4-print', label: 'Intimate Print A4', price: 6500 },
      { type: 'a3-print', label: 'Statement Print A3', price: 8500 },
      { type: 'a4-frame', label: 'Gallery Frame A4', price: 11000 },
      { type: 'a3-frame', label: 'Gallery Frame A3', price: 12000 },
    ],
  },
  {
    id: 'img-04',
    name: 'Moments',
    image: '/images/portfolio/2.JPG',
    descriptionEn: 'The in-between moments are my favorite. When someone forgets the camera is there and just... exists. That\'s when the magic happens.',
    descriptionFr: 'Les moments entre-deux sont mes préférés. Quand quelqu\'un oublie que la caméra est là et simplement... existe. C\'est là que la magie opère.',
    variants: [
      { type: 'a4-print', label: 'Intimate Print A4', price: 6500 },
      { type: 'a3-print', label: 'Statement Print A3', price: 8500 },
      { type: 'a4-frame', label: 'Gallery Frame A4', price: 11000 },
      { type: 'a3-frame', label: 'Gallery Frame A3', price: 12000 },
    ],
  },
  {
    id: 'img-05',
    name: 'Light & Shadow',
    image: '/images/portfolio/22.JPG',
    descriptionEn: 'Contrast tells a story. Light and shadow dancing together create depth, mystery, emotion. This is how I see the world - in layers.',
    descriptionFr: 'Le contraste raconte une histoire. La lumière et l\'ombre qui dansent ensemble créent de la profondeur, du mystère, de l\'émotion. C\'est comment je vois le monde - en couches.',
    variants: [
      { type: 'a4-print', label: 'Intimate Print A4', price: 6500 },
      { type: 'a3-print', label: 'Statement Print A3', price: 8500 },
      { type: 'a4-frame', label: 'Gallery Frame A4', price: 11000 },
      { type: 'a3-frame', label: 'Gallery Frame A3', price: 12000 },
    ],
  },
  {
    id: 'img-06',
    name: 'Soul & Light',
    image: '/images/portfolio/28.JPG',
    descriptionEn: 'Some portraits capture a soul. You can feel the presence, the personality, the quiet strength. This is one of those moments.',
    descriptionFr: 'Certains portraits capturent une âme. Tu peux sentir la présence, la personnalité, la force tranquille. C\'est l\'un de ces moments.',
    variants: [
      { type: 'a4-print', label: 'Intimate Print A4', price: 6500 },
      { type: 'a3-print', label: 'Statement Print A3', price: 8500 },
      { type: 'a4-frame', label: 'Gallery Frame A4', price: 11000 },
      { type: 'a3-frame', label: 'Gallery Frame A3', price: 12000 },
    ],
  },
  {
    id: 'img-07',
    name: 'Expression',
    image: '/images/portfolio/32.JPG',
    descriptionEn: 'Expression is everything. A single moment on a face can change how we understand someone completely. That\'s the power I chase.',
    descriptionFr: 'L\'expression est tout. Un seul moment sur un visage peut changer complètement notre compréhension de quelqu\'un. C\'est le pouvoir que je cherche.',
    variants: [
      { type: 'a4-print', label: 'Intimate Print A4', price: 6500 },
      { type: 'a3-print', label: 'Statement Print A3', price: 8500 },
      { type: 'a4-frame', label: 'Gallery Frame A4', price: 11000 },
      { type: 'a3-frame', label: 'Gallery Frame A3', price: 12000 },
    ],
  },
  {
    id: 'img-08',
    name: 'Perspective',
    image: '/images/portfolio/35.JPG',
    descriptionEn: 'Perspective shifts everything. The way we look at the world, at ourselves, at each other. Photography is about finding new perspectives.',
    descriptionFr: 'La perspective change tout. La façon dont nous regardons le monde, nous-mêmes, les uns les autres. La photographie consiste à trouver de nouvelles perspectives.',
    variants: [
      { type: 'a4-print', label: 'Intimate Print A4', price: 6500 },
      { type: 'a3-print', label: 'Statement Print A3', price: 8500 },
      { type: 'a4-frame', label: 'Gallery Frame A4', price: 11000 },
      { type: 'a3-frame', label: 'Gallery Frame A3', price: 12000 },
    ],
  },
  {
    id: 'img-09',
    name: 'Stories Untold',
    image: '/images/portfolio/39.JPG',
    descriptionEn: 'Every person has stories that haven\'t been told. Hidden in their eyes, in their silence, in the way they hold themselves. I photograph those untold stories.',
    descriptionFr: 'Chaque personne a des histoires qui n\'ont pas été racontées. Cachées dans leurs yeux, dans leur silence, dans la façon dont ils se tiennent. Je photographie ces histoires non racontées.',
    variants: [
      { type: 'a4-print', label: 'Intimate Print A4', price: 6500 },
      { type: 'a3-print', label: 'Statement Print A3', price: 8500 },
      { type: 'a4-frame', label: 'Gallery Frame A4', price: 11000 },
      { type: 'a3-frame', label: 'Gallery Frame A3', price: 12000 },
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return SHOP_PRODUCTS.find(p => p.id === id);
}

export function getMinPrice(): number {
  let min = Infinity;
  SHOP_PRODUCTS.forEach(product => {
    product.variants.forEach(variant => {
      if (variant.price < min) min = variant.price;
    });
  });
  return min;
}
