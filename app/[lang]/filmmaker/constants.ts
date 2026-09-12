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

// Date de chaque film, pour ranger la page du plus recent au plus ancien.
// Comparaison sur le nom de fichier sans extension, insensible a la casse,
// comme HIDDEN_FILMS.
//
// Pourquoi une liste et pas la date du fichier : la date de modification ne
// veut plus rien dire. Les fichiers ont ete reencodes en bloc le 09/09, et
// de toute facon git ne conserve pas les dates, tous les fichiers arrivent
// sur le serveur avec la date du deploiement. La seule date fiable est
// celle qu'on ecrit.
//
// Un film absent de cette liste passe en dernier : mieux vaut le voir en bas
// et s'en apercevoir que le voir en haut par accident.
export const FILM_DATES: Record<string, string> = {
  // Vienne est le tournage le plus recent, Graz juste avant. Les deux sont
  // en septembre 2026 et vivent dans deux categories differentes, donc a
  // l'ecran ils ne se croisent pas ; l'ordre ci dessous dit quand meme la
  // verite, au cas ou une page les montrerait ensemble un jour.
  interrail: "2026-09",
  "altstadt vienna": "2026-09",
  "hotel rathaus": "2026-09",
  graz: "2026-09",
  "naturel dorf schonleitn": "2026-08",
  villach: "2026-08",
  "vandervalk selys": "2026-07",
  "dao liege": "2026-07",
  "city diary tokyo": "2026-03",
  "city diary tokyo night": "2026-03",
  "city diary kyoto": "2026-03",
  "city diary nara": "2026-03",
  "city diary osaka": "2026-03",
  // Ce Pages : la date du tournage n'est pas retrouvee, comme dans le cas
  // photo du meme nom. Le film passe donc en fin de liste.
};

// Cle de recherche d'un fichier : sans extension, sans accent, minuscules.
// Sans le retrait des accents, "Naturel Dorf Schonleitn" et "Cé-Pages" ne
// retrouveraient jamais leur ligne.
function filmKey(file: string): string {
  return file
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .toLowerCase();
}

export function filmDate(file: string): string {
  return FILM_DATES[filmKey(file)] ?? "";
}

// Du plus recent au plus ancien, les films sans date a la fin. A date egale,
// l'ordre de la liste ci dessus fait foi : deux films du meme mois se rangent
// comme ils sont ecrits, ce qui laisse le choix a la main sans inventer des
// jours de tournage qu'on ne connait pas.
const FILM_ORDER = Object.keys(FILM_DATES);

export function byNewest(a: string, b: string): number {
  const da = filmDate(a);
  const db = filmDate(b);
  if (da !== db) {
    if (!da) return 1;
    if (!db) return -1;
    return db.localeCompare(da);
  }
  const ia = FILM_ORDER.indexOf(filmKey(a));
  const ib = FILM_ORDER.indexOf(filmKey(b));
  if (ia !== ib && ia >= 0 && ib >= 0) return ia - ib;
  return a.localeCompare(b);
}

export function isHiddenFilm(file: string): boolean {
  const base = file.replace(/\.[^.]+$/, "").trim().toLowerCase();
  return HIDDEN_FILMS.includes(base);
}
