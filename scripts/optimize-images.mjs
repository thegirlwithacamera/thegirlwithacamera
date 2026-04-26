#!/usr/bin/env node
/**
 * Compress and resize JPGs in /public/images so they load fast on mobile.
 *
 * Usage:
 *   npm i -D sharp
 *   node scripts/optimize-images.mjs
 *
 * Originals are saved to /public/images/_originals/<same path> the first time
 * they are processed, so you can re-run safely. Outputs replace the source
 * file at the same path, downscaled to 1800px on the long edge at quality 82.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd(), "public", "images");
const BACKUP = path.join(ROOT, "_originals");
const MAX_LONG_EDGE = 1800;
const QUALITY = 82;

const EXTS = new Set([".jpg", ".jpeg", ".JPG", ".JPEG"]);

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "_originals") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTS.has(path.extname(entry.name))) yield full;
  }
}

async function ensureBackup(srcRel) {
  const target = path.join(BACKUP, srcRel);
  try {
    await fs.access(target);
    return false; // already backed up
  } catch {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(ROOT, srcRel), target);
    return true;
  }
}

async function processOne(absPath) {
  const rel = path.relative(ROOT, absPath);
  const stat = await fs.stat(absPath);
  const sizeKB = Math.round(stat.size / 1024);
  if (sizeKB < 350) {
    console.log(`skip  ${rel} (${sizeKB} KB, already small)`);
    return;
  }
  await ensureBackup(rel);
  const buf = await sharp(absPath, { failOn: "none" })
    .rotate()
    .resize({ width: MAX_LONG_EDGE, height: MAX_LONG_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  await fs.writeFile(absPath, buf);
  const newKB = Math.round(buf.length / 1024);
  console.log(`done  ${rel}  ${sizeKB} → ${newKB} KB`);
}

async function main() {
  console.log(`Optimizing JPGs under ${ROOT}…`);
  let count = 0;
  for await (const f of walk(ROOT)) {
    try {
      await processOne(f);
      count++;
    } catch (err) {
      console.error(`fail  ${f}:`, err?.message ?? err);
    }
  }
  console.log(`\n${count} files processed. Originals backed up to ${BACKUP}.`);
}

main();
