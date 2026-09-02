import fs from "fs";
import path from "path";

// Lecture des photos du portfolio (au build, côté serveur).
//
// Arborescence : public/images/portfolio/<catégorie>/<cas>/1.jpg, 2.jpg, ...
// Le fichier 1 sert de couverture au cas. Les dossiers commençant par _
// (_en-attente, _hors-grille) ne sont jamais lus.
//
// Arborescence à chapitres, ajoutée le 01/09 pour Altstadt Vienna :
//
//   public/images/portfolio/hospitality/altstadt-vienna/
//     01-suite-du-toit/1.jpg 2.jpg ...
//     02-chambre-bibliotheque/1.jpg ...
//
// Un sous-dossier par chapitre, numéroté pour l'ordre. La page enchaîne les
// chapitres avec leur nom au dessus. Sept chambres d'un même hôtel tiennent
// ainsi dans une seule page et une seule tuile d'accueil, au lieu de sept cas
// qui feraient lire à un directeur d'hôtel qu'elle a beaucoup photographié un
// hôtel, plutôt qu'elle photographie des hôtels.
//
// Les deux arborescences coexistent : un cas sans sous-dossier se comporte
// exactement comme avant.

const PORTFOLIO_DIR = path.join(process.cwd(), "public", "images", "portfolio");
const IMG_RE = /\.(jpe?g|png|webp|avif)$/i;

export type PortfolioPhoto = { src: string };
export type PortfolioChapter = {
  slug: string;
  photos: PortfolioPhoto[];
  // Rapport largeur sur hauteur de la premiere image du chapitre. La grille
  // s'y accorde, ce qui evite de recadrer. Sans ca, les 266 photos d'Altstadt,
  // toutes en 3:2 paysage, tombaient dans une cellule 1066x1600 portrait en
  // object-fit cover : la moitie de la largeur partait au recadrage et la
  // composition avec.
  ratio: number;
};

// Dimensions d'un JPEG lues dans son entete, sans decoder l'image. Quelques
// lignes valent mieux qu'une dependance ici : la fonction tourne au build,
// une fois par chapitre.
function jpegSize(file: string): { w: number; h: number } | null {
  let fd: number;
  try {
    fd = fs.openSync(file, "r");
  } catch {
    return null;
  }
  try {
    const buf = Buffer.alloc(131072);
    const read = fs.readSync(fd, buf, 0, buf.length, 0);
    if (read < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
    let i = 2;
    while (i < read - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      // SOF0 a SOF15, en sautant DHT (c4), DAC (cc) et RSTn (d0-d7).
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xcc) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
    return null;
  } catch {
    return null;
  } finally {
    fs.closeSync(fd);
  }
}

function listImages(dir: string): string[] {
  let files: string[];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => IMG_RE.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function listChapterDirs(dir: string): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("_") && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

// Chapitres d'un cas. Tableau vide si le cas n'en a pas.
export function readCaseChapters(category: string, caseSlug: string): PortfolioChapter[] {
  const base = path.join(PORTFOLIO_DIR, category, caseSlug);
  return listChapterDirs(base)
    .map((name) => {
      const files = listImages(path.join(base, name));
      const first = files[0] ? jpegSize(path.join(base, name, files[0])) : null;
      return {
        slug: name,
        photos: files.map((f) => ({
          src: `/images/portfolio/${category}/${caseSlug}/${name}/${f}`,
        })),
        // 1066/1600, le portrait du reste du site, quand la lecture echoue.
        ratio: first && first.h > 0 ? first.w / first.h : 1066 / 1600,
      };
    })
    .filter((c) => c.photos.length > 0);
}

// Photos d'un cas, dans l'ordre des numéros de fichier. Un cas à chapitres
// renvoie ses images aplaties, dans l'ordre des chapitres : le sitemap images
// et les compteurs n'ont pas à connaître la structure.
export function readCasePhotos(category: string, caseSlug: string): PortfolioPhoto[] {
  const dir = path.join(PORTFOLIO_DIR, category, caseSlug);
  const flat = listImages(dir).map((f) => ({
    src: `/images/portfolio/${category}/${caseSlug}/${f}`,
  }));
  if (flat.length > 0) return flat;
  return readCaseChapters(category, caseSlug).flatMap((c) => c.photos);
}

// Couverture d'un cas : sa première image, chapitres compris. null si vide.
export function readCaseCover(category: string, caseSlug: string): string | null {
  return readCasePhotos(category, caseSlug)[0]?.src ?? null;
}

// Nombre d'images d'un cas, chapitres compris.
export function countCasePhotos(category: string, caseSlug: string): number {
  return readCasePhotos(category, caseSlug).length;
}

// Cas dont le dossier d'images n'est pas vide, sous la forme
// "categorie/cas". Sert a la page Videaste : une vignette de film ne propose
// "Photos" que si la page du lieu existe reellement. Sans ce garde-fou, un
// cas declare dans constants.ts avant l'arrivee des photos donnait un lien
// vers une page en 404. C'est arrive avec Van der Valk Selys, declare le
// 01/09 au soir avec ses deux films alors que les photos du restaurant
// n'etaient pas encore montees.
export function casesWithPhotos(
  cases: { category: string; slug: string }[],
): string[] {
  return cases
    .filter((c) => countCasePhotos(c.category, c.slug) > 0)
    .map((c) => `${c.category}/${c.slug}`);
}
