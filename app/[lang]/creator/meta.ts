import type { Category, Clip, Mode } from "./constants";

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
type Meta = { brand?: string; project?: { fr: string; en: string } | string; mode?: Mode | null; cat?: Category; lead?: boolean };

const BRANDS = ["Insta360", "Ricoh", "Pentax", "Kodak", "Nishika", "Telesin", "Godox", "Tokyo", "Antidote", "Candido", "Tilta", "Camera Affair", "Bronkey"];

// Métier par marque, d'après Sandrine (30/10). Une marque absente d'ici
// n'apparaît pas sur Brands : Kodak n'est pas un client, Nishika n'avait que
// des Talk, retirés le même jour.
const MODE_BY_BRAND: Record<string, Mode> = {
  Ricoh: "ugc",
  Pentax: "ugc",
  // Candido (05/11) : trois pellicules tournées au Pentax au Japon, en UGC.
  Candido: "ugc",
  Godox: "influence",
  Insta360: "influence",
  Telesin: "influence",
  // 10/11 : Tilta (filtres pour la Luna Ultra), Camera Affair (location
  // d'appareils Fujifilm, deux vidéos au Japon) et Bronkey (sangle), tous
  // publiés sur le compte de Sandrine.
  Tilta: "influence",
  "Camera Affair": "influence",
  Bronkey: "influence",
};

// Catégorie par marque (09/11). Gear : tout le matériel, appareils photo,
// pellicules, lumière, caméras d'action et accessoires (Tech fusionné dans
// Gear le 10/11, Sandrine).
const CAT_BY_BRAND: Record<string, Category> = {
  Ricoh: "gear",
  Pentax: "gear",
  Candido: "gear",
  Godox: "gear",
  Kodak: "gear",
  Insta360: "gear",
  Telesin: "gear",
  Tilta: "gear",
  "Camera Affair": "gear",
  Bronkey: "gear",
};

// Catégorie par dossier, quand la marque n'en a pas : une vidéo posée dans
// public/videos/creator/EVENTS ou FASHION se range seule.
const CAT_BY_FOLDER: Record<string, Category> = {
  GEAR: "gear",
  FASHION: "fashion",
  EVENTS: "events",
  EXPERIENCES: "lifestyle",
  LIFESTYLE: "lifestyle",
  UNBOXING: "gear",
};

const OVERRIDES: Record<string, Meta> = {
  "EXPERIENCES/Antidote": { brand: "Antidote", project: { fr: "Sur place", en: "On location" } },
  // Tokyo : le coiffeur et le head spa restent, en influence. GR Space et le
  // tatouage sortent de Brands (30/10). Le 10/11, chacun sous son vrai nom,
  // Assort et Liberta Tokyo : deux clients, donc deux téléphones.
  "EXPERIENCES/Tokyo GR Space": { mode: null },
  "EXPERIENCES/Tokyo Tattoo": { mode: null },
  "EXPERIENCES/Tokyo Hairdresser": { brand: "Assort", project: { fr: "Coiffeur, Tokyo", en: "Hair salon, Tokyo" }, mode: "influence" },
  "EXPERIENCES/Tokyo Head Spa": { brand: "Liberta Tokyo", project: "Head spa", mode: "influence" },
  // Godox (10/11) : l'IM30 Pro en haut du tas, avant le C100.
  "GEAR/Godox IM30 Pro": { lead: true },
  // Le C100 est de l'UGC (10/11), l'IM30 Pro reste sur le compte de Sandrine.
  "GEAR/Godox C100": { mode: "ugc" },
  // Ricoh (10/11) : dix vidéos UGC remplacent les deux anciennes. La
  // présentation de l'appareil ouvre le tas.
  "GEAR/Ricoh GR III": { lead: true },
  "GEAR/Candido 200": { project: { fr: "200 · Entre ville et mer", en: "200 · Between city & sea" } },
  "GEAR/Candido 400": { project: { fr: "400 · Tokyo au calme", en: "400 · Quiet Tokyo" } },
  "GEAR/Candido 800": { project: { fr: "800 · Tokyo la nuit", en: "800 · Tokyo nights" } },
  // Pentax 17 (05/11) : quatre pellicules, une intention par film.
  // Le déballage du Pentax 17 est publié sur le compte de Sandrine (10/11) :
  // influence, pas UGC comme le reste de Pentax.
  "UNBOXING/Pentax 17": { mode: "influence" },
  "GEAR/Pentax 17 Dreamy": { project: "17 · Dreamy" },
  "GEAR/Pentax 17 Movement": { project: "17 · Movement" },
  "GEAR/Pentax 17 Slow": { project: "17 · Slow" },
  "GEAR/Pentax 17 Soft": { project: "17 · Soft" },
  "UNBOXING/Telesin": { brand: "Telesin", project: { fr: "Accessoires", en: "Accessories" } },
};

// Retirées de Brands le 10/11 (Sandrine) : le déballage de l'Ace Pro 2 sur
// fond sombre, une des deux Luna Ultra et le Pentax 17 tourné dans la rue
// (le déballage du Pentax 17 reste). Nom exact, apostrophe comprise :
// OVERRIDES ignore l'apostrophe finale et toucherait aussi l'autre version.
// Les fichiers restent en place.
const HIDDEN = new Set([
  "UNBOXING/Insta360 Ace Pro 2",
  "UNBOXING/Insta360 Luna Ultra",
  "GEAR/Pentax 17",
]);

function keyFor(src: string): string {
  return src.replace(/^\/videos\/creator\//, "").replace(/\.[^./]+$/, "").replace(/['’]+$/, "");
}

function pick(v: { fr: string; en: string } | string | undefined, lang: Lang): string | undefined {
  if (!v) return undefined;
  return typeof v === "string" ? v : v[lang];
}

// Renvoie null pour un clip qui n'a pas sa place sur Brands.
export function withMeta(clip: Clip, lang: Lang): (Clip & { mode: Mode; cat: Category; lead?: boolean }) | null {
  if (HIDDEN.has(clip.src.replace(/^\/videos\/creator\//, "").replace(/\.[^./]+$/, ""))) return null;
  const over = OVERRIDES[keyFor(clip.src)] ?? {};
  const label = clip.label.replace(/['’]+$/, "").trim();
  const brand = over.brand ?? BRANDS.find((b) => label.toLowerCase().startsWith(b.toLowerCase()));
  const mode = over.mode === undefined ? (brand ? MODE_BY_BRAND[brand] : undefined) : over.mode;
  if (!mode) return null;
  const derivedProject = brand && label.toLowerCase().startsWith(brand.toLowerCase())
    ? label.slice(brand.length).trim()
    : label;
  const project = pick(over.project, lang) ?? (derivedProject || undefined);
  const folder = keyFor(clip.src).split("/")[0];
  const cat = over.cat ?? (brand ? CAT_BY_BRAND[brand] : undefined) ?? CAT_BY_FOLDER[folder] ?? "lifestyle";
  return { ...clip, brand: brand ?? label, project: brand ? project : undefined, kind: undefined, mode, cat, lead: over.lead };
}
