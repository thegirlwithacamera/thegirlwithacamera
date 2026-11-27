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

const GRAPH = "https://graph.facebook.com/v25.0";
const GENRES = ["essai", "reel", "photo", "carrousel"];

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
  try {
    if (p.statut === "prevu") {
      await maj(env, p.id, await creerConteneurs(env, p));
      return;
    }
    if (p.statut === "enfants") {
      const enfants = JSON.parse(p.enfants || "[]");
      for (const e of enfants) {
        const s = await etat(env, e);
        if (s.code === "ERROR" || s.code === "EXPIRED") throw new Error(`Un element du carrousel est refuse par Meta (${s.detail || s.code})`);
        if (s.code !== "FINISHED") return attendre(env, p);
      }
      const c = await meta(env, `${env.IG_ID}/media`, { media_type: "CAROUSEL", children: enfants.join(","), caption: p.legende || "" });
      await maj(env, p.id, { statut: "traitement", conteneur: c.id });
      return;
    }
    if (p.statut === "traitement") {
      const s = await etat(env, p.conteneur);
      if (s.code === "ERROR" || s.code === "EXPIRED") throw new Error(`Meta refuse le fichier (${s.detail || s.code})`);
      if (s.code !== "FINISHED") return attendre(env, p);
      const r = await publier(env, p.conteneur);
      await maj(env, p.id, { statut: "publie", resultat: r.id, lien: r.lien, erreur: null });
    }
  } catch (e) {
    const essais = (p.essais || 0) + 1;
    // Une erreur de Meta sur un fichier ne s'arrange pas en retentant : on s'arrete tout de suite.
    const definitive = /refuse|format|aspect|duration|resolution|invalid/i.test(e.message);
    await maj(env, p.id, essais >= 3 || definitive
      ? { statut: "erreur", erreur: e.message, essais }
      : { erreur: e.message, essais });
  }
}

async function attendre(env, p) {
  // Meta prepare la video. Au dela de 2 heures, on abandonne.
  if (Date.now() - new Date(p.quand).getTime() > 2 * 3600 * 1000) {
    await maj(env, p.id, { statut: "erreur", erreur: "Meta n'a pas fini de preparer la video en 2 heures." });
  }
}

async function cron(env) {
  if (!env.META_TOKEN) return;
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
    for (const cle of JSON.parse(v.medias)) await env.R2.delete(`planning/${cle}`);
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
    if (!GENRES.includes(p.genre)) return json({ erreur: `Type inconnu : ${p.genre}` }, 400);
    const medias = (p.medias || []).filter((c) => /^[0-9a-f-]{36}\.(mp4|mov|m4v|jpg|png)$/.test(c));
    if (!medias.length) return json({ erreur: "Aucun fichier" }, 400);
    if ((p.genre === "essai" || p.genre === "reel") && !estVideo(medias[0])) return json({ erreur: "Un reel demande une video." }, 400);
    if (p.genre === "photo" && !/\.jpg$/.test(medias[0])) return json({ erreur: "Instagram n'accepte que le JPEG pour les photos." }, 400);
    if (p.genre === "carrousel" && (medias.length < 2 || medias.length > 10)) return json({ erreur: "Un carrousel prend de 2 a 10 fichiers." }, 400);
    const quand = new Date(p.quand);
    if (isNaN(quand)) return json({ erreur: "Date illisible" }, 400);
    const id = crypto.randomUUID();
    await env.DB.prepare(
      "INSERT INTO planning (id, reseau, genre, legende, medias, quand, statut, couverture, essais, cree, maj) " +
        "VALUES (?1, 'instagram', ?2, ?3, ?4, ?5, 'prevu', ?6, 0, ?7, ?7)",
    ).bind(id, p.genre, String(p.legende || "").slice(0, 2200), JSON.stringify(medias), quand.toISOString(),
      p.couverture ?? null, maintenant()).run();
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
</style></head><body><main>
<div class="sur">The Girl With A Camera</div>
<h1>Programmation</h1>
<div class="carte">
  <div class="ligne2">
    <div><label>Type</label><select id="genre">
      <option value="essai">Reel d'essai</option><option value="reel">Reel</option>
      <option value="photo">Photo</option><option value="carrousel">Carrousel</option></select></div>
    <div><label>Réseau</label><select disabled><option>Instagram</option></select></div>
  </div>
  <label>Fichiers</label><input type="file" id="fichiers" multiple accept="video/mp4,video/quicktime,image/jpeg,image/png">
  <div class="aide" id="aideFichiers">Plusieurs vidéos = un reel par vidéo, espacés comme tu le choisis.</div>
  <label>Légende commune</label><textarea id="legende" placeholder="Reprise sous chaque vidéo, modifiable une par une"></textarea>
  <div class="ligne2">
    <div><label>Premier à</label><input type="datetime-local" id="quand"></div>
    <div><label>Puis toutes les (minutes)</label><input type="number" id="intervalle" value="60" min="5"></div>
  </div>
  <div id="liste-fichiers"></div>
  <div style="margin-top:16px"><button id="go">Programmer</button></div>
  <div class="barre" id="barre" hidden><span></span></div>
  <div id="msg" class="aide"></div>
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

(function () { const d = new Date(Date.now() + 3600e3); d.setMinutes(0, 0, 0); q('#quand').value = new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16); })();

