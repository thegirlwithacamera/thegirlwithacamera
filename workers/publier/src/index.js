// Programmation des publications, faite maison (remplace Postiz).
//
// Une page privee pour envoyer les videos et photos, ecrire les legendes et
// choisir l'heure. Toutes les 5 minutes, le cron publie ce qui est du par la
// voie officielle Meta (Instagram API, connexion unifiee).
//
// Secrets (jamais dans le code) : META_TOKEN (pose par Sandrine elle-meme),
// CLE (cle de la page privee).
//
//   GET  /?key=                      la page
//   GET  /media/<fichier>            les fichiers, lus par Meta au moment de publier
//   POST /api/envoi/debut|morceau|fin   envoi des fichiers par morceaux (gros reels)
//   GET  /api/posts?key=             la liste
//   POST /api/posts?key=             programmer un ou plusieurs posts
//   POST /api/posts/<id>/supprimer   retirer un post prevu
//   POST /api/posts/<id>/relancer    retenter un post en erreur

import { passageCommentaires } from "./commentaires.js";
import * as threads from "./threads.js";
import * as youtube from "./youtube.js";
import * as pinterest from "./pinterest.js";
import * as tiktok from "./tiktok.js";
import { pageCommentaires } from "./page-commentaires.js";
import { pageProgrammation } from "./page-programmation.js";

const GRAPH = "https://graph.facebook.com/v25.0";
const GENRES = ["essai", "reel", "photo", "carrousel"];
const GENRES_THREADS = ["texte", "photo", "video", "carrousel"];
const GENRES_YOUTUBE = ["video"];
const GENRES_PINTEREST = ["epingle"];
const GENRES_TIKTOK = ["video"];

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

function autorise(env, url) {
  const k = url.searchParams.get("key") || "";
  return Boolean(env.CLE) && k.length === env.CLE.length && k === env.CLE;
}

const maintenant = () => new Date().toISOString();

// ---------------------------------------------------------------- Meta

let appels = 0;
threads.compter(() => { appels++; });
youtube.compter(() => { appels++; });
pinterest.compter(() => { appels++; });
tiktok.compter(() => { appels++; });

async function meta(env, chemin, corps) {
  appels++;
  const init = { headers: { authorization: `Bearer ${env.META_TOKEN}` } };
  if (corps) {
    init.method = "POST";
    init.headers["content-type"] = "application/json";
    init.body = JSON.stringify(corps);
  }
  const r = await fetch(`${GRAPH}/${chemin}`, init);
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.error) {
    const m = (d.error && (d.error.error_user_msg || d.error.message)) || `HTTP ${r.status}`;
    throw new Error(String(m).replaceAll(env.META_TOKEN || "§", "[jeton]").slice(0, 300));
  }
  return d;
}

const estVideo = (cle) => /\.(mp4|mov|m4v)$/i.test(cle);

async function creerConteneurs(env, p) {
  const ig = env.IG_ID;
  const url = (cle) => `${env.PUBLIC_URL}/media/${cle}`;
  const medias = JSON.parse(p.medias);
  if (p.genre === "essai" || p.genre === "reel") {
    const corps = { media_type: "REELS", video_url: url(medias[0]), caption: p.legende || "", share_to_feed: true };
    if (p.genre === "essai") {
      corps.trial_params = { graduation_strategy: "MANUAL" };
      delete corps.share_to_feed;
    }
    if (p.couverture != null) corps.thumb_offset = Number(p.couverture) || 0;
    const c = await meta(env, `${ig}/media`, corps);
    return { statut: "traitement", conteneur: c.id };
  }
  if (p.genre === "photo") {
    const c = await meta(env, `${ig}/media`, { image_url: url(medias[0]), caption: p.legende || "" });
    return { statut: "traitement", conteneur: c.id };
  }
  // carrousel : d'abord un conteneur par photo ou video
  const enfants = [];
  for (const cle of medias) {
    const corps = estVideo(cle)
      ? { media_type: "VIDEO", video_url: url(cle), is_carousel_item: true }
      : { image_url: url(cle), is_carousel_item: true };
    enfants.push((await meta(env, `${ig}/media`, corps)).id);
  }
  return { statut: "enfants", enfants: JSON.stringify(enfants) };
}

