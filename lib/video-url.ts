// Adresse publique d'une video du portfolio.
//
// Les fichiers video ne sont plus dans le depot : ils pesaient 333 Mo et
// repartaient en copie a chaque deploiement. Ils sont servis depuis un
// stockage Cloudflare R2, via un petit Worker (voir workers/videos).
//
// Partout dans le code les chemins restent ecrits comme avant,
// "/videos/creator/...", pour que les donnees des projets restent lisibles
// et qu'une nouvelle fiche s'ecrive sans rien savoir de tout ca. La
// traduction en adresse complete se fait ici, au moment de l'affichage.
//
// Variable absente : les chemins restent locaux et le site tourne sur les
// fichiers de public/, comme avant. C'est ce qui se passe en developpement.
const BASE = (process.env.NEXT_PUBLIC_VIDEO_BASE_URL ?? "").replace(/\/$/, "");

// Seul le dossier creator est parti sur R2. Les habillages de pages
// (/videos/banners/...) sont legers et restent dans le depot.
const REMOTE_PREFIX = "/videos/creator/";

export function videoUrl(src: string): string {
  if (!BASE) return src;
  if (/^https?:\/\//i.test(src)) return src;
  return src.startsWith(REMOTE_PREFIX) ? BASE + src : src;
}
