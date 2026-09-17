import fs from "fs";
import path from "path";

// ─────────────────────────────────────────────────────────────
// Journal, écrit directement sur le site depuis le 16/09 (Substack est
// abandonné). Un article = un fichier .md dans content/journal, voir le
// README du dossier. Pas de CMS ni de dépendance : les pages sont générées au
// build, comme le reste du site.
//
// Le rendu Markdown est volontairement court : paragraphes, titres ## et ###,
// images, liens, gras, italique, citations et listes simples. C'est ce qu'il
// faut pour un récit de voyage, et tout est échappé avant d'être mis en HTML.
// ─────────────────────────────────────────────────────────────

const DIR = path.join(process.cwd(), "content", "journal");

export type JournalSection = "travel" | "creator" | "photographer";
export const JOURNAL_SECTIONS: { key: JournalSection; label: string }[] = [
  { key: "travel", label: "Travel" },
  { key: "creator", label: "Creator" },
  { key: "photographer", label: "Photographer" },
];
// Catégories du journal : destinations dans Travel (16/09), thèmes dans
// Photographer (17/09). Dans Travel, Interrail est une
// destination au sens large, l'Autriche en est une autre (Vienne, Villach,
// Graz...). Chaque destination a sa tuile et sa page. Ajouter une destination
// = un bloc ici, puis `series: <clé>` dans les articles.
export const JOURNAL_SERIES: Record<string, { label: string; cover: string; order?: string[] }> = {
  interrail: {
    label: "Interrail",
    cover: "/images/journal/interrail/bled-boats.jpg",
    order: ["interrail-twelve-stops", "interrail-how-i-used-the-pass", "interrail-what-i-packed"],
  },
  // Catégories de la section Photographer (17/09). "Edits" et les suivantes
  // apparaîtront d'elles-mêmes dès qu'un article portera leur clé.
  "my-cameras": {
    label: "My cameras",
    cover: "/images/journal/covers/camera-bag-flatlay.jpg",
    order: ["insta360-luna-ultra-review", "insta360-ace-pro-2-review", "whats-in-my-camera-bag", "my-first-drone"],
  },
  edits: {
    label: "Edits",
    cover: "/images/journal/interrail/train-window.jpg",
  },
  slovenia: {
    label: "Slovenia",
    cover: "/images/journal/slovenia/bled-heart-lock.jpg",
    order: ["ljubljana-guide", "lake-bled-guide"],
  },
  austria: {
    label: "Austria",
    cover: "/images/journal/covers/austria-belvedere.jpg",
    order: ["vienna-slow-guide"],
  },
};

export function postsInSeries(key: string): JournalPost[] {
  const order = JOURNAL_SERIES[key]?.order ?? [];
  return allPosts()
    .filter((p) => p.series === key)
    .sort((a, b) => (order.indexOf(a.slug) + 1 || 99) - (order.indexOf(b.slug) + 1 || 99));
}

export type JournalPost = {
  slug: string;
  section: JournalSection;
  series?: string;
  // Mot court écrit sur la tuile carrée (16/09) : "Vienna", "Camera bag".
  tile: string;
  title: string;
  date: string; // AAAA-MM-JJ
  place?: string;
  cover?: string;
  excerpt?: string;
  body: string;
};

function parse(file: string): JournalPost | null {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i < 0) continue;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  if (!meta.title || !meta.date || meta.draft === "true") return null;
  return {
    slug: file.replace(/\.md$/, ""),
    section: (["travel", "creator", "photographer"].includes(meta.section) ? meta.section : "travel") as JournalSection,
    series: meta.series || undefined,
    tile: meta.tile || meta.title,
    title: meta.title,
    date: meta.date,
    place: meta.place || undefined,
    cover: meta.cover || undefined,
    excerpt: meta.excerpt || undefined,
    body: m[2].trim(),
  };
}

