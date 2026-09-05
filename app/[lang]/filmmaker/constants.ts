// Constantes et types de la page Filmmaker (video diaries).
// Pas de "use client" ici : partage entre code serveur et client.

import type { Clip } from "../creator/constants";

// Vocabulaire de lecture des dossiers : toutes les catégories que le lecteur
// sait reconnaître. Ne pas y toucher sans adapter matchCat dans
// lib/creator-videos.ts.
export const DIARY_CATS = ["places", "cities", "lifestyle", "fashion", "bts"] as const;
export type DiaryCat = (typeof DIARY_CATS)[number];

// Ce qui est réellement publié, et l'ordre des onglets. Chacune a son URL
// /filmmaker/[categorie], partageable directement.
//
// Quotidien, Coulisses et Mode sont sortis le 28/08 : la page ne montre plus
// que du travail de lieu. Les fichiers restent en place, il suffit de remettre
// la catégorie dans cette liste pour la republier.
export const PUBLISHED_DIARY_CATS: readonly DiaryCat[] = ["places", "cities"];

export type Diary = Record<DiaryCat, Clip[]>;

// Films presents sur le disque mais retires du site. Comparaison sur le nom
// de fichier, sans extension, insensible a la casse.
//
// Coloc Housing, retire le 01/09 avec le cas photo du meme nom : la
// collaboration s'est terminee sur un retrait de licence de Sandrine. Le
// fichier reste en place, rien n'est supprime, c'est la publication qui
// s'arrete. Retirer la ligne republie le film.
export const HIDDEN_FILMS: readonly string[] = [
  // Retire le 01/09 avec le cas photo du meme nom : la collaboration s'est
  // terminee sur un retrait de licence de Sandrine.
  "coloc housing",
  // Films de ville sans page photo derriere, retires le 01/09. Un film qui
  // ne mene nulle part est une impasse : la vignette n'a ni ville ni lien,
  // et le visiteur qui accroche n'a rien a regarder ensuite. Ils reviennent
  // le jour ou Nara et Osaka ont assez d'images pour ouvrir un cas.
  //
  // Dao Liege et Van der Valk Selys sont dans le meme etat mais restent en
  // ligne : leurs photos existent et arrivent, decision de Sandrine.
  "city diary nara",
  "city diary osaka",
  // Retire le 05/09, decision de Sandrine : le film n'est pas au niveau du
  // reste. Le cas photo du meme nom est sorti de constants.ts et le logo de
  // lib/brands.ts. Le fichier reste sur le disque.
  "mk hotel munich",
];

export function isHiddenFilm(file: string): boolean {
  const base = file.replace(/\.[^.]+$/, "").trim().toLowerCase();
  return HIDDEN_FILMS.includes(base);
}
