import fs from "fs";
import path from "path";
import type { Clip } from "@/app/[lang]/creator/constants";
import { isHiddenFilm, byNewest } from "@/app/[lang]/filmmaker/constants";
import type { Diary, DiaryCat } from "@/app/[lang]/filmmaker/constants";

// Lecture des dossiers videos (au build, cote serveur uniquement).
// Partage entre la page /creator (et ses sous-pages) et la page /filmmaker.

const CREATOR_DIR = path.join(process.cwd(), "public", "videos", "creator");
const VIDEO_RE = /\.(mp4|mov|webm)$/i;
const POSTER_EXTS = [".jpg", ".jpeg", ".png", ".webp"];

// Les fichiers video ne sont plus dans le depot : ils pesaient 333 Mo et
// repartaient en copie a chaque deploiement. Ils vivent sur un stockage
// Cloudflare R2, et le depot ne garde que les posters (6 Mo) et un
// manifeste qui decrit l'arborescence du dossier.
//
// Rien ne change dans la maniere de travailler : on pose la video dans le
// bon sous-dossier de public/videos/creator, on lance `npm run videos`,
// et le script l'envoie sur R2 puis met le manifeste a jour.

type Manifest = Record<string, { files: string[]; dirs: string[] }>;

let manifestCache: Manifest | null = null;

function manifest(): Manifest {
  if (manifestCache) return manifestCache;
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "content", "creator-videos.json"), "utf8");
    manifestCache = JSON.parse(raw) as Manifest;
  } catch {
    manifestCache = {};
  }
  return manifestCache;
}

// Contenu d'un sous-dossier de public/videos/creator, d'apres le manifeste.
// Repli sur le disque quand le manifeste ne connait pas le dossier : en
// local les fichiers sont la, et un dossier tout juste cree doit apparaitre
// avant meme d'avoir lance la synchro.
function entriesOf(rel: string): { files: string[]; dirs: string[] } {
  const fromManifest = manifest()[rel];
  const dir = path.join(CREATOR_DIR, rel);
  let onDisk: { files: string[]; dirs: string[] } = { files: [], dirs: [] };
  try {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) onDisk.dirs.push(e.name);
      else onDisk.files.push(e.name);
    }
  } catch {
    onDisk = { files: [], dirs: [] };
  }
  if (!fromManifest) return onDisk;
  // Union des deux : le manifeste fait foi pour les videos parties sur R2,
  // le disque ajoute ce qui vient d'etre pose et pas encore synchronise.
  return {
    files: Array.from(new Set([...fromManifest.files, ...onDisk.files])),
    dirs: Array.from(new Set([...fromManifest.dirs, ...onDisk.dirs])),
  };
}

function hasDir(rel: string): boolean {
  if (manifest()[rel]) return true;
  return fs.existsSync(path.join(CREATOR_DIR, rel));
}

