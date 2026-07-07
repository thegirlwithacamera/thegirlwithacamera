import fs from "fs";
import path from "path";
import CreatorClient, { type Clip, type Diary } from "./CreatorClient";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

// Genere la page en statique au build pour les deux langues.
// Necessaire pour que la lecture des dossiers (fs) se fasse au build,
// pas a la requete (ou public/ n'est pas accessible sur Vercel).
export function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

const CREATOR_DIR = path.join(process.cwd(), "public", "videos", "creator");
const VIDEO_RE = /\.(mp4|mov|webm)$/i;
const POSTER_EXTS = [".jpg", ".jpeg", ".png", ".webp"];

// "product-in-use.mp4" -> "Product In Use"
function toLabel(file: string): string {
  return file
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// "life diary ep 01.mp4" -> "Life Ep 01" (on retire le mot Diary, redondant
// avec l'onglet de categorie)
function diaryLabel(file: string): string {
  return toLabel(file).replace(/\bDiary\b/i, "").replace(/\s+/g, " ").trim();
}

// Categorie d'un video diary, deduite du nom de fichier.
function categoryOf(file: string): keyof Diary {
  const n = file.toLowerCase();
  if (n.includes("photographer")) return "photographer";
  if (n.includes("fashion")) return "fashion";
  if (n.includes("city")) return "city";
  if (n.includes("life")) return "life";
  return "city"; // defaut si le fichier ne suit pas la convention de nommage
}

function posterFor(files: string[], folder: string, videoFile: string): string | undefined {
  const base = videoFile.replace(/\.[^.]+$/, "");
  const poster = POSTER_EXTS.map((ext) => base + ext).find((p) => files.includes(p));
  return poster ? `/videos/creator/${folder}/${poster}` : undefined;
}

// Lit un sous-dossier vertical (GEAR, EXPERIENCES, UNBOXING, TALK).
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

// Clips de secours (Vercel Blob), utilises tant que le dossier
// CINEMATIC est vide. Ce sont des city diaries, ils s'affichent
// donc sous l'onglet City.
const FILM_BASE = "https://3cwvdrhaucmdleep.public.blob.vercel-storage.com/film";
const CITY_FALLBACK: Clip[] = [
  { src: `${FILM_BASE}/citydiary-01-tokyo.mp4`,   label: "Tokyo",       poster: "/videos/city-diary/01-tokyo-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-02-osaka.mp4`,   label: "Osaka",       poster: "/videos/city-diary/02-osaka-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-03-tokyo.mp4`,   label: "Tokyo Night", poster: "/videos/city-diary/03-tokyo-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-04-nara.mp4`,    label: "Nara",        poster: "/videos/city-diary/04-nara-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-05-kyoto.mp4`,   label: "Kyoto",       poster: "/videos/city-diary/05-kyoto-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-06-cefalu.mp4`,  label: "Cefalu" },
  { src: `${FILM_BASE}/citydiary-07-palermo.mp4`, label: "Palermo" },
];

// Lit le dossier CINEMATIC et regroupe par categorie (Life, Photographer,
// City, Fashion) selon le nom des fichiers.
function readDiary(): Diary {
  const dir = path.join(CREATOR_DIR, "CINEMATIC");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    // dossier absent
  }
  const videos = files.filter((f) => VIDEO_RE.test(f)).sort();
  const groups: Diary = { life: [], photographer: [], city: [], fashion: [] };

  for (const f of videos) {
    groups[categoryOf(f)].push({
      src: `/videos/creator/CINEMATIC/${f}`,
      label: diaryLabel(f),
      poster: posterFor(files, "CINEMATIC", f),
    });
  }

  if (videos.length === 0) groups.city = CITY_FALLBACK;
  return groups;
}

export default async function CreatorPage({ params }: Props) {
  const { lang } = await params;

  const data = {
    gear: readFolder("GEAR"),
    experiences: readFolder("EXPERIENCES"),
    unboxing: readFolder("UNBOXING"),
    talk: readFolder("TALK"),
    diary: readDiary(),
  };

  return <CreatorClient lang={lang} data={data} />;
}
