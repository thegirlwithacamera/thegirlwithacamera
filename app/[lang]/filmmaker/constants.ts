// Constantes et types de la page Filmmaker (video diaries).
// Pas de "use client" ici : partage entre code serveur et client.

import type { Clip } from "../creator/constants";

// Categories des video diaries ; chacune a son URL /filmmaker/[categorie],
// partageable directement avec les marques.
export const DIARY_CATS = ["fashion", "lifestyle", "places", "travel", "work"] as const;
export type DiaryCat = (typeof DIARY_CATS)[number];

export type Diary = Record<DiaryCat, Clip[]>;