async function etat(env, conteneur) {
  const d = await meta(env, `${conteneur}?fields=status_code,status`);
  return { code: d.status_code, detail: d.status };
}

async function publier(env, conteneur) {
  const d = await meta(env, `${env.IG_ID}/media_publish`, { creation_id: conteneur });
  let lien = null;
  try {
    lien = (await meta(env, `${d.id}?fields=permalink`)).permalink || null;
  } catch {}
  return { id: d.id, lien };
}

async function maj(env, id, champs) {
  const cles = Object.keys(champs);
  const sql = `UPDATE planning SET ${cles.map((c, i) => `${c} = ?${i + 1}`).join(", ")}, maj = ?${cles.length + 1} WHERE id = ?${cles.length + 2}`;
  await env.DB.prepare(sql).bind(...cles.map((c) => champs[c]), maintenant(), id).run();
}

async function avancer(env, p) {
  if (p.reseau === "pinterest") {
    try {
      const r = await pinterest.publier(env, p);
      await maj(env, p.id, { statut: "publie", resultat: r.id, lien: r.lien, erreur: null });
    } catch (e) {
      const essais = (p.essais || 0) + 1;
      const fini = essais >= 3 || /refuse|tableau|connecte/i.test(e.message);
      await maj(env, p.id, fini ? { statut: "erreur", erreur: e.message, essais } : { erreur: e.message, essais });
      if (fini) await alerte(env, p, e.message);
    }
    return;
  }
  if (p.reseau === "tiktok") {
    try {
      if (p.statut === "prevu") {
        await maj(env, p.id, { statut: "traitement", conteneur: null });
        const id = await tiktok.envoyer(env, p);
        // Un brouillon est livre des que l'envoi est fini : TikTok ne donne pas d'etat final pour la boite de reception.
        if (JSON.parse(p.extra || "{}").mode === "brouillon") await maj(env, p.id, { statut: "publie", resultat: id, conteneur: id, erreur: null });
        else await maj(env, p.id, { statut: "traitement", conteneur: id });
        return;
      }
      if (p.statut === "traitement") {
        // Envoi coupe en plein milieu : on repart de zero au passage suivant.
        if (!p.conteneur) {
          if (Date.now() - new Date(p.maj).getTime() > 20 * 60000) await maj(env, p.id, { statut: "prevu" });
          return;
        }
        const s = await tiktok.etat(env, p.conteneur, env.TT_COMPTE);
        if (s.code === "ERROR") throw new Error(`TikTok refuse la video (${s.detail})`);
        if (s.code !== "FINISHED") {
          if (s.detail && s.detail !== p.erreur) await maj(env, p.id, { erreur: s.detail });
          return attendre(env, p);
        }
        await maj(env, p.id, { statut: "publie", resultat: s.id, lien: s.lien, erreur: null });
      }
    } catch (e) {
      const essais = (p.essais || 0) + 1;
      const fini = essais >= 3 || /refuse|connecte|expire/i.test(e.message);
      await maj(env, p.id, fini ? { statut: "erreur", erreur: e.message, essais } : { statut: "prevu", conteneur: null, erreur: e.message, essais });
      if (fini) await alerte(env, p, e.message);
    }
    return;
  }
  if (p.reseau === "youtube") {
    // Un envoi deja en cours dans un autre passage : on ne le relance pas avant 20 minutes.
    if (p.statut === "traitement" && Date.now() - new Date(p.maj).getTime() < 20 * 60000) return;
    try {
      await maj(env, p.id, { statut: "traitement" });
      const r = await youtube.publier(env, p);
      await maj(env, p.id, { statut: "publie", resultat: r.id, lien: r.lien, erreur: null });
    } catch (e) {
      const essais = (p.essais || 0) + 1;
      const fini = essais >= 3 || /refuse|format|invalid|connecte/i.test(e.message);
      await maj(env, p.id, fini ? { statut: "erreur", erreur: e.message, essais } : { statut: "prevu", erreur: e.message, essais });
      if (fini) await alerte(env, p, e.message);
    }
    return;
  }
  const th = p.reseau === "threads";
  const creer = th ? threads.creer : creerConteneurs;
  const lire = th ? threads.etat : etat;
  const sortir = th ? threads.publier : publier;
  try {
    if (p.statut === "prevu") {
      await maj(env, p.id, await creer(env, p));
      return;
    }
    if (p.statut === "enfants") {
      const enfants = JSON.parse(p.enfants || "[]");
      for (const e of enfants) {
        const s = await lire(env, e);
        if (s.code === "ERROR" || s.code === "EXPIRED") throw new Error(`Un element du carrousel est refuse par Meta (${s.detail || s.code})`);
        if (s.code !== "FINISHED") return attendre(env, p);
      }
      const id = th ? await threads.carrousel(env, p, enfants) : (await meta(env, `${env.IG_ID}/media`, { media_type: "CAROUSEL", children: enfants.join(","), caption: p.legende || "" })).id;
      await maj(env, p.id, { statut: "traitement", conteneur: id });
      return;
    }
    if (p.statut === "traitement") {
      const s = await lire(env, p.conteneur);
      if (s.code === "ERROR" || s.code === "EXPIRED") throw new Error(`Meta refuse le fichier (${s.detail || s.code})`);
      if (s.code !== "FINISHED") return attendre(env, p);
      const r = await sortir(env, p.conteneur);
      await maj(env, p.id, { statut: "publie", resultat: r.id, lien: r.lien, erreur: null });
    }
  } catch (e) {
    const essais = (p.essais || 0) + 1;
    // Une erreur de Meta sur un fichier ne s'arrange pas en retentant : on s'arrete tout de suite.
    const definitive = /refuse|format|aspect|duration|resolution|invalid/i.test(e.message);
    const fini = essais >= 3 || definitive;
    await maj(env, p.id, fini ? { statut: "erreur", erreur: e.message, essais } : { erreur: e.message, essais });
    if (fini) await alerte(env, p, e.message);
  }
}

