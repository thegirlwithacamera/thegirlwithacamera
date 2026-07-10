import fs from "fs";
import path from "path";
import type { Clip } from "@/app/[lang]/creator/constants";
import type { Diary, DiaryCat } from "@/app/[lang]/filmmaker/constants";

// Lecture des dossiers videos (au build, cote serveur uniquement).
// Partage entre la page /creator (et ses sous-pages) et la page /filmmaker.

const CREATOR_DIR = path.join(process.cwd(), "public", "videos", "creator");
const VIDEO_RE = /\.(mp4|mov|webm)$/i;
const POSTER_EXTS = [".jpg", ".jpeg", ".png", ".webp"];

// "product-in-use.mp4" -> "Product In Use"
// Une apostrophe finale sert juste a differencier deux fichiers de meme
// titre dans le dossier (macOS interdit deux noms identiques). On la retire
// du label pour que les deux clips affichent le meme titre.
function toLabel(file: string): string {
  return file
    .replace(/\.[^.]+$/, "")
    .replace(/['’]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Le nom du fichier est le titre affiche : "Palermo.mp4" -> "Palermo".
// Les prefixes de l'ancienne convention ("City Diary Kyoto" -> "Kyoto")
// sont retires pour ne garder que le lieu ou le concept.
function diaryLabel(file: string): string {
  const label = toLabel(file)
    .replace(/^(City|Life|Lifestyle|Photographer|Fashion|Travel|Places|Work)\s+Diary\s*/i, "")
    .replace(/\bDiary\b/i, "")
    .replace(/\s+/g, " ")
    .trim();
  return label || toLabel(file);
}

// Categorie d'apres un nom (de dossier ou de fichier).
// Categories : Places, Cities, Lifestyle, Fashion, BTS.
// Les anciens mots-cles restent compatibles : travel -> Cities,
// life -> Lifestyle, photographer/work -> BTS.
function matchCat(name: string): DiaryCat | null {
  const n = name.toLowerCase();
  // "BEHIND THE SCENE(S)", "BTS", "Photographer", "Work" -> BTS.
  if (n.includes("bts") || n.includes("behind") || n.includes("scene") || n.includes("work") || n.includes("photographer")) return "bts";
  if (n.includes("fashion")) return "fashion";
  if (n.includes("life")) return "lifestyle"; // couvre "lifestyle" aussi
  if (n.includes("cities") || n.includes("city") || n.includes("travel")) return "cities";
  if (n.includes("place")) return "places";
  return null;
}

function posterFor(files: string[], folder: string, videoFile: string): string | undefined {
  const base = videoFile.replace(/\.[^.]+$/, "");
  const poster = POSTER_EXTS.map((ext) => base + ext).find((p) => files.includes(p));
  return poster ? `/videos/creator/${folder}/${poster}` : undefined;
}

// Lit un sous-dossier vertical (GEAR, LIFESTYLE, UNBOXING, TALK).
function readFolder(folder: string): Clip[] {
  const dir = path.join(CREATOR_DIR, folder);
  let files: string[];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => VIDEO_RE.test(f))
    .sort()
    .map((f) => ({
      src: `/videos/creator/${folder}/${f}`,
      label: toLabel(f),
      poster: posterFor(files, folder, f),
    }));
}

export function readCreatorData() {
  return {
    gear: readFolder("GEAR"),
    // La section s'appelle Lifestyle ; les videos vivent encore dans le
    // dossier EXPERIENCES. Si le dossier est renomme LIFESTYLE un jour,
    // il sera lu en priorite.
    lifestyle: (() => {
      const renamed = readFolder("LIFESTYLE");
      return renamed.length > 0 ? renamed : readFolder("EXPERIENCES");
    })(),
    unboxing: readFolder("UNBOXING"),
    talk: readFolder("TALK"),
  };
}

// Clips de secours (Vercel Blob), utilises tant que le dossier
// CINEMATIC est vide. Ce sont des city diaries, ils s'affichent
// donc sous l'onglet Places.
const FILM_BASE = "https://3cwvdrhaucmdleep.public.blob.vercel-storage.com/film";
const PLACES_FALLBACK: Clip[] = [
  { src: `${FILM_BASE}/citydiary-01-tokyo.mp4`,   label: "Tokyo",       poster: "/videos/city-diary/01-tokyo-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-02-osaka.mp4`,   label: "Osaka",       poster: "/videos/city-diary/02-osaka-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-03-tokyo.mp4`,   label: "Tokyo Night", poster: "/videos/city-diary/03-tokyo-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-04-nara.mp4`,    label: "Nara",        poster: "/videos/city-diary/04-nara-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-05-kyoto.mp4`,   label: "Kyoto",       poster: "/videos/city-diary/05-kyoto-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-06-cefalu.mp4`,  label: "Cefalu" },
  { src: `${FILM_BASE}/citydiary-07-palermo.mp4`, label: "Palermo" },
];

// Videos de la page Filmmaker : un sous-dossier par categorie
// (FASHION, LIFESTYLE, PLACES, TRAVEL, WORK) dans le dossier CINEMATIC
// (ou FILMMAKER si le dossier est renomme un jour). Le nom du fichier
// est le titre affiche : "Palermo.mp4" -> "Palermo".
// Compatibilite : des videos posees en vrac a la racine sont classees
// d'apres le mot-cle dans leur nom de fichier.
export function readDiary(): Diary {
  const groups: Diary = { places: [], cities: [], lifestyle: [], fashion: [], bts: [] };

  const root = ["FILMMAKER", "CINEMATIC"]
    .map((d) => path.join(CREATOR_DIR, d))
    .find((p) => fs.existsSync(p));
  if (!root) {
    groups.places = PLACES_FALLBACK;
    return groups;
  }
  const rootName = path.basename(root);

  let total = 0;
  const entries = fs.readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

  for (const e of entries) {
    if (e.isDirectory()) {
      // Un dossier par categorie ; les dossiers au nom inconnu sont ignores.
      const cat = matchCat(e.name);
      if (!cat) continue;
      const files = fs.readdirSync(path.join(root, e.name));
      for (const f of files.filter((f) => VIDEO_RE.test(f)).sort()) {
        groups[cat].push({
          src: `/videos/creator/${rootName}/${e.name}/${f}`,
          label: diaryLabel(f),
          poster: posterFor(files, `${rootName}/${e.name}`, f),
        });
        total++;
      }
    } else if (VIDEO_RE.test(e.name)) {
      // Fichier en vrac (ancienne convention) : categorie via le nom.
      const rootFiles = entries.map((x) => x.name);
      groups[matchCat(e.name) ?? "places"].push({
        src: `/videos/creator/${rootName}/${e.name}`,
        label: diaryLabel(e.name),
        poster: posterFor(rootFiles, rootName, e.name),
      });
      total++;
    }
  }

  if (total === 0) groups.places = PLACES_FALLBACK;
  return groups;
}
