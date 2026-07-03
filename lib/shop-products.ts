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

// Curated collection — 12 prints, all available in A5 / A4 / A3.
// Image ids map to files in public/images/portfolio/ (shop-01 -> shop-1.JPG).

const ALL_SIZES: ProductVariant[] = [
  { type: 'a5-print', label: 'A5 Print', price: 4000 },
  { type: 'a4-print', label: 'A4 Print', price: 6500 },
  { type: 'a3-print', label: 'A3 Print', price: 8500 },
];

export const SHOP_PRODUCTS: Product[] = [
  {
    id: 'shop-01',
    name: 'La Passeggiata',
    image: '/images/portfolio/shop-1.JPG',
    orientation: 'horizontal',
    descriptionEn: 'A couple strolls arm in arm through the old town — leopard print, orange leather, and the easy elegance of everyday life in southern Italy.',
    descriptionFr: 'Un couple se promène bras dessus bras dessous dans la vieille ville — imprimé léopard, cuir orange, et l\'élégance simple du quotidien dans le sud de l\'Italie.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-03',
    name: 'The Basket Shop',
    image: '/images/portfolio/shop-3.JPG',
    orientation: 'vertical',
    descriptionEn: 'Woven baskets tumble over crates of vegetables in a storefront that hasn\'t changed in decades. Texture, craft and warmth in one frame.',
    descriptionFr: 'Des paniers tressés débordent au-dessus des cagettes de légumes, dans une devanture qui n\'a pas changé depuis des décennies. Texture, artisanat et chaleur dans un seul cadre.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-05',
    name: 'Umbrella Over Florence',
    image: '/images/portfolio/shop-5.JPG',
    orientation: 'vertical',
    descriptionEn: 'A rainbow umbrella against a stormy Florentine sky, the Duomo on the horizon. One spot of colour holding back the grey.',
    descriptionFr: 'Un parapluie arc-en-ciel face au ciel d\'orage de Florence, le Duomo à l\'horizon. Une touche de couleur qui tient tête au gris.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-06',
    name: 'Burano in Two Colours',
    image: '/images/portfolio/shop-6.JPG',
    orientation: 'vertical',
    descriptionEn: 'Blue meets orange on the island of Burano, doubled by the canal below. Colour-block architecture at its purest.',
    descriptionFr: 'Le bleu rencontre l\'orange sur l\'île de Burano, dédoublés par le canal. L\'architecture colorée à l\'état pur.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-09',
    name: 'Dusk in Kyoto',
    image: '/images/portfolio/shop-9.JPG',
    orientation: 'vertical',
    descriptionEn: 'Paper umbrellas glow above a lantern-lit lane as evening settles over the old town of Kyoto.',
    descriptionFr: 'Des ombrelles de papier s\'illuminent au-dessus d\'une ruelle aux lanternes, tandis que le soir tombe sur le vieux Kyoto.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-10',
    name: 'The Crossing',
    image: '/images/portfolio/shop-10.JPG',
    orientation: 'vertical',
    descriptionEn: 'Seen from above, a cyclist slips across the white geometry of a Japanese crosswalk, shadow in tow.',
    descriptionFr: 'Vu d\'en haut, un cycliste traverse la géométrie blanche d\'un passage piéton japonais, son ombre à sa suite.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-11',
    name: 'Rush Hour Lullaby',
    image: '/images/portfolio/shop-11.JPG',
    orientation: 'horizontal',
    descriptionEn: 'Two schoolgirls asleep on a Tokyo train, perfectly mirrored by the carriage doors. A quiet moment inside the world\'s busiest city.',
    descriptionFr: 'Deux écolières endormies dans un train de Tokyo, parfaitement symétriques entre les portes du wagon. Un moment de calme au cœur de la ville la plus animée du monde.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-14',
    name: 'Laundry Day, Burano',
    image: '/images/portfolio/shop-14.JPG',
    orientation: 'vertical',
    descriptionEn: 'A pink façade, a striped curtain and the day\'s washing strung across it all. Domestic life as a work of art.',
    descriptionFr: 'Une façade rose, un rideau rayé et le linge du jour suspendu en travers. La vie domestique comme œuvre d\'art.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-16',
    name: 'The Gondolier',
    image: '/images/portfolio/shop-16.JPG',
    orientation: 'vertical',
    descriptionEn: 'Golden light falls on a Venetian façade as a gondolier glides past, framed by shutters and still water.',
    descriptionFr: 'La lumière dorée tombe sur une façade vénitienne tandis qu\'un gondolier glisse devant, encadré par les volets et l\'eau calme.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-22',
    name: 'Café Leone',
    image: '/images/portfolio/shop-22.JPG',
    orientation: 'horizontal',
    descriptionEn: 'Red awning, empty chairs, a passer-by in motion — a Paris café waiting for the day to begin.',
    descriptionFr: 'Store rouge, chaises vides, une passante en mouvement — un café parisien qui attend que la journée commence.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-24',
    name: 'Orange Backpack',
    image: '/images/portfolio/shop-24.JPG',
    orientation: 'vertical',
    descriptionEn: 'One figure, one splash of orange, and the clean lines of a Tokyo crosswalk. Minimalism found on the street.',
    descriptionFr: 'Une silhouette, une touche d\'orange et les lignes nettes d\'un passage piéton de Tokyo. Le minimalisme trouvé dans la rue.',
    variants: ALL_SIZES,
  },
  {
    id: 'shop-25',
    name: 'Fuji, Morning',
    image: '/images/portfolio/shop-25.JPG',
    orientation: 'vertical',
    descriptionEn: 'Mount Fuji reflected in the lake at dawn, a lone figure in red watching from the shore.',
    descriptionFr: 'Le mont Fuji se reflète dans le lac à l\'aube, une silhouette en rouge l\'observe depuis la rive.',
    variants: ALL_SIZES,
  },
];

export function getProductById(id: string): Product | undefined {
  return SHOP_PRODUCTS.find(p => p.id === id);
}

export function getMinPrice(): number {
  return Math.min(...SHOP_PRODUCTS.flatMap(p => p.variants.map(v => v.price)));
}