async function attendre(env, p) {
  // Meta prepare la video. Au dela de 2 heures, on abandonne.
  if (Date.now() - new Date(p.quand).getTime() > 2 * 3600 * 1000) {
    const m = `${{ threads: "Threads", tiktok: "TikTok" }[p.reseau] || "Instagram"} n'a pas fini de preparer le fichier en 2 heures.`;
    await maj(env, p.id, { statut: "erreur", erreur: m });
    await alerte(env, p, m);
  }
}

// Email a Sandrine quand un post echoue (Resend, offre gratuite).
async function alerte(env, p, raison) {
  if (!env.RESEND_KEY || !env.ALERTE_A) return;
  const noms = { essai: "reel d'essai", reel: "reel", photo: "photo", carrousel: "carrousel", texte: "post texte", video: "video" };
  const ou = { threads: "Threads", youtube: "YouTube", pinterest: "Pinterest", tiktok: "TikTok" }[p.reseau] || "Instagram";
  const quand = new Date(p.quand).toLocaleString("fr-BE", { timeZone: "Europe/Brussels", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  const lien = `${env.PUBLIC_URL}/?key=${encodeURIComponent(env.CLE || "")}`;
  const esc = (s) => String(s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: env.ALERTE_DE || "Programmation <onboarding@resend.dev>",
        to: [env.ALERTE_A],
        subject: `${ou} : un ${noms[p.genre] || "post"} n'est pas parti (${quand})`,
        html: `<p>Le ${noms[p.genre] || "post"} prevu ${esc(quand)} n'a pas ete publie.</p>` +
          `<p><b>Raison donnee par ${ou} :</b> ${esc(raison)}</p>` +
          `<p><b>Legende :</b> ${esc((p.legende || "").slice(0, 160))}</p>` +
          `<p><a href="${lien}">Ouvrir la programmation</a> pour le reessayer ou le retirer.</p>`,
      }),
    });
  } catch {}
}

