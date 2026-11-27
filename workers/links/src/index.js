// Compteur de clics de la page lien en bio (thegirlwithacamera.com/links).
//
// Ce que ca garde : le nom du lien clique, la provenance (?from=dm quand le
// visiteur arrive du bouton de la machine a commentaires) et le jour.
// Ce que ca ne garde pas : aucune adresse IP, aucun cookie, rien sur la
// personne. Une ligne par lien, par provenance et par jour, avec un total.
//
// Adresses :
//   POST /hit?l=<lien>&from=<provenance>   compte un clic (appele par la page)
//   GET  /stats?key=<cle>                  page de lecture des chiffres
//   GET  /stats.json?key=<cle>             les memes chiffres pour un outil
//
// La cle de lecture est un secret du Worker (STATS_KEY), jamais dans le code.

import { corriger, depot, kit, lire, page as pageInsta } from "./insta.js";

const LINKS = new Set([
  "collabs",
  "shop",
  "journal",
  "product-street",
  "product-street-image",
  "product-shy",
  "product-shy-image",
  "instagram",
  "tiktok",
  "youtube",
  "threads",
  "pinterest",
  "linkedin",
]);

const LABELS = {
  collabs: "Work with me",
  shop: "Shop",
  journal: "Journal",
  "product-street": "Street (bouton)",
  "product-street-image": "Street (image)",
  "product-shy": "Shy With A Camera (bouton)",
  "product-shy-image": "Shy With A Camera (image)",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  threads: "Threads",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
};

const ORIGINS = new Set([
  "https://www.thegirlwithacamera.com",
  "https://thegirlwithacamera.com",
]);

const BOTS = /bot|crawl|spider|preview|facebookexternalhit|slurp|monitor|headless/i;

