// Synchronise les videos du portfolio vers Cloudflare R2.
//
// Pourquoi : les fichiers video pesaient 333 Mo dans le depot et repartaient
// en copie entiere a chaque deploiement Vercel, ce qui a fait exploser le
// stockage. Ils vivent maintenant sur R2. Le depot ne garde que les posters
// et le manifeste ci-dessous.
//
// Usage : poser la video dans le bon sous-dossier de public/videos/creator,
// puis `npm run videos`. Le script envoie ce qui manque sur R2, reecrit
// content/creator-videos.json, et c'est ce fichier qu'il faut committer.
//
// Identifiants attendus dans .env.local (jamais dans le depot) :
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET

import fs from "node:fs";
import path from "node:path";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const ROOT = process.cwd();
const CREATOR_DIR = path.join(ROOT, "public", "videos", "creator");
const MANIFEST = path.join(ROOT, "content", "creator-videos.json");
const VIDEO_RE = /\.(mp4|mov|webm)$/i;
const TYPES = { ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm" };

// Lecture simple de .env.local : pas de dependance pour trois lignes.
function loadEnv() {
  const f = path.join(ROOT, ".env.local");
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

// Arborescence de public/videos/creator, sous la forme que lit le site.
function walk(rel, out) {
  const dir = path.join(CREATOR_DIR, rel);
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  const dirs = [];
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    if (e.isDirectory()) dirs.push(e.name);
    else files.push(e.name);
  }
  out[rel] = { files: files.sort(), dirs: dirs.sort() };
  for (const d of dirs) walk(rel ? `${rel}/${d}` : d, out);
  return out;
}

async function main() {
  loadEnv();
  // --manifest-only : reecrit juste le manifeste, sans rien envoyer. Utile
  // pour verifier le site en local sans toucher au stockage.
  const manifestOnly = process.argv.includes("--manifest-only");

  if (manifestOnly) {
    const tree = walk("", {});
    fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
    fs.writeFileSync(MANIFEST, JSON.stringify(tree, null, 2) + "\n");
    const n = Object.values(tree).flatMap((d) => d.files).filter((f) => VIDEO_RE.test(f)).length;
    console.log(`Manifeste seul : ${n} videos, ${Object.keys(tree).length} dossiers.`);
    return;
  }

  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
  const missing = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"]
    .filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Identifiants manquants dans .env.local : ${missing.join(", ")}`);
    process.exit(1);
  }
  if (!fs.existsSync(CREATOR_DIR)) {
    console.error(`Dossier introuvable : ${CREATOR_DIR}`);
    process.exit(1);
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    // R2 n'accepte pas les sommes de controle que le SDK d'Amazon ajoute
    // d'office aux envois. Sans ca, la connexion casse en plein transfert.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

  const tree = walk("", {});
  const videos = [];
  for (const [rel, { files }] of Object.entries(tree)) {
    for (const f of files) {
      if (VIDEO_RE.test(f)) videos.push(rel ? `${rel}/${f}` : f);
    }
  }
  console.log(`${videos.length} videos dans le dossier.`);

  let sent = 0;
  let skipped = 0;
  let sentBytes = 0;

  // Envoi par petits paquets : R2 encaisse largement, inutile d'inonder.
  const BATCH = 4;
  for (let i = 0; i < videos.length; i += BATCH) {
    await Promise.all(videos.slice(i, i + BATCH).map(async (relFile) => {
      const key = `videos/creator/${relFile}`;
      const full = path.join(CREATOR_DIR, relFile);
      const size = fs.statSync(full).size;
      try {
        const head = await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
        if (head.ContentLength === size) {
          skipped++;
          return;
        }
      } catch {
        // absent : on envoie
      }
      // Fichier lu en memoire plutot qu'en flux : le plus gros fait 25 Mo,
      // et un flux deja consomme ne peut pas etre rejoue si l'envoi echoue.
      await s3.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: fs.readFileSync(full),
        ContentLength: size,
        ContentType: TYPES[path.extname(relFile).toLowerCase()] ?? "application/octet-stream",
        CacheControl: "public, max-age=31536000, immutable",
      }));
      sent++;
      sentBytes += size;
      console.log(`  envoye  ${relFile}  (${(size / 1048576).toFixed(1)} Mo)`);
    }));
  }

  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(tree, null, 2) + "\n");

  console.log(`\n${sent} envoyees (${(sentBytes / 1048576).toFixed(0)} Mo), ${skipped} deja en ligne.`);
  console.log(`Manifeste ecrit : ${path.relative(ROOT, MANIFEST)}`);
  console.log("Pense a committer le manifeste.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