async function cron(env) {
  if (!env.META_TOKEN && !env.THREADS_TOKEN) return;
  try { await threads.entretien(env); } catch {}
  await env.DB.prepare("INSERT INTO reglages (nom, valeur) VALUES ('pub_dernier', ?1) ON CONFLICT (nom) DO UPDATE SET valeur = ?1").bind(JSON.stringify(maintenant())).run();
  const { results } = await env.DB.prepare(
    "SELECT * FROM planning WHERE (statut = 'prevu' AND quand <= ?1) OR statut IN ('traitement', 'enfants') ORDER BY quand LIMIT 12",
  ).bind(maintenant()).all();
  for (const p of results) await avancer(env, p);

  // Menage : les fichiers des posts publies depuis plus de 7 jours ne servent plus.
  const vieux = (await env.DB.prepare(
    "SELECT id, medias FROM planning WHERE statut = 'publie' AND menage IS NULL AND maj < ?1 LIMIT 50",
  ).bind(new Date(Date.now() - 7 * 86400000).toISOString()).all()).results;
  for (const v of vieux) {
    for (const cle of JSON.parse(v.medias || "[]")) await env.R2.delete(`planning/${cle}`);
    await env.DB.prepare("UPDATE planning SET menage = 1 WHERE id = ?1").bind(v.id).run();
  }
}

// ---------------------------------------------------------------- envoi des fichiers

const TYPES = { mp4: "video/mp4", mov: "video/quicktime", m4v: "video/mp4", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };

async function envoi(request, env, url, etape) {
  if (etape === "debut") {
    const ext = (url.searchParams.get("ext") || "").toLowerCase();
    if (!TYPES[ext]) return json({ erreur: "Accepted formats: mp4, mov, jpg, png." }, 400);
    const cle = `${crypto.randomUUID()}.${ext === "jpeg" ? "jpg" : ext}`;
    const m = await env.R2.createMultipartUpload(`planning/${cle}`, { httpMetadata: { contentType: TYPES[ext] } });
    return json({ cle, uploadId: m.uploadId });
  }
  const cle = url.searchParams.get("cle") || "";
  if (!/^[0-9a-f-]{36}\.(mp4|mov|m4v|jpg|png)$/.test(cle)) return json({ erreur: "Fichier inconnu" }, 400);
  const m = env.R2.resumeMultipartUpload(`planning/${cle}`, url.searchParams.get("uploadId") || "");
  if (etape === "morceau") {
    const n = Number(url.searchParams.get("n"));
    const part = await m.uploadPart(n, await request.arrayBuffer());
    return json(part);
  }
  if (etape === "fin") {
    const { parts } = await request.json();
    await m.complete(parts);
    return json({ cle });
  }
  return json({ erreur: "?" }, 404);
}

async function media(env, url) {
  const cle = url.pathname.slice("/media/".length);
  if (!/^[0-9a-f-]{36}\.(mp4|mov|m4v|jpg|png)$/.test(cle)) return new Response("Introuvable", { status: 404 });
  const o = await env.R2.get(`planning/${cle}`);
  if (!o) return new Response("Introuvable", { status: 404 });
  const h = new Headers();
  o.writeHttpMetadata(h);
  h.set("content-length", String(o.size));
  h.set("cache-control", "private, max-age=3600");
  return new Response(o.body, { headers: h });
}

// ---------------------------------------------------------------- posts

async function liste(env) {
  const { results } = await env.DB.prepare(
    "SELECT id, reseau, genre, legende, medias, quand, statut, erreur, lien FROM planning " +
      "WHERE statut != 'publie' OR quand >= ?1 ORDER BY quand",
  ).bind(new Date(Date.now() - 14 * 86400000).toISOString()).all();
  return results.map((r) => ({ ...r, medias: JSON.parse(r.medias) }));
}

