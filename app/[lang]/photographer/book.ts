import { allCases } from "./constants";
import { countCasePhotos, readPhotoRatio, type PortfolioPhoto } from "@/lib/portfolio";

// ─────────────────────────────────────────────────────────────
// Les projets en ligne (ceux qui ont des photos), du plus récent au plus
// ancien d'après leur date de tournage (champ date de constants.ts). Sert aux
// pages Hotels & Houses et Destinations, et au précédent / suivant des pages
// de projet. Pas de numéro de projet (28/10, Sandrine) : l'ordre change à
// chaque nouveau projet.
// ─────────────────────────────────────────────────────────────

export function liveProjects() {
  return allCases()
    .filter((c) => countCasePhotos(c.cat.slug, c.item.slug) > 0)
    .sort((a, b) => (b.item.date ?? "").localeCompare(a.item.date ?? ""));
}

export const no2 = (n: number) => String(n).padStart(2, "0");

// Mise en pages d'une suite de photos, comme on monte un livre : une photo
// horizontale prend toute la largeur, les verticales alternent une pleine
// page, une double page, un triptyque, une double page. Rien n'est recadré,
// chaque image garde son format.
export type Plate = PortfolioPhoto & { ratio: number; no: number };
export type Spread = { kind: "bleed" | "solo" | "pair" | "trio"; plates: Plate[] };

const CYCLE: Spread["kind"][] = ["solo", "pair", "trio", "pair"];
const SIZE = { bleed: 1, solo: 1, pair: 2, trio: 3 } as const;

export function layoutSpreads(photos: PortfolioPhoto[]): Spread[] {
  const plates: Plate[] = photos.map((p, i) => ({ ...p, ratio: readPhotoRatio(p.src), no: i + 1 }));
  const out: Spread[] = [];
  let step = 0;
  let i = 0;
  while (i < plates.length) {
    if (plates[i].ratio > 1.1) {
      out.push({ kind: "bleed", plates: [plates[i]] });
      i += 1;
      continue;
    }
    // Les verticales qui se suivent, jusqu'à la prochaine horizontale.
    let run = 0;
    while (i + run < plates.length && plates[i + run].ratio <= 1.1) run += 1;
    let kind = CYCLE[step % CYCLE.length];
    // Pas de rangée incomplète : on prend la forme qui tient dans ce qui reste.
    if (SIZE[kind] > run) kind = run === 1 ? "solo" : run === 2 ? "pair" : "trio";
    out.push({ kind, plates: plates.slice(i, i + SIZE[kind]) });
    i += SIZE[kind];
    step += 1;
  }
  return out;
}
