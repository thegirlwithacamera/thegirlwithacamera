// Constantes et types partages entre le code serveur (pages, data) et les
// composants clients. Pas de "use client" ici : un module client ne peut pas
// exporter de constantes vers du code serveur.

export type Clip = { src: string; label: string; poster?: string };

// Sections du hub creator ; chacune a sa sous-page /creator/[section].
// Les video diaries ont leur propre page : /filmmaker.
export const SECTIONS = ["gear", "lifestyle", "unboxing", "talk"] as const;
export type Section = (typeof SECTIONS)[number];