async function programmer(request, env) {
  const d = await request.json();
  const posts = Array.isArray(d.posts) ? d.posts : [d];
  const ok = [];
  for (const p of posts) {
    const reseau = ["threads", "youtube", "pinterest", "tiktok"].includes(p.reseau) ? p.reseau : "instagram";
    if (!({ threads: GENRES_THREADS, youtube: GENRES_YOUTUBE, pinterest: GENRES_PINTEREST, tiktok: GENRES_TIKTOK }[reseau] || GENRES).includes(p.genre)) return json({ erreur: `Unknown type for ${reseau}: ${p.genre}` }, 400);
    const medias = (p.medias || []).filter((c) => /^[0-9a-f-]{36}\.(mp4|mov|m4v|jpg|png)$/.test(c));
    if (p.genre === "texte") {
      if (!String(p.legende || "").trim()) return json({ erreur: "A text post needs some text." }, 400);
      if (String(p.legende).length > 500) return json({ erreur: "Threads allows 500 characters max." }, 400);
    } else if (!medias.length) return json({ erreur: "No file" }, 400);
    if (reseau === "threads" && String(p.legende || "").length > 500) return json({ erreur: "Threads allows 500 characters max." }, 400);
    if (reseau === "youtube" && !String(p.legende || "").split("\n")[0].trim()) return json({ erreur: "On YouTube, the first line of the caption is the title." }, 400);
    let extra = null;
    if (reseau === "pinterest") {
      if (!p.tableau) return json({ erreur: "Pick a Pinterest board." }, 400);
      if (!/\.jpg$/.test(medias[0])) return json({ erreur: "A pin needs a photo." }, 400);
      if (p.lien && !/^https:\/\//.test(p.lien)) return json({ erreur: "The link must start with https://" }, 400);
      extra = JSON.stringify({ tableau: String(p.tableau), lien: p.lien || "" });
    }
    if (reseau === "tiktok") {
      const brouillon = p.mode === "brouillon";
      if (!brouillon && !p.confidentialite) return json({ erreur: "Choose who can watch the video on TikTok." }, 400);
      extra = JSON.stringify({ mode: brouillon ? "brouillon" : "direct", confidentialite: String(p.confidentialite), commentaires: p.commentaires !== false, duo: p.duo !== false, collage: p.collage !== false });
    }
    if (p.genre === "video" && !estVideo(medias[0])) return json({ erreur: "A video post needs a video file." }, 400);
    if (reseau === "threads" && p.genre === "carrousel" && medias.length > 20) return json({ erreur: "Threads takes 20 files max." }, 400);
    if ((p.genre === "essai" || p.genre === "reel") && !estVideo(medias[0])) return json({ erreur: "A reel needs a video." }, 400);
    if (p.genre === "photo" && !/\.jpg$/.test(medias[0])) return json({ erreur: "Instagram only takes JPEG photos." }, 400);
    if (p.genre === "carrousel" && (medias.length < 2 || (reseau === "instagram" && medias.length > 10))) return json({ erreur: "A carousel takes 2 to 10 files." }, 400);
    const quand = new Date(p.quand);
    if (isNaN(quand)) return json({ erreur: "Unreadable date" }, 400);
    const id = crypto.randomUUID();
    await env.DB.prepare(
      "INSERT INTO planning (id, reseau, genre, legende, medias, quand, statut, couverture, essais, cree, maj, extra) " +
        "VALUES (?1, ?8, ?2, ?3, ?4, ?5, 'prevu', ?6, 0, ?7, ?7, ?9)",
    ).bind(id, p.genre, String(p.legende || "").slice(0, 2200), JSON.stringify(medias), quand.toISOString(),
      p.couverture ?? null, maintenant(), reseau, extra).run();
    ok.push(id);
  }
  return json({ ok: true, ids: ok });
}

// ---------------------------------------------------------------- page

function page() {
  return pageProgrammation();
}

// ---------------------------------------------------------------- routes

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    if (p.startsWith("/media/")) return media(env, url);
    if (p === "/ping") return new Response('{"ok":true}', { headers: { "content-type": "application/json", "access-control-allow-origin": "*" } });
    if (p === "/youtube/retour") return youtube.retourGoogle(env, url);
    if (p === "/pinterest/retour") return pinterest.retourPinterest(env, url);
    if (p === "/tiktok/retour") return tiktok.retourTiktok(env, url);
    // Preuve de propriete demandee par TikTok for Developers (fichier public, sans secret).
    if (p === "/tiktokvkqwXoVt0NTlRliZH4jtt5enCtqTkFwZ.txt") return new Response("tiktok-developers-site-verification=vkqwXoVt0NTlRliZH4jtt5enCtqTkFwZ", { headers: { "content-type": "text/plain" } });
    if (!autorise(env, url)) return new Response("Introuvable", { status: 404 });
    if (p === "/") return new Response(page(), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
    if (p.startsWith("/api/envoi/")) return envoi(request, env, url, p.split("/")[3]);
    if (p === "/api/posts" && request.method === "GET") return json(await liste(env));
    if (p === "/api/posts" && request.method === "POST") return programmer(request, env);
    const ml = /^\/api\/posts\/([0-9a-f-]{36})\/legende$/.exec(p);
    if (ml && request.method === "POST") {
      const { legende } = await request.json();
      const r = await env.DB.prepare("UPDATE planning SET legende = ?1, maj = ?2 WHERE id = ?3 AND statut = 'prevu'")
        .bind(String(legende || "").slice(0, 2200), maintenant(), ml[1]).run();
      return json({ ok: r.meta.changes === 1 });
    }
    const m = /^\/api\/posts\/([0-9a-f-]{36})\/(supprimer|relancer)$/.exec(p);
    if (m && request.method === "POST") {
      if (m[2] === "supprimer") {
        const r = await env.DB.prepare("SELECT medias FROM planning WHERE id = ?1 AND statut = 'prevu'").bind(m[1]).first();
        if (r) {
          for (const cle of JSON.parse(r.medias || "[]")) await env.R2.delete(`planning/${cle}`);
          await env.DB.prepare("DELETE FROM planning WHERE id = ?1").bind(m[1]).run();
        }
      } else {
        await env.DB.prepare("UPDATE planning SET statut = 'prevu', erreur = NULL, essais = 0, conteneur = NULL, enfants = NULL, quand = ?1 WHERE id = ?2 AND statut = 'erreur'")
          .bind(maintenant(), m[1]).run();
      }
      return json({ ok: true });
    }
    if (p === "/api/studio" && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM studio WHERE statut = 'pret' ORDER BY ajoute DESC").all();
      return json(results);
    }
    if (p === "/api/studio" && request.method === "POST") {
      const d = await request.json();
      if (!/^[A-Za-z0-9-]{1,40}$/.test(d.id || "") || !/^[0-9a-f-]{36}\.(mp4|mov)$/.test(d.cle || "")) return json({ erreur: "Bad studio reel" }, 400);
      const reseau = ["instagram", "tiktok", "youtube", "threads"].includes(d.reseau) ? d.reseau : "instagram";
      await env.DB.prepare("INSERT INTO studio (id, reseau, titre, legende, cle, duree, empreinte, statut, ajoute) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'pret', ?8) " +
        "ON CONFLICT (id) DO UPDATE SET reseau = ?2, titre = ?3, legende = ?4, cle = ?5, duree = ?6, empreinte = ?7, statut = 'pret', ajoute = ?8")
        .bind(d.id, reseau, String(d.titre || "").slice(0, 200), String(d.legende || "").slice(0, 2200), d.cle, String(d.duree || "").slice(0, 20), String(d.empreinte || "").slice(0, 64), maintenant()).run();
      return json({ ok: true });
    }
    if (p === "/api/studio/empreintes" && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT id, empreinte, statut FROM studio").all();
      return json(results);
    }
    const ms = /^\/api\/studio\/([A-Za-z0-9-]{1,40})\/(utilise|retirer)$/.exec(p);
    if (ms && request.method === "POST") {
      await env.DB.prepare("UPDATE studio SET statut = ?1 WHERE id = ?2").bind(ms[2] === "utilise" ? "programme" : "retire", ms[1]).run();
      return json({ ok: true });
    }
    if (p === "/youtube/connecter") return youtube.connecter(env);
    if (p === "/pinterest/connecter") return pinterest.connecter(env);
    if (p === "/tiktok/connecter") return tiktok.connecter(env);
    if (p === "/api/tiktok/createur") {
      try { return json(await tiktok.createur(env)); } catch (e) { return json({ erreur: String(e.message).slice(0, 200) }, 500); }
    }
    if (p === "/api/pinterest/tableaux") {
      try {
        if (request.method === "POST") return json(await pinterest.creerTableau(env, (await request.json()).nom));
        return json(await pinterest.tableaux(env));
      } catch (e) { return json({ erreur: String(e.message).slice(0, 200) }, 500); }
    }
    if (p === "/api/etat") return json({ jeton: Boolean(env.META_TOKEN), threads: Boolean(env.THREADS_TOKEN), youtube: await youtube.etatConnexion(env), pinterest: await pinterest.etatConnexion(env), tiktok: await tiktok.etatConnexion(env), alerte: Boolean(env.RESEND_KEY && env.ALERTE_A) });
    if (p === "/api/threads/test") {
      try {
        const d = await threads.profil(env);
        return json({ ok: true, compte: d.username });
      } catch (e) {
        return json({ erreur: String(e.message || e).slice(0, 200) }, 500);
      }
    }
    if (p === "/api/alerte-test" && request.method === "POST") {
      if (!env.RESEND_KEY) return json({ erreur: "Pas de cle Resend" }, 400);
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${env.RESEND_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({ from: env.ALERTE_DE || "Programmation <onboarding@resend.dev>", to: [url.searchParams.get("a") || env.ALERTE_A],
          subject: "Test : les alertes de la programmation marchent", html: "<p>Si tu lis ceci, tu seras prevenue par email quand un post n'arrive pas a partir.</p>" }),
      });
      return json({ statut: r.status, reponse: (await r.text()).slice(0, 300) });
    }
    if (p === "/api/commentaires/passage" && request.method === "POST") {
      try {
        await passageCommentaires(env);
        return json({ ok: true });
      } catch (e) {
        return json({ erreur: String(e && e.message || e).slice(0, 300) }, 500);
      }
    }
    if (p === "/commentaires") return new Response(pageCommentaires(), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
    if (p === "/api/commentaires/vue") {
      const lire = async (nom) => { const r = await env.DB.prepare("SELECT valeur FROM reglages WHERE nom = ?1").bind(nom).first(); return r ? JSON.parse(r.valeur) : null; };
      const brut = (await lire("mots_cles")) || {};
      const { results } = await env.DB.prepare("SELECT date, action, regle, compte, commentaire FROM com_journal ORDER BY date DESC LIMIT 60").all();
      const dms = await env.DB.prepare("SELECT COUNT(*) AS n FROM com_journal WHERE action = 'dm_envoye' AND date >= ?1").bind(new Date(Date.now() - 7 * 86400000).toISOString()).first();
      return json({ actif: Boolean(await lire("com_actif")), dernier: await lire("com_dernier"), dms7: dms ? dms.n : 0,
        regles: (brut.regles || []).map((r) => ({ nom: r.nom, actif: r.actif, mots: r.mots, dm: r.dm, bouton: r.bouton })), journal: results });
    }
    if (p === "/api/commentaires") {
      const { results } = await env.DB.prepare("SELECT * FROM com_journal ORDER BY date DESC LIMIT 100").all();
      return json(results);
    }
    return new Response("Introuvable", { status: 404 });
  },
  async scheduled(event, env, ctx) {
    // Toutes les 2 minutes : d'abord ce qui doit etre publie, puis les commentaires,
    // avec ce qui reste des 50 appels permis par passage.
    ctx.waitUntil((async () => {
      appels = 0;
      try { await cron(env); } catch {}
      await passageCommentaires(env, Math.max(0, 48 - appels));
    })());
  },
};
