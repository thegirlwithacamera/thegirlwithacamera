import fs from "fs";
import path from "path";

// Lecture des photos du portfolio (au build, côté serveur).
//
// Arborescence : public/images/portfolio/<catégorie>/<cas>/1.jpg, 2.jpg, ...
// Le fichier 1 sert de couverture au cas. Les dossiers commençant par _
// (_en-attente, _hors-grille) ne sont jamais lus.

const PORTFOLIO_DIR = path.join(process.cwd(), "public", "images", "portfolio");
const IMG_RE = /\.(jpe?g|png|webp|avif)$/i;

export type PortfolioPhoto = { src: string };

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

// Photos d'un cas, dans l'ordre des numéros de fichier.
export function readCasePhotos(category: string, caseSlug: string): PortfolioPhoto[] {
  const dir = path.join(PORTFOLIO_DIR, category, caseSlug);
  return listImages(dir).map((f) => ({
    src: `/images/portfolio/${category}/${caseSlug}/${f}`,
  }));
}

// Couverture d'un cas : sa première image. null si le dossier est vide.
export function readCaseCover(category: string, caseSlug: string): string | null {
  const first = listImages(path.join(PORTFOLIO_DIR, category, caseSlug))[0];
  return first ? `/images/portfolio/${category}/${caseSlug}/${first}` : null;
}

// Nombre d'images d'un cas.
export function countCasePhotos(category: string, caseSlug: string): number {
  return listImages(path.join(PORTFOLIO_DIR, category, caseSlug)).length;
}
