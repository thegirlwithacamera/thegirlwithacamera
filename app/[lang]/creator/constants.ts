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

// Sections du hub creator ; chacune a sa sous-page /creator/[section].
// Les video diaries ont leur propre page : /filmmaker.
export const SECTIONS = ["gear", "lifestyle", "unboxing", "talk"] as const;
export type Section = (typeof SECTIONS)[number];
