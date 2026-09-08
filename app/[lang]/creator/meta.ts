import type { Clip, Section } from "./constants";

// ─────────────────────────────────────────────────────────────
// Légendes des téléphones : marque, projet, type de contenu.
//
// Les vidéos sont lues depuis les dossiers (lib/creator-videos.ts) et ne
// portent qu'un nom de fichier. Ce fichier en déduit la marque et le projet,
// et la section donne le type de contenu. La table OVERRIDES corrige ou
// complète un clip précis, clé = "<DOSSIER>/<fichier sans extension>".
// Un clip absent d'ici garde son label d'origine : rien ne casse.
//
// Pré-rempli le 08/09 à partir des noms de fichiers. À corriger par Sandrine.
// ─────────────────────────────────────────────────────────────

type Lang = "fr" | "en";
type Meta = { brand?: string; project?: { fr: string; en: string } | string; kind?: { fr: string; en: string } };

const BRANDS = ["Insta360", "Ricoh", "Pentax", "Kodak", "Nishika", "Telesin", "Tokyo", "Antidote"];

const KIND: Record<Section, { fr: string; en: string }> = {
  gear: { fr: "Test matériel", en: "Gear review" },
  lifestyle: { fr: "Lifestyle", en: "Lifestyle" },
  unboxing: { fr: "Unboxing", en: "Unboxing" },
  talk: { fr: "Face caméra", en: "Talking head" },
};

const OVERRIDES: Record<string, Meta> = {
  "EXPERIENCES/Antidote": { brand: "Antidote", project: { fr: "Sur place", en: "On location" } },
  "EXPERIENCES/Tokyo GR Space": { brand: "Ricoh", project: "GR Space Tokyo", kind: { fr: "Voyage", en: "Travel" } },
  "EXPERIENCES/Tokyo Hairdresser": { brand: "Tokyo", project: { fr: "Chez le coiffeur", en: "At the hairdresser" }, kind: { fr: "Voyage", en: "Travel" } },
  "EXPERIENCES/Tokyo Head Spa": { brand: "Tokyo", project: "Head spa", kind: { fr: "Voyage", en: "Travel" } },
  "EXPERIENCES/Tokyo Tattoo": { brand: "Tokyo", project: { fr: "Salon de tatouage", en: "Tattoo studio" }, kind: { fr: "Voyage", en: "Travel" } },
  "UNBOXING/Kodak Charmera Millennium": { brand: "Kodak", project: "Charmera Millennium" },
  "UNBOXING/Telesin": { brand: "Telesin", project: { fr: "Accessoires", en: "Accessories" } },
};

function keyFor(src: string): string {
  const rel = src.replace(/^\/videos\/creator\//, "").replace(/\.[^./]+$/, "").replace(/['’]+$/, "");
  return rel;
}

function pick(v: { fr: string; en: string } | string | undefined, lang: Lang): string | undefined {
  if (!v) return undefined;
  return typeof v === "string" ? v : v[lang];
}

export function withMeta(clip: Clip, section: Section, lang: Lang): Clip {
  const key = keyFor(clip.src);
  const over = OVERRIDES[key] ?? {};
  const label = clip.label.replace(/['’]+$/, "").trim();
  const brand = over.brand ?? BRANDS.find((b) => label.toLowerCase().startsWith(b.toLowerCase()));
  const derivedProject = brand && label.toLowerCase().startsWith(brand.toLowerCase())
    ? label.slice(brand.length).trim()
    : label;
  const project = pick(over.project, lang) ?? (derivedProject || undefined);
  const kind = pick(over.kind, lang) ?? KIND[section][lang];
  return { ...clip, brand: brand ?? label, project: brand ? project : undefined, kind };
}
