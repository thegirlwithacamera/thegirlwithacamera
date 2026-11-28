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
    if (!TYPES[ext]) return json({ erreur: "Format accepte : mp4, mov, jpg, png." }, 400);
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
    if (!({ threads: GENRES_THREADS, youtube: GENRES_YOUTUBE, pinterest: GENRES_PINTEREST, tiktok: GENRES_TIKTOK }[reseau] || GENRES).includes(p.genre)) return json({ erreur: `Type inconnu pour ${reseau} : ${p.genre}` }, 400);
    const medias = (p.medias || []).filter((c) => /^[0-9a-f-]{36}\.(mp4|mov|m4v|jpg|png)$/.test(c));
    if (p.genre === "texte") {
      if (!String(p.legende || "").trim()) return json({ erreur: "Un post texte demande un texte." }, 400);
      if (String(p.legende).length > 500) return json({ erreur: "Threads limite un post a 500 caracteres." }, 400);
    } else if (!medias.length) return json({ erreur: "Aucun fichier" }, 400);
    if (reseau === "threads" && String(p.legende || "").length > 500) return json({ erreur: "Threads limite le texte a 500 caracteres." }, 400);
    if (reseau === "youtube" && !String(p.legende || "").split("\n")[0].trim()) return json({ erreur: "Sur YouTube, la premiere ligne de la legende sert de titre." }, 400);
    let extra = null;
    if (reseau === "pinterest") {
      if (!p.tableau) return json({ erreur: "Choisis un tableau Pinterest." }, 400);
      if (!/\.jpg$/.test(medias[0])) return json({ erreur: "Une epingle demande une photo." }, 400);
      if (p.lien && !/^https:\/\//.test(p.lien)) return json({ erreur: "Le lien doit commencer par https://" }, 400);
      extra = JSON.stringify({ tableau: String(p.tableau), lien: p.lien || "" });
    }
    if (reseau === "tiktok") {
      const brouillon = p.mode === "brouillon";
      if (!brouillon && !p.confidentialite) return json({ erreur: "Choisis qui peut voir la video sur TikTok." }, 400);
      extra = JSON.stringify({ mode: brouillon ? "brouillon" : "direct", confidentialite: String(p.confidentialite), commentaires: p.commentaires !== false, duo: p.duo !== false, collage: p.collage !== false });
    }
    if (p.genre === "video" && !estVideo(medias[0])) return json({ erreur: "Une video demande un fichier video." }, 400);
    if (reseau === "threads" && p.genre === "carrousel" && medias.length > 20) return json({ erreur: "Threads prend 20 fichiers au plus." }, 400);
    if ((p.genre === "essai" || p.genre === "reel") && !estVideo(medias[0])) return json({ erreur: "Un reel demande une video." }, 400);
    if (p.genre === "photo" && !/\.jpg$/.test(medias[0])) return json({ erreur: "Instagram n'accepte que le JPEG pour les photos." }, 400);
    if (p.genre === "carrousel" && (medias.length < 2 || (reseau === "instagram" && medias.length > 10))) return json({ erreur: "Un carrousel prend de 2 a 10 fichiers." }, 400);
    const quand = new Date(p.quand);
    if (isNaN(quand)) return json({ erreur: "Date illisible" }, 400);
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
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta name="referrer" content="no-referrer">
<title>Programmation</title>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital@0;1&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}body{margin:0;padding:26px 16px 80px;font:14px/1.5 Inter,-apple-system,sans-serif;color:#111;background:#fff}
main{max-width:760px;margin:0 auto}
.sur{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#777}
h1{font:italic 34px/1.15 "EB Garamond",Georgia,serif;margin:6px 0 22px;font-weight:400}
h2{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#777;font-weight:500;margin:34px 0 12px}
.carte{border:1px solid #e6e6e6;padding:16px}
label{display:block;font-size:12px;color:#555;margin:12px 0 4px}
select,input,textarea{font:inherit;width:100%;padding:9px 10px;border:1px solid #ccc;border-radius:0;background:#fff}
textarea{min-height:70px;resize:vertical}
.ligne2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
button{font:inherit;font-size:12px;letter-spacing:.08em;text-transform:uppercase;border:1px solid #111;background:#111;color:#fff;padding:12px 18px;min-height:44px;cursor:pointer;border-radius:0}
button.leger{background:#fff;color:#111;text-transform:none;letter-spacing:0;padding:6px 10px;min-height:32px}
button:disabled{opacity:.5}
.fichier{display:grid;grid-template-columns:64px 1fr;gap:10px;margin-top:10px;align-items:start}
.fichier video,.fichier img{width:64px;height:85px;object-fit:cover;background:#f1f1f1}
.aide{font-size:11px;color:#777;margin-top:4px}
.jour{font:italic 20px "EB Garamond",Georgia,serif;margin:22px 0 6px}
.post{display:grid;grid-template-columns:52px 1fr auto;gap:12px;padding:10px 0;border-top:1px solid #eee;align-items:start}
.post video,.post img{width:52px;height:69px;object-fit:cover;background:#f1f1f1}
.meta{font-size:11px;color:#777}
.leg{font-size:13px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.st{font-size:10px;letter-spacing:.06em;text-transform:uppercase;padding:1px 6px;border:1px solid #ccc;color:#555;margin-left:6px}
.st.publie{border-color:#1c6b3a;color:#1c6b3a}.st.erreur{border-color:#b02c1e;color:#b02c1e}
.err{color:#b02c1e;font-size:12px}
.barre{height:4px;background:#eee;margin-top:10px}.barre span{display:block;height:100%;width:0;background:#111}
.vide{color:#777}
.texte{width:52px;height:69px;background:#f1f1f1;display:flex;align-items:center;justify-content:center;font:italic 20px "EB Garamond",Georgia,serif;color:#777}
.coche{display:flex;align-items:center;gap:8px;font-size:14px;margin:6px 0;text-transform:none;letter-spacing:0;color:inherit}.coche input{width:auto;margin:0}[hidden]{display:none!important}
</style></head><body><main>
<div class="sur">The Girl With A Camera</div>
<h1>Programmation</h1>
<div class="carte">
  <div class="ligne2">
    <div><label>Type</label><select id="genre" data-x="">
      <option value="essai">Reel d'essai</option><option value="reel">Reel</option>
      <option value="photo">Photo</option><option value="carrousel">Carrousel</option></select></div>
    <div><label>Réseau</label><select id="reseau"><option value="instagram">Instagram</option><option value="threads">Threads</option><option value="youtube">YouTube</option><option value="pinterest">Pinterest</option><option value="tiktok">TikTok</option></select></div>
  </div>
  <div id="blocFichiers"><label>Fichiers</label><input type="file" id="fichiers" multiple accept="video/mp4,video/quicktime,image/jpeg,image/png">
  <div class="aide" id="aideFichiers">Plusieurs vidéos = un reel par vidéo, espacés comme tu le choisis.</div></div>
  <label id="titreLegende">Légende commune</label><textarea id="legende" placeholder="Reprise sous chaque vidéo, modifiable une par une"></textarea>
  <div class="ligne2">
    <div><label>Premier à</label><input type="datetime-local" id="quand"></div>
    <div><label>Puis toutes les (minutes)</label><input type="number" id="intervalle" value="60" min="5"></div>
  </div>
  <div id="blocPin" hidden>
    <div class="ligne2">
      <div><label>Tableau</label><select id="tableau"><option value="">Chargement…</option></select></div>
      <div><label>Lien de l'épingle</label><input id="lienPin" placeholder="https://www.thegirlwithacamera.com/en/store/..."></div>
    </div>
    <div class="aide"><a href="#" id="nouveauTableau">Créer un tableau</a></div>
    <div class="ligne2" id="blocTableau" hidden><div><input id="nomTableau" placeholder="Nom du nouveau tableau"></div><div><button class="leger" id="creerTableau">Créer</button></div></div>
  </div>
  <div id="blocTt" hidden>
    <div class="aide" id="ttCompte"></div>
    <label>Comment</label><select id="ttMode"><option value="direct">Publier directement</option><option value="brouillon">Envoyer en brouillon dans l'app TikTok</option></select>
    <div class="ligne2" id="ttDirect">
      <div><label>Qui peut voir la vidéo</label><select id="ttPriv"><option value="">Choisir…</option></select></div>
      <div><label>Autoriser</label>
        <label class="coche"><input type="checkbox" id="ttCom"> Commentaires</label>
        <label class="coche"><input type="checkbox" id="ttDuo"> Duo</label>
        <label class="coche"><input type="checkbox" id="ttCol"> Collage</label></div>
    </div>
    <div class="aide">En publiant, tu acceptes la <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener">Music Usage Confirmation</a> de TikTok.</div>
  </div>
  <div id="liste-fichiers"></div>
  <div style="margin-top:16px"><button id="go">Programmer</button></div>
  <div class="barre" id="barre" hidden><span></span></div>
  <div id="msg" class="aide"></div>
  <div id="ytCo" class="aide" hidden></div>
  <div id="pinCo" class="aide" hidden></div>
  <div id="ttCo" class="aide" hidden></div>
</div>
<h2>Au programme</h2>
<div id="posts"><p class="vide">Chargement…</p></div>
</main>
<script>
const CLE = new URLSearchParams(location.search).get('key') || '';
const q = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const api = (chemin, opts = {}) => fetch(chemin + (chemin.includes('?') ? '&' : '?') + 'key=' + encodeURIComponent(CLE), opts);
let fichiers = [];
const TYPES_RESEAU = {
  instagram: [['essai', "Reel d'essai"], ['reel', 'Reel'], ['photo', 'Photo'], ['carrousel', 'Carrousel']],
  threads: [['texte', 'Texte seul'], ['photo', 'Photo'], ['video', 'Vidéo'], ['carrousel', 'Carrousel']],
  youtube: [['video', 'Vidéo (Short si verticale et courte)']],
  pinterest: [['epingle', 'Épingle photo']],
  tiktok: [['video', 'Vidéo']],
};
function majReseau() {
  const r = q('#reseau').value;
  q('#genre').innerHTML = TYPES_RESEAU[r].map(([v, n]) => '<option value="' + v + '">' + n + '</option>').join('');
  majGenre();
}
function majGenre() {
  const r = q('#reseau').value, g = q('#genre').value, texte = g === 'texte';
  q('#blocFichiers').hidden = texte;
  q('#titreLegende').textContent = texte ? 'Texte (500 signes max)' : (r === 'threads' ? 'Texte (500 signes max)' : (r === 'youtube' || r === 'pinterest') ? 'Titre sur la 1re ligne, puis la description' : 'Légende commune');
  q('#blocPin').hidden = r !== 'pinterest';
  q('#pinCo').hidden = r !== 'pinterest';
  if (r === 'pinterest') chargerTableaux();
  q('#ytCo').hidden = r !== 'youtube';
  q('#blocTt').hidden = q('#ttCo').hidden = r !== 'tiktok';
  if (r === 'tiktok') chargerCreateur();
  q('#aideFichiers').textContent = g === 'carrousel' ? 'Toutes les photos et vidéos choisies forment un seul carrousel.' :
    'Plusieurs fichiers = un post par fichier, espacés comme tu le choisis.';
  if (texte) { fichiers = []; q('#fichiers').value = ''; }
  dessinerFichiers();
}
q('#reseau').addEventListener('change', majReseau);

(function () { const d = new Date(Date.now() + 3600e3); d.setMinutes(0, 0, 0); q('#quand').value = new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16); })();

function dessinerFichiers() {
  const g = q('#genre').value, groupe = g === 'carrousel' || g === 'photo';
  q('#liste-fichiers').innerHTML = groupe ? '' : fichiers.map((f, i) =>
    '<div class="fichier">' + (f.type.startsWith('video') ? '<video muted src="' + f.apercu + '"></video>' : '<img src="' + f.apercu + '">') +
    '<div><div class="meta">' + esc(f.name) + '</div><textarea data-i="' + i + '" placeholder="Légende de ce post (vide = légende commune)">' + esc(f.legende || '') + '</textarea></div></div>').join('');
}
q('#fichiers').addEventListener('change', e => { fichiers = [...e.target.files].map(f => Object.assign(f, { apercu: URL.createObjectURL(f) })); dessinerFichiers(); });
q('#genre').addEventListener('change', majGenre);
q('#liste-fichiers').addEventListener('input', e => { if (e.target.dataset.i) fichiers[e.target.dataset.i].legende = e.target.value; });

async function envoyer(f, progres) {
  const ext = f.name.split('.').pop().toLowerCase();
  const d = await (await api('/api/envoi/debut?ext=' + ext, { method: 'POST' })).json();
  if (d.erreur) throw new Error(d.erreur);
  const TAILLE = 20 * 1024 * 1024, parts = [];
  for (let n = 1, pos = 0; pos < f.size; n++, pos += TAILLE) {
    const r = await api('/api/envoi/morceau?cle=' + d.cle + '&uploadId=' + encodeURIComponent(d.uploadId) + '&n=' + n, { method: 'PUT', body: f.slice(pos, pos + TAILLE) });
    if (!r.ok) throw new Error('Envoi interrompu, réessaie.');
    parts.push(await r.json()); progres(Math.min(f.size, pos + TAILLE));
  }
  const fin = await api('/api/envoi/fin?cle=' + d.cle + '&uploadId=' + encodeURIComponent(d.uploadId), { method: 'POST', body: JSON.stringify({ parts }) });
  if (!fin.ok) throw new Error('Envoi non terminé, réessaie.');
  return d.cle;
}

q('#go').addEventListener('click', async () => {
  const g = q('#genre').value, msg = q('#msg'), reseau = q('#reseau').value;
  if (g === 'texte') {
    const t = q('#legende').value.trim(), d0 = new Date(q('#quand').value);
    if (!t) { msg.textContent = 'Écris le texte.'; return; }
    if (isNaN(d0)) { msg.textContent = 'Choisis une date.'; return; }
    const r = await (await api('/api/posts', { method: 'POST', body: JSON.stringify({ posts: [{ reseau, genre: g, medias: [], legende: t, quand: d0.toISOString() }] }) })).json();
    msg.textContent = r.erreur || 'Post programmé.';
    if (!r.erreur) { q('#legende').value = ''; charger(); }
    return;
  }
  if (!fichiers.length) { msg.textContent = 'Choisis au moins un fichier.'; return; }
  const debut = new Date(q('#quand').value);
  if (isNaN(debut)) { msg.textContent = 'Choisis une date.'; return; }
  const total = fichiers.reduce((s, f) => s + f.size, 0); let fait = 0;
  q('#go').disabled = true; q('#barre').hidden = false; msg.textContent = 'Envoi des fichiers…';
  try {
    const cles = [];
    for (const f of fichiers) { const avant = fait; cles.push(await envoyer(f, x => { fait = avant + x; q('#barre span').style.width = (fait / total * 100) + '%'; })); }
    const commun = q('#legende').value, pas = Math.max(5, Number(q('#intervalle').value) || 60) * 6e4;
    let posts = (g === 'carrousel' || g === 'photo' || g === 'epingle')
      ? (g === 'carrousel' ? [{ genre: g, medias: cles, legende: commun, quand: debut.toISOString() }]
        : cles.map((c, i) => ({ genre: g, medias: [c], legende: commun, quand: new Date(+debut + i * pas).toISOString() })))
      : cles.map((c, i) => ({ genre: g, medias: [c], legende: fichiers[i].legende || commun, quand: new Date(+debut + i * pas).toISOString() }));
    posts = posts.map(p => Object.assign(p, { reseau }, reseau === 'pinterest' ? { genre: 'epingle', tableau: q('#tableau').value, lien: q('#lienPin').value.trim() } : {},
      reseau === 'tiktok' ? { mode: q('#ttMode').value, confidentialite: q('#ttPriv').value, commentaires: q('#ttCom').checked, duo: q('#ttDuo').checked, collage: q('#ttCol').checked } : {}));
    const r = await (await api('/api/posts', { method: 'POST', body: JSON.stringify({ posts }) })).json();
    if (r.erreur) throw new Error(r.erreur);
    msg.textContent = posts.length + (posts.length > 1 ? ' posts programmés.' : ' post programmé.');
    fichiers = []; q('#fichiers').value = ''; q('#legende').value = ''; dessinerFichiers(); charger();
  } catch (e) { msg.textContent = e.message; }
  q('#go').disabled = false; setTimeout(() => { q('#barre').hidden = true; q('#barre span').style.width = 0; }, 800);
});

const NOMS = { essai: "Reel d'essai", reel: 'Reel', photo: 'Photo', carrousel: 'Carrousel', texte: 'Texte', video: 'Vidéo', epingle: 'Épingle' };
const ST = { prevu: 'prévu', traitement: 'en cours', enfants: 'en cours', publie: 'publié', erreur: 'erreur' };
async function charger() {
  const posts = await (await api('/api/posts')).json();
  if (!posts.length) { q('#posts').innerHTML = '<p class="vide">Rien de programmé.</p>'; return; }
  let jour = '', h = '';
  for (const p of posts) {
    const d = new Date(p.quand), j = d.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' });
    if (j !== jour) { h += '<div class="jour">' + j + '</div>'; jour = j; }
    const m = p.medias[0], src = '/media/' + m, res = { threads: 'Threads', youtube: 'YouTube', pinterest: 'Pinterest', tiktok: 'TikTok' }[p.reseau] || 'Instagram';
    h += '<div class="post">' + (!m ? '<div class="texte">Aa</div>' : /\\.(mp4|mov|m4v)$/.test(m) ? '<video muted preload="metadata" src="' + src + '#t=1"></video>' : '<img src="' + src + '">') +
      '<div><div class="meta">' + d.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }) + ' · ' + res + ' · ' + NOMS[p.genre] + (p.medias.length > 1 ? ' · ' + p.medias.length + ' fichiers' : '') +
      '<span class="st ' + p.statut + '">' + ST[p.statut] + '</span></div><div class="leg">' + (esc(p.legende) || '<span class="vide">Sans légende</span>') + '</div>' +
      (p.erreur && p.statut === 'erreur' ? '<div class="err">' + esc(p.erreur) + '</div>' : '') +
      (p.lien ? '<a class="meta" href="' + esc(p.lien) + '" target="_blank" rel="noopener">Voir sur ' + res + '</a>' : '') + '</div><div>' +
      (p.statut === 'prevu' ? '<button class="leger" data-sup="' + p.id + '">Retirer</button>' : '') +
      (p.statut === 'erreur' ? '<button class="leger" data-rel="' + p.id + '">Réessayer</button>' : '') + '</div></div>';
  }
  q('#posts').innerHTML = h;
}
q('#posts').addEventListener('click', async e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.sup && !confirmRetrait(b)) return;
  b.disabled = true;
  await api('/api/posts/' + (b.dataset.sup || b.dataset.rel) + '/' + (b.dataset.sup ? 'supprimer' : 'relancer'), { method: 'POST' });
  charger();
});
function confirmRetrait(b) { if (b.dataset.ok) return true; b.dataset.ok = 1; b.textContent = 'Confirmer'; setTimeout(() => { delete b.dataset.ok; b.textContent = 'Retirer'; }, 4000); return false; }
majReseau(); charger(); setInterval(charger, 60000);
const PRIV = { PUBLIC_TO_EVERYONE: 'Tout le monde', MUTUAL_FOLLOW_FRIENDS: 'Amis', FOLLOWER_OF_CREATOR: 'Abonnés', SELF_ONLY: 'Moi seule' };
q('#ttMode').addEventListener('change', () => { q('#ttDirect').hidden = q('#ttMode').value === 'brouillon'; });
async function chargerCreateur() {
  const c = await (await api('/api/tiktok/createur')).json();
  if (c.erreur) { q('#ttCompte').textContent = c.erreur; return; }
  q('#ttCompte').innerHTML = (c.avatar ? '<img src="' + esc(c.avatar) + '" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:6px">' : '') + 'Publié sur le compte ' + esc(c.nom) + ' · vidéos de ' + Math.round(c.duree_max / 60) + ' min max';
  q('#ttPriv').innerHTML = '<option value="">Choisir…</option>' + c.confidentialites.map(v => '<option value="' + esc(v) + '">' + esc(PRIV[v] || v) + '</option>').join('');
  [['#ttCom', c.commentaires_off], ['#ttDuo', c.duo_off], ['#ttCol', c.collage_off]].forEach(([s, off]) => { q(s).disabled = off; if (off) q(s).checked = false; });
}
async function chargerTableaux() {
  const r = await (await api('/api/pinterest/tableaux')).json();
  q('#tableau').innerHTML = r.erreur ? '<option value="">' + esc(r.erreur) + '</option>' : (r.length ? r.map(b => '<option value="' + esc(b.id) + '">' + esc(b.nom) + '</option>').join('') : '<option value="">Aucun tableau</option>');
}
q('#nouveauTableau').addEventListener('click', e => { e.preventDefault(); q('#blocTableau').hidden = false; q('#nomTableau').focus(); });
q('#creerTableau').addEventListener('click', async e => { e.preventDefault(); const nom = q('#nomTableau').value.trim(); if (!nom) return; const r = await (await api('/api/pinterest/tableaux', { method: 'POST', body: JSON.stringify({ nom }) })).json(); q('#nomTableau').value = ''; q('#blocTableau').hidden = true; await chargerTableaux(); if (r.id) q('#tableau').value = r.id; });
api('/api/etat').then(r => r.json()).then(e => { const pn = e.pinterest || {}; q('#pinCo').innerHTML = (pn.connecte ? 'Pinterest connecté' + (pn.bac_a_sable ? ' (mode test : épingles visibles par toi seule)' : '') + '. ' : '') + '<a href="/pinterest/connecter?key=' + encodeURIComponent(CLE) + '">' + (pn.connecte ? 'Reconnecter' : 'Connecter mon compte Pinterest') + '</a>'; });
api('/api/etat').then(r => r.json()).then(e => { const y = e.youtube || {}; q('#ytCo').innerHTML = y.connecte ? 'YouTube connecté' + (y.chaine ? ' : ' + esc(y.chaine) : '') + (y.souci ? ' (' + esc(y.souci) + ')' : '') + '. <a href="/youtube/connecter?key=' + encodeURIComponent(CLE) + '">Changer de chaîne</a>' : '<a href="/youtube/connecter?key=' + encodeURIComponent(CLE) + '">Connecter ma chaîne YouTube</a>'; });
api('/api/etat').then(r => r.json()).then(e => { const t = e.tiktok || {}; q('#ttCo').innerHTML = (t.connecte ? 'TikTok connecté' + (t.compte ? ' : ' + esc(t.compte) : '') + '. ' : '') + '<a href="/tiktok/connecter?key=' + encodeURIComponent(CLE) + '">' + (t.connecte ? 'Reconnecter' : 'Connecter mon compte TikTok') + '</a>'; });
</script></body></html>`;
}

// ---------------------------------------------------------------- routes

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    if (p.startsWith("/media/")) return media(env, url);
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