function dessinerFichiers() {
  const g = q('#genre').value, groupe = g === 'carrousel' || g === 'photo';
  q('#liste-fichiers').innerHTML = groupe ? '' : fichiers.map((f, i) =>
    '<div class="fichier">' + (f.type.startsWith('video') ? '<video muted src="' + f.apercu + '"></video>' : '<img src="' + f.apercu + '">') +
    '<div><div class="meta">' + esc(f.name) + '</div><textarea data-i="' + i + '" placeholder="Légende de ce post (vide = légende commune)">' + esc(f.legende || '') + '</textarea></div></div>').join('');
}
q('#fichiers').addEventListener('change', e => { fichiers = [...e.target.files].map(f => Object.assign(f, { apercu: URL.createObjectURL(f) })); dessinerFichiers(); });
q('#genre').addEventListener('change', dessinerFichiers);
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
  const g = q('#genre').value, msg = q('#msg');
  if (!fichiers.length) { msg.textContent = 'Choisis au moins un fichier.'; return; }
  const debut = new Date(q('#quand').value);
  if (isNaN(debut)) { msg.textContent = 'Choisis une date.'; return; }
  const total = fichiers.reduce((s, f) => s + f.size, 0); let fait = 0;
  q('#go').disabled = true; q('#barre').hidden = false; msg.textContent = 'Envoi des fichiers…';
  try {
    const cles = [];
    for (const f of fichiers) { const avant = fait; cles.push(await envoyer(f, x => { fait = avant + x; q('#barre span').style.width = (fait / total * 100) + '%'; })); }
    const commun = q('#legende').value, pas = Math.max(5, Number(q('#intervalle').value) || 60) * 6e4;
    const posts = (g === 'carrousel' || g === 'photo')
      ? (g === 'carrousel' ? [{ genre: g, medias: cles, legende: commun, quand: debut.toISOString() }]
        : cles.map((c, i) => ({ genre: g, medias: [c], legende: commun, quand: new Date(+debut + i * pas).toISOString() })))
      : cles.map((c, i) => ({ genre: g, medias: [c], legende: fichiers[i].legende || commun, quand: new Date(+debut + i * pas).toISOString() }));
    const r = await (await api('/api/posts', { method: 'POST', body: JSON.stringify({ posts }) })).json();
    if (r.erreur) throw new Error(r.erreur);
    msg.textContent = posts.length + (posts.length > 1 ? ' posts programmés.' : ' post programmé.');
    fichiers = []; q('#fichiers').value = ''; q('#legende').value = ''; dessinerFichiers(); charger();
  } catch (e) { msg.textContent = e.message; }
  q('#go').disabled = false; setTimeout(() => { q('#barre').hidden = true; q('#barre span').style.width = 0; }, 800);
});

const NOMS = { essai: "Reel d'essai", reel: 'Reel', photo: 'Photo', carrousel: 'Carrousel' };
const ST = { prevu: 'prévu', traitement: 'en cours', enfants: 'en cours', publie: 'publié', erreur: 'erreur' };
async function charger() {
  const posts = await (await api('/api/posts')).json();
  if (!posts.length) { q('#posts').innerHTML = '<p class="vide">Rien de programmé.</p>'; return; }
  let jour = '', h = '';
  for (const p of posts) {
    const d = new Date(p.quand), j = d.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' });
    if (j !== jour) { h += '<div class="jour">' + j + '</div>'; jour = j; }
    const m = p.medias[0], src = '/media/' + m;
    h += '<div class="post">' + (/\\.(mp4|mov|m4v)$/.test(m) ? '<video muted preload="metadata" src="' + src + '#t=1"></video>' : '<img src="' + src + '">') +
      '<div><div class="meta">' + d.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }) + ' · ' + NOMS[p.genre] + (p.medias.length > 1 ? ' · ' + p.medias.length + ' fichiers' : '') +
      '<span class="st ' + p.statut + '">' + ST[p.statut] + '</span></div><div class="leg">' + (esc(p.legende) || '<span class="vide">Sans légende</span>') + '</div>' +
      (p.erreur && p.statut === 'erreur' ? '<div class="err">' + esc(p.erreur) + '</div>' : '') +
      (p.lien ? '<a class="meta" href="' + esc(p.lien) + '" target="_blank" rel="noopener">Voir sur Instagram</a>' : '') + '</div><div>' +
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
charger(); setInterval(charger, 60000);
</script></body></html>`;
}

// ---------------------------------------------------------------- routes

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    if (p.startsWith("/media/")) return media(env, url);
    if (!autorise(env, url)) return new Response("Introuvable", { status: 404 });
    if (p === "/") return new Response(page(), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
    if (p.startsWith("/api/envoi/")) return envoi(request, env, url, p.split("/")[3]);
    if (p === "/api/posts" && request.method === "GET") return json(await liste(env));
    if (p === "/api/posts" && request.method === "POST") return programmer(request, env);
    const m = /^\/api\/posts\/([0-9a-f-]{36})\/(supprimer|relancer)$/.exec(p);
    if (m && request.method === "POST") {
      if (m[2] === "supprimer") {
        const r = await env.DB.prepare("SELECT medias FROM planning WHERE id = ?1 AND statut = 'prevu'").bind(m[1]).first();
        if (r) {
          for (const cle of JSON.parse(r.medias)) await env.R2.delete(`planning/${cle}`);
          await env.DB.prepare("DELETE FROM planning WHERE id = ?1").bind(m[1]).run();
        }
      } else {
        await env.DB.prepare("UPDATE planning SET statut = 'prevu', erreur = NULL, essais = 0, conteneur = NULL, enfants = NULL, quand = ?1 WHERE id = ?2 AND statut = 'erreur'")
          .bind(maintenant(), m[1]).run();
      }
      return json({ ok: true });
    }
    if (p === "/api/etat") return json({ jeton: Boolean(env.META_TOKEN) });
    if (p === "/api/commentaires/passage" && request.method === "POST") {
      try {
        await passageCommentaires(env);
        return json({ ok: true });
      } catch (e) {
        return json({ erreur: String(e && e.message || e).slice(0, 300) }, 500);
      }
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
