import { allCases } from "./constants";
import { countCasePhotos, readPhotoRatio, type PortfolioPhoto } from "@/lib/portfolio";

// ─────────────────────────────────────────────────────────────
// Le portfolio se lit comme un livre (28/10, direction "photobook" choisie
// par Sandrine). Chaque projet est un chapitre numéroté, dans l'ordre de
// constants.ts : les maisons, puis les tables, puis les villes. Le sommaire
// (/destinations/all) et les pages de projet comptent ici, pour que le
// numéro soit le même partout.
// ─────────────────────────────────────────────────────────────

export function bookChapters() {
  return allCases()
    .filter((c) => countCasePhotos(c.cat.slug, c.item.slug) > 0)
    .map((c, i) => ({ ...c, no: i + 1 }));
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
