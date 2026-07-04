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
  /** Total copies across all sizes — fine-art convention, not per-format. */
  editionSize?: number;
}

// Cart/line-item ids are `${productId}-${variantType}` (e.g. "shop-06-a4-print").
// Strips the variant suffix to recover the base product id.
export function getBaseProductId(itemId: string): string {
  return itemId.replace(/-(a5|a4|a3)-print$/, '');
}

// Curated collection — 8 prints selected by Sandrine (2026-07).
// Image ids map to files in public/images/portfolio/ (shop-06 -> shop-6.JPG).

// 'a5-print' is fulfilled as a 6″×8″ poster (Printful has no true A5) —
// keep the internal type stable, the label is what customers see.
// Limited-edition pricing (2026-07): a modest premium over the prior
// open-edition prices, with a further step-up for the scarcer 10-copy
// tier (Fuji, Bookshop) vs the 30-copy tier (the other six prints).
const ALL_SIZES: ProductVariant[] = [
  { type: 'a5-print', label: '15×20 cm Print', price: 3500 },
  { type: 'a4-print', label: 'A4 Print', price: 6900 },
  { type: 'a3-print', label: 'A3 Print', price: 9900 },
];

// Files under ~2300px on the short side can't hold 200 DPI on A3
const UP_TO_A4: ProductVariant[] = [
  { type: 'a5-print', label: '15×20 cm Print', price: 3900 },
  { type: 'a4-print', label: 'A4 Print', price: 7900 },
];

export const SHOP_PRODUCTS: Product[] = [
  {
    id: 'shop-06',
    editionSize: 30,
    name: 'Burano in Two Colours',
    image: '/images/portfolio/shop-6.JPG',
    orientation: 'vertical',
    descriptionEn: 'Blue meets orange on the island of Burano, doubled by the canal below. Colour-block architecture at its purest.',
    descriptionFr: 'Le bleu rencontre l\'orange sur l\'île de Burano, dédoublés par le canal. L\'architecture colorée à l\'état pur.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-09',
    editionSize: 30,
    name: 'Dusk in Kyoto',
    image: '/images/portfolio/shop-9.JPG',
    orientation: 'vertical',
    descriptionEn: 'Paper umbrellas glow above a lantern-lit lane as evening settles over the old town of Kyoto.',
    descriptionFr: 'Des ombrelles de papier s\'illuminent au-dessus d\'une ruelle aux lanternes, tandis que le soir tombe sur le vieux Kyoto.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-10',
    editionSize: 30,
    name: 'The Crossing',
    image: '/images/portfolio/shop-10.JPG',
    orientation: 'vertical',
    descriptionEn: 'Seen from above, a cyclist slips across the white geometry of a Japanese crosswalk, shadow in tow.',
    descriptionFr: 'Vu d\'en haut, un cycliste traverse la géométrie blanche d\'un passage piéton japonais, son ombre à sa suite.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-14',
    editionSize: 30,
    name: 'Laundry Day, Burano',
    image: '/images/portfolio/shop-14.JPG',
    orientation: 'vertical',
    descriptionEn: 'A pink façade, a striped curtain and the day\'s washing strung across it all. Domestic life as a work of art.',
    descriptionFr: 'Une façade rose, un rideau rayé et le linge du jour suspendu en travers. La vie domestique comme œuvre d\'art.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-17',
    editionSize: 30,
    name: 'The Koi Pond',
    image: '/images/portfolio/shop-17.JPG',
    orientation: 'vertical',
    descriptionEn: 'A wooden walkway zigzags over dark water while orange koi drift below. A quiet moment in a Japanese garden.',
    descriptionFr: 'Une passerelle de bois zigzague au-dessus de l\'eau sombre, les carpes orange glissent en dessous. Un moment suspendu dans un jardin japonais.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-19',
    editionSize: 30,
    name: 'Lakeside Riders',
    image: '/images/portfolio/shop-19.JPG',
    orientation: 'vertical',
    descriptionEn: 'Orange bicycles pause along the lake shore, mountains rising across the water. A morning ride in rural Japan.',
    descriptionFr: 'Des vélos orange font halte au bord du lac, les montagnes se dressent de l\'autre côté de l\'eau. Une balade matinale dans le Japon rural.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-21',
    editionSize: 10,
    name: 'The Bookshop',
    image: '/images/portfolio/shop-21.JPG',
    orientation: 'vertical',
    descriptionEn: 'Books stacked to the ceiling, a reader lost between the shelves. A secondhand bookshop where time slows down.',
    descriptionFr: 'Des livres empilés jusqu\'au plafond, une silhouette perdue entre les rayonnages. Une librairie d\'occasion où le temps ralentit.',
    variants: UP_TO_A4,
  },
  {
    id: 'shop-25',
    editionSize: 10,
    name: 'Fuji, Morning',
    image: '/images/portfolio/shop-25.JPG',
    orientation: 'vertical',
    descriptionEn: 'Mount Fuji reflected in the lake at dawn, a lone figure in red watching from the shore.',
    descriptionFr: 'Le mont Fuji se reflète dans le lac à l\'aube, une silhouette en rouge l\'observe depuis la rive.',
    variants: UP_TO_A4,
  },
];

export function getProductById(id: string): Product | undefined {
  return SHOP_PRODUCTS.find(p => p.id === id);
}

export function getMinPrice(): number {
  return Math.min(...SHOP_PRODUCTS.flatMap(p => p.variants.map(v => v.price)));
}
