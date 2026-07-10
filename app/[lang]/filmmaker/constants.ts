// Constantes et types de la page Filmmaker (video diaries).
// Pas de "use client" ici : partage entre code serveur et client.

import type { Clip } from "../creator/constants";

// Categories des films ; chacune a son URL /filmmaker/[categorie],
// partageable directement avec les marques. L'ordre ici = l'ordre des onglets.
export const DIARY_CATS = ["places", "cities", "lifestyle", "fashion", "bts"] as const;
export type DiaryCat = (typeof DIARY_CATS)[number];

export type Diary = Record<DiaryCat, Clip[]>;
