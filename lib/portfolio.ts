import fs from "fs";
import path from "path";

// Lecture des photos d'une catégorie du portfolio (au build, côté serveur).
// Les fichiers se rangent dans public/images/portfolio/<slug>/.

const PORTFOLIO_DIR = path.join(process.cwd(), "public", "images", "portfolio");
const IMG_RE = /\.(jpe?g|png|webp|avif)$/i;

export type PortfolioPhoto = { src: string };

// Liste les photos d'une catégorie (triées par nom). Dossier absent ou vide -> [].
export function readCategoryPhotos(slug: string): PortfolioPhoto[] {
  const dir = path.join(PORTFOLIO_DIR, slug);
  let files: string[];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => IMG_RE.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => ({ src: `/images/portfolio/${slug}/${f}` }));
}
