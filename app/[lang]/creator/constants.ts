// Constantes et types partages entre le code serveur (pages, data) et les
// composants clients. Pas de "use client" ici : un module client ne peut pas
// exporter de constantes vers du code serveur.

// brand, project et kind sont optionnels : ils viennent de creator/meta.ts
// et servent à la légende sous chaque téléphone. Un clip sans eux affiche
// son label comme avant.
export type Clip = {
  src: string;
  label: string;
  poster?: string;
  brand?: string;
  project?: string;
  kind?: string;
};

// Brands en deux pages (30/10, Sandrine) : les films de marque, horizontaux
// et cinématiques, et les verticales pour les réseaux. Chacune a son URL
// /creator/[section] ; /creator n'est plus que la couverture et deux portes.
export const SECTIONS = ["films", "social"] as const;
export type Section = (typeof SECTIONS)[number];

// Les verticales servent deux métiers : l'influence (publiée sur les comptes
// de Sandrine) et l'UGC (tournée pour la marque, livrée pour ses comptes ou
// ses publicités). Même écriture, pas la même diffusion.
export type Mode = "influence" | "ugc";
export type SocialClip = Clip & { mode: Mode };

// Films de marque, du plus récent au plus ancien. Un film sans src est
// annoncé (« In production ») : sa place est prête, il suffit d'ajouter le
// chemin de la vidéo et de son affiche le jour où il arrive.
export type BrandFilm = {
  slug: string;
  client: string;
  title?: string;
  year: number;
  src?: string;
  poster?: string;
  role?: string;
};

export const BRAND_FILMS: readonly BrandFilm[] = [
  // Livraison attendue la semaine du 02/11.
  // Edifier retiré le 30/10 (Sandrine) : Patam seul, en production.
  { slug: "patam", client: "Patam", year: 2026 },
];