export function allPosts(): JournalPost[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_") && f !== "README.md");
  } catch {
    return [];
  }
  return files
    .map(parse)
    .filter((p): p is JournalPost => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function findPost(slug: string): JournalPost | undefined {
  return allPosts().find((p) => p.slug === slug);
}

export function formatDate(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(s: string): string {
  let out = esc(s);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, href) => {
    const safe = /^(https?:\/\/|\/|mailto:)/.test(href) ? href : "#";
    // Liens affiliés (Insta360, CJ, Booking, Amazon...) : rel="sponsored",
    // comme Google le demande pour les liens rémunérés.
    const affiliate = /utm_source=AffiliateCenter|anrdoezrs|jdoqocy|tkqlhce|dpbolvw|kqzyfj|awin1|[?&]aid=|[?&]tag=/.test(safe);
    const ext = safe.startsWith("http")
      ? ` target="_blank" rel="${affiliate ? "sponsored nofollow " : ""}noopener noreferrer"`
      : "";
    return `<a href="${safe}"${ext}>${text}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

// Rendu par parties (17/09, sur le modèle d'adriana-maria.com) : chaque partie
// (titre ## ou ###) montre son texte, puis ses photos en rangée juste en
// dessous (trois par ligne, deux si elles sont deux), sans grands blancs.
export function renderMarkdown(md: string): string {
  const blocks = md.replace(/\r\n/g, "\n").split(/\n{2,}/);
  type Part = { html: string; kind: "img" | "h2" | "h3" | "text" };
  const parts: Part[] = blocks
    .map((b): Part | null => {
      const block = b.trim();
      if (!block) return null;
      const img = block.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
      if (img) {
        const src = /^(https?:\/\/|\/)/.test(img[2]) ? img[2] : "";
        if (!src) return null;
        const cap = img[1] ? `<figcaption>${esc(img[1])}</figcaption>` : "";
        return { kind: "img", html: `<figure><img src="${esc(src)}" alt="${esc(img[1])}" loading="lazy" />${cap}</figure>` };
      }
      // Reel Instagram intégré (17/09) : une ligne seule contenant le lien
      // du reel ou du post, par exemple https://www.instagram.com/reel/XXXX/
      const ig = block.match(/^https:\/\/www\.instagram\.com\/(reel|p)\/([A-Za-z0-9_-]+)\/?$/);
      if (ig) {
        return { kind: "img", html: `<figure class="reel"><iframe src="https://www.instagram.com/${ig[1]}/${ig[2]}/embed" loading="lazy" title="Instagram ${ig[1]}" allowtransparency="true" scrolling="no"></iframe></figure>` };
      }
      if (block.startsWith("### ")) return { kind: "h3", html: `<h3>${inline(block.slice(4))}</h3>` };
      if (block.startsWith("## ")) return { kind: "h2", html: `<h2>${inline(block.slice(3))}</h2>` };
      if (block.split("\n").every((l) => l.startsWith(">"))) {
        return { kind: "text", html: `<blockquote><p>${inline(block.split("\n").map((l) => l.replace(/^>\s?/, "")).join(" "))}</p></blockquote>` };
      }
      if (block.split("\n").every((l) => /^[-*]\s+/.test(l))) {
        return { kind: "text", html: `<ul>${block.split("\n").map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` };
      }
      return { kind: "text", html: `<p>${inline(block).replace(/\n/g, "<br />")}</p>` };
    })
    .filter((x): x is Part => x !== null);

  const sections: Part[][] = [];
  for (const part of parts) {
    if (part.kind === "h2" || part.kind === "h3" || sections.length === 0) sections.push([part]);
    else sections[sections.length - 1].push(part);
  }
  return sections
    .map((sec) => {
      const text = sec.filter((x) => x.kind !== "img").map((x) => x.html).join("\n");
      const media = sec.filter((x) => x.kind === "img").map((x) => x.html).join("\n");
      const count = sec.filter((x) => x.kind === "img").length;
      return `<section class="section"><div class="text">${text}</div>${media ? `<div class="media n${Math.min(count, 6)}">${media}</div>` : ""}</section>`;
    })
    .join("\n");
}
