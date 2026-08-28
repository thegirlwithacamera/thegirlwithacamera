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
