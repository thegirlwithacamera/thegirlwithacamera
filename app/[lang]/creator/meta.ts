import type { Clip, Mode } from "./constants";

// ─────────────────────────────────────────────────────────────
// Légendes des téléphones : marque et projet, plus le métier (influence ou
// UGC) qui décide dans quel mode de la page Social le clip apparaît.
//
// Les vidéos sont lues depuis les dossiers (lib/creator-videos.ts) et ne
// portent qu'un nom de fichier. Ce fichier en déduit la marque et le projet.
// La table OVERRIDES corrige ou complète un clip précis, clé =
// "<DOSSIER>/<fichier sans extension>".
// ─────────────────────────────────────────────────────────────

type Lang = "fr" | "en";
type Meta = { brand?: string; project?: { fr: string; en: string } | string; mode?: Mode | null };

const BRANDS = ["Insta360", "Ricoh", "Pentax", "Kodak", "Nishika", "Telesin", "Godox", "Tokyo", "Antidote"];

// Métier par marque, d'après Sandrine (30/10). Une marque absente d'ici
// n'apparaît pas sur Brands : Kodak n'est pas un client, Nishika n'avait que
// des Talk, retirés le même jour.
const MODE_BY_BRAND: Record<string, Mode> = {
  Ricoh: "ugc",
  Pentax: "ugc",
  Godox: "influence",
  Insta360: "influence",
  Telesin: "influence",
};

const OVERRIDES: Record<string, Meta> = {
  "EXPERIENCES/Antidote": { brand: "Antidote", project: { fr: "Sur place", en: "On location" } },
  // Tokyo : le coiffeur et le head spa restent, en influence. GR Space et le
  // tatouage sortent de Brands (30/10).
  "EXPERIENCES/Tokyo GR Space": { mode: null },
  "EXPERIENCES/Tokyo Tattoo": { mode: null },
  "EXPERIENCES/Tokyo Hairdresser": { brand: "Tokyo", project: { fr: "Chez le coiffeur", en: "At the hairdresser" }, mode: "influence" },
  "EXPERIENCES/Tokyo Head Spa": { brand: "Tokyo", project: "Head spa", mode: "influence" },
  "UNBOXING/Telesin": { brand: "Telesin", project: { fr: "Accessoires", en: "Accessories" } },
};

function keyFor(src: string): string {
  return src.replace(/^\/videos\/creator\//, "").replace(/\.[^./]+$/, "").replace(/['’]+$/, "");
}

function pick(v: { fr: string; en: string } | string | undefined, lang: Lang): string | undefined {
  if (!v) return undefined;
  return typeof v === "string" ? v : v[lang];
}

// Renvoie null pour un clip qui n'a pas sa place sur Brands.
export function withMeta(clip: Clip, lang: Lang): (Clip & { mode: Mode }) | null {
  const over = OVERRIDES[keyFor(clip.src)] ?? {};
  const label = clip.label.replace(/['’]+$/, "").trim();
  const brand = over.brand ?? BRANDS.find((b) => label.toLowerCase().startsWith(b.toLowerCase()));
  const mode = over.mode === undefined ? (brand ? MODE_BY_BRAND[brand] : undefined) : over.mode;
  if (!mode) return null;
  const derivedProject = brand && label.toLowerCase().startsWith(brand.toLowerCase())
    ? label.slice(brand.length).trim()
    : label;
  const project = pick(over.project, lang) ?? (derivedProject || undefined);
  return { ...clip, brand: brand ?? label, project: brand ? project : undefined, kind: undefined, mode };
}