// Chemin public d'une video. Il reste relatif : la traduction en adresse
// complete se fait a l'affichage, dans lib/video-url.ts.
function videoSrc(rel: string): string {
  return `/videos/creator/${rel}`;
}

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
    // Capitalise la 1ere lettre de chaque mot. Fait a la main (pas via
    // regex \b\w) car \b ne reconnait pas les lettres accentuees en JS :
    // "Liège" se retrouvait affiche "LièGe".
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Le nom du fichier est le titre affiche : "Palermo.mp4" -> "Palermo".
// Les prefixes de l'ancienne convention ("City Diary Kyoto" -> "Kyoto")
// sont retires pour ne garder que le lieu ou le concept.
// Un fichier sans vrai titre ("sans nom", "untitled"...) -> aucun label.
function diaryLabel(file: string): string {
  const base = file.replace(/\.[^.]+$/, "").trim();
  if (/^(sans[\s-]*nom|sans[\s-]*titre|untitled|no[\s-]*name)$/i.test(base)) return "";
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
  // Avant les villes : un dossier TRAINS ne doit pas tomber dans "cities".
  // Trajets. Le dossier s'appelle JOURNEYS ; train et rail restent reconnus
  // pour qu'un ancien dossier ne se perde pas.
  if (n.includes("journey") || n.includes("trajet") || n.includes("train") || n.includes("rail")) return "journeys";
  if (n.includes("spa") || n.includes("wellness")) return "spa";
  if (n.includes("hotel") || n.includes("maison") || n.includes("house")) return "hotels";
  if (n.includes("table") || n.includes("restaurant") || n.includes("bar")) return "tables";
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
  const files = entriesOf(folder).files;
  if (files.length === 0) return [];
  return files
    .filter((f) => VIDEO_RE.test(f))
    .sort()
    .map((f) => ({
      src: videoSrc(`${folder}/${f}`),
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

// Plus de clips de secours. Une liste d'anciens montages hebergee sur Vercel
// Blob prenait la main si le dossier CINEMATIC etait vide : un deploiement
// rate aurait remis en ligne des films ecartes. Le site ne montre que ce qui
// est dans le depot ; un dossier vide affiche une categorie vide, ce qui se
// voit et se corrige.

// Videos de la page Filmmaker : un sous-dossier par categorie
// (FASHION, LIFESTYLE, PLACES, TRAVEL, WORK) dans le dossier CINEMATIC
// (ou FILMMAKER si le dossier est renomme un jour). Le nom du fichier
// est le titre affiche : "Palermo.mp4" -> "Palermo".
// Compatibilite : des videos posees en vrac a la racine sont classees
// d'apres le mot-cle dans leur nom de fichier.
export function readDiary(): Diary {
  const groups: Diary = { hotels: [], tables: [], spa: [], cities: [], journeys: [], places: [], lifestyle: [], fashion: [], bts: [] };

  const rootName = ["FILMMAKER", "CINEMATIC"].find((d) => hasDir(d));
  if (!rootName) return groups;

  const rootEntries = entriesOf(rootName);
  const entries = [
    ...rootEntries.dirs.map((name) => ({ name, isDirectory: () => true })),
    ...rootEntries.files.map((name) => ({ name, isDirectory: () => false })),
  ].sort((a, b) => a.name.localeCompare(b.name));

  for (const e of entries) {
    if (e.isDirectory()) {
      // Un dossier par categorie ; les dossiers au nom inconnu sont ignores.
      const cat = matchCat(e.name);
      if (!cat) continue;
      const files = entriesOf(`${rootName}/${e.name}`).files;
      // Du plus recent au plus ancien, pas par ordre alphabetique : la page
      // doit ouvrir sur le dernier travail.
      for (const f of files.filter((f) => VIDEO_RE.test(f) && !isHiddenFilm(f)).sort(byNewest)) {
        groups[cat].push({
          src: videoSrc(`${rootName}/${e.name}/${f}`),
          label: diaryLabel(f),
          poster: posterFor(files, `${rootName}/${e.name}`, f),
        });
      }
    } else if (VIDEO_RE.test(e.name) && !isHiddenFilm(e.name)) {
      // Fichier en vrac (ancienne convention) : categorie via le nom.
      const rootFiles = entries.map((x) => x.name);
      groups[matchCat(e.name) ?? "places"].push({
        src: videoSrc(`${rootName}/${e.name}`),
        label: diaryLabel(e.name),
        poster: posterFor(rootFiles, rootName, e.name),
      });
    }
  }

  return groups;
}

// Poster d'une vidéo désignée par son chemin public ("/videos/creator/...").
// Convention du dossier : l'image porte le nom du fichier vidéo, une des
// extensions de POSTER_EXTS. Rien à déclarer, il suffit de poser le .jpg à
// côté du .mp4. Renvoie undefined si aucune image n'existe : mieux vaut pas
// de poster qu'un poster mort.
export function posterForPath(src: string): string | undefined {
  if (!src.startsWith("/")) return undefined;
  const base = src.replace(/\.[^./]+$/, "");
  for (const ext of POSTER_EXTS) {
    if (fs.existsSync(path.join(process.cwd(), "public", base + ext))) {
      return base + ext;
    }
  }
  return undefined;
}
