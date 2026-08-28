import crypto from "crypto";
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

// ─────────────────────────────────────────────────────────────
// Empreinte de contenu ajoutée à chaque URL d'image : ?v=xxxxxxxx
//
// Pourquoi. Vercel met en cache les images optimisées avec l'URL source comme
// clé, et ce cache ne se vide pas au déploiement. Le 28/08, une photo
// retouchée et réexportée sous le même nom (coloc 1.jpg) est restée invisible
// en ligne : le fichier était bien déployé, le CDN servait toujours l'ancienne
// version optimisée. Rien dans le build ne le signale.
//
// Comment. On hache la taille du fichier et ses 64 premiers Ko. L'empreinte
// change quand l'image change, et seulement là : une image inchangée garde son
// URL, donc son cache et son quota de transformations. Un mtime aurait changé
// à chaque clone en CI et fait retransformer tout le portfolio à chaque
// déploiement.
// ─────────────────────────────────────────────────────────────
const HASH_BYTES = 64 * 1024;

function contentTag(file: string): string {
  try {
    const { size } = fs.statSync(file);
    const fd = fs.openSync(file, "r");
    const buf = Buffer.alloc(Math.min(HASH_BYTES, size));
    fs.readSync(fd, buf, 0, buf.length, 0);
    fs.closeSync(fd);
    return crypto.createHash("md5").update(String(size)).update(buf).digest("hex").slice(0, 8);
  } catch {
    return "";
  }
}

// Même empreinte, pour un chemin public écrit à la main (les couvertures
// déclarées dans constants.ts, les tuiles d'accueil).
export function withContentTag(publicPath: string): string {
  const clean = publicPath.split("?")[0];
  const tag = contentTag(path.join(process.cwd(), "public", clean));
  return tag ? `${clean}?v=${tag}` : clean;
}

function publicSrc(dir: string, category: string, caseSlug: string, file: string): string {
  const url = `/images/portfolio/${category}/${caseSlug}/${file}`;
  const tag = contentTag(path.join(dir, file));
  return tag ? `${url}?v=${tag}` : url;
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

// Photos d'un cas, dans l'ordre des numéros de fichier.
export function readCasePhotos(category: string, caseSlug: string): PortfolioPhoto[] {
  const dir = path.join(PORTFOLIO_DIR, category, caseSlug);
  return listImages(dir).map((f) => ({ src: publicSrc(dir, category, caseSlug, f) }));
}

// Couverture d'un cas : sa première image. null si le dossier est vide.
export function readCaseCover(category: string, caseSlug: string): string | null {
  const dir = path.join(PORTFOLIO_DIR, category, caseSlug);
  const first = listImages(dir)[0];
  return first ? publicSrc(dir, category, caseSlug, first) : null;
}

// Nombre d'images d'un cas.
export function countCasePhotos(category: string, caseSlug: string): number {
  return listImages(path.join(PORTFOLIO_DIR, category, caseSlug)).length;
}