// Jour au fuseau de Bruxelles, pour que "aujourd'hui" veuille dire la meme
// chose que sur son telephone.
function today(offsetDays = 0) {
  const d = new Date(Date.now() - offsetDays * 86400000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Brussels" }).format(d);
}

function cleanFrom(value) {
  const v = (value || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 20);
  return v || "direct";
}

async function hit(request, env, url) {
  const origin = request.headers.get("origin");
  if (origin && !ORIGINS.has(origin)) return new Response(null, { status: 204 });
  if (BOTS.test(request.headers.get("user-agent") || "")) return new Response(null, { status: 204 });

  const link = url.searchParams.get("l") || "";
  if (!LINKS.has(link)) return new Response(null, { status: 204 });
  const from = cleanFrom(url.searchParams.get("from"));

  await env.DB.prepare(
    "INSERT INTO clicks (day, link, source, n) VALUES (?1, ?2, ?3, 1) " +
      "ON CONFLICT (day, link, source) DO UPDATE SET n = n + 1",
  )
    .bind(today(), link, from)
    .run();

  return new Response(null, {
    status: 204,
    headers: { "access-control-allow-origin": origin || "*" },
  });
}

async function readStats(env) {
  const since7 = today(6);
  const since30 = today(29);
  const { results } = await env.DB.prepare(
    "SELECT link, source, " +
      "SUM(CASE WHEN day = ?1 THEN n ELSE 0 END) AS d1, " +
      "SUM(CASE WHEN day >= ?2 THEN n ELSE 0 END) AS d7, " +
      "SUM(CASE WHEN day >= ?3 THEN n ELSE 0 END) AS d30, " +
      "SUM(n) AS total " +
      "FROM clicks GROUP BY link, source",
  )
    .bind(today(), since7, since30)
    .all();
  return results;
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

function table(title, rows) {
  const max = Math.max(1, ...rows.map((r) => r.d30));
  const body = rows.length
    ? rows
        .map(
          (r) =>
            `<tr><td class="name">${esc(r.name)}<span class="bar" style="width:${Math.round((r.d30 / max) * 100)}%"></span></td>` +
            `<td>${r.d1}</td><td>${r.d7}</td><td>${r.d30}</td><td>${r.total}</td></tr>`,
        )
        .join("")
    : `<tr><td colspan="5" class="empty">Aucun clic pour l'instant.</td></tr>`;
  return (
    `<h2>${esc(title)}</h2><table><thead><tr><th></th><th>Aujourd'hui</th><th>7 jours</th><th>30 jours</th><th>Total</th></tr></thead>` +
    `<tbody>${body}</tbody></table>`
  );
}

function sum(rows, keyOf, nameOf) {
  const map = new Map();
  for (const r of rows) {
    const k = keyOf(r);
    const cur = map.get(k) || { name: nameOf(k), d1: 0, d7: 0, d30: 0, total: 0 };
    cur.d1 += r.d1;
    cur.d7 += r.d7;
    cur.d30 += r.d30;
    cur.total += r.total;
    map.set(k, cur);
  }
  return [...map.values()].sort((a, b) => b.d30 - a.d30 || b.total - a.total);
}

function page(rows) {
  const byLink = sum(rows, (r) => r.link, (k) => LABELS[k] || k);
  const bySource = sum(
    rows,
    (r) => r.source,
    (k) => (k === "direct" ? "Lien en bio (direct)" : k === "dm" ? "Bouton du DM" : k),
  );
  const dm = sum(rows.filter((r) => r.source === "dm"), (r) => r.link, (k) => LABELS[k] || k);
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Clics de la page lien en bio</title>
<style>
body{margin:0;padding:28px 18px 60px;background:#fff;color:#111;font:15px/1.5 -apple-system,BlinkMacSystemFont,"Inter",sans-serif}
main{max-width:640px;margin:0 auto}
h1{font:italic 30px/1.2 "EB Garamond",Georgia,serif;margin:0 0 4px}
p.sub{color:#666;margin:0 0 28px;font-size:13px}
h2{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#666;font-weight:500;margin:34px 0 10px}
table{width:100%;border-collapse:collapse}
th{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#888;font-weight:500;text-align:right;padding:6px 0 6px 10px}
td{padding:11px 0 11px 10px;border-top:1px solid #e6e6e6;text-align:right;font-variant-numeric:tabular-nums}
td.name{text-align:left;padding-left:0;position:relative}
td.empty{text-align:left;color:#888;padding-left:0}
.bar{position:absolute;left:0;bottom:4px;height:2px;background:#b02c1e}
</style></head><body><main>
<h1>Clics de la page lien en bio</h1>
<p class="sub">Mis à jour à chaque ouverture de cette page. Aucune donnée sur les visiteurs, seulement le nombre de clics par lien.</p>
${table("Par lien", byLink)}
${table("D'où viennent les clics", bySource)}
${table("Clics venus du bouton du DM", dm)}
</main></body></html>`;
}

function allowed(env, url) {
  const key = url.searchParams.get("key") || "";
  return Boolean(env.STATS_KEY) && key.length === env.STATS_KEY.length && key === env.STATS_KEY;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/hit") {
      if (request.method !== "POST") return new Response(null, { status: 204 });
      try {
        return await hit(request, env, url);
      } catch {
        return new Response(null, { status: 204 });
      }
    }

    if (url.pathname === "/stats" || url.pathname === "/stats.json") {
      if (!allowed(env, url)) return new Response("Introuvable", { status: 404 });
      const rows = await readStats(env);
      if (url.pathname === "/stats.json") {
        return Response.json(rows, { headers: { "cache-control": "no-store" } });
      }
      return new Response(page(rows), {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
      });
    }

    if (url.pathname === "/insta/correction" && request.method === "POST") {
      if (!allowed(env, url)) return new Response("Introuvable", { status: 404 });
      return corriger(request, env);
    }

    if (url.pathname === "/insta/depot" && request.method === "POST") {
      return depot(request, env);
    }

    if (url.pathname === "/kit.json") {
      const k = kit(await lire(env));
      if (!k) return new Response("Pas encore de releve", { status: 503 });
      return Response.json(k, { headers: { "cache-control": "public, max-age=600" } });
    }

    if (url.pathname === "/insta" || url.pathname === "/insta.json") {
      if (!allowed(env, url)) return new Response("Introuvable", { status: 404 });
      const tout = await lire(env);
      if (url.pathname === "/insta.json") {
        return Response.json(tout, { headers: { "cache-control": "no-store" } });
      }
      return new Response(pageInsta(tout, url.searchParams.get("key")), {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
      });
    }

    return new Response("Introuvable", { status: 404 });
  },
};
