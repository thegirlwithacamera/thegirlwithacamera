import fs from "fs";
import path from "path";
import CreatorClient, { type Clip } from "./CreatorClient";

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

// Lit un sous-dossier de public/videos/creator/ et renvoie ses clips.
// Un poster est associe si une image porte le meme nom que la video.
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
    .map((f) => {
      const base = f.replace(/\.[^.]+$/, "");
      const poster = POSTER_EXTS.map((ext) => base + ext).find((p) => files.includes(p));
      return {
        src: `/videos/creator/${folder}/${f}`,
        label: toLabel(f),
        poster: poster ? `/videos/creator/${folder}/${poster}` : undefined,
      };
    });
}

// Clips cinematiques de secours (Vercel Blob), utilises tant que le
// dossier CINEMATIQUE est vide. Depose des .mp4 dans ce dossier pour
// les remplacer par tes fichiers locaux.
const FILM_BASE = "https://3cwvdrhaucmdleep.public.blob.vercel-storage.com/film";
const CINEMATIC_FALLBACK: Clip[] = [
  { src: `${FILM_BASE}/citydiary-01-tokyo.mp4`,   label: "Tokyo",       poster: "/videos/city-diary/01-tokyo-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-02-osaka.mp4`,   label: "Osaka",       poster: "/videos/city-diary/02-osaka-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-03-tokyo.mp4`,   label: "Tokyo Night", poster: "/videos/city-diary/03-tokyo-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-04-nara.mp4`,    label: "Nara",        poster: "/videos/city-diary/04-nara-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-05-kyoto.mp4`,   label: "Kyoto",       poster: "/videos/city-diary/05-kyoto-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-06-cefalu.mp4`,  label: "Cefalu" },
  { src: `${FILM_BASE}/citydiary-07-palermo.mp4`, label: "Palermo" },
];

export default async function CreatorPage({ params }: Props) {
  const { lang } = await params;

  const cinematicLocal = readFolder("CINEMATIQUE");

  const data = {
    gear: readFolder("GEAR"),
    experiences: readFolder("EXPERIENCES"),
    unboxing: readFolder("UNBOXING"),
    talk: readFolder("TALK"),
    cinematic: cinematicLocal.length > 0 ? cinematicLocal : CINEMATIC_FALLBACK,
  };

  return <CreatorClient lang={lang} data={data} />;
}
