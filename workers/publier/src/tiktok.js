// Publication sur TikTok (Content Posting API, "Direct Post", voie officielle).
//
// Secrets du Worker : TT_CLIENT_KEY, TT_CLIENT_SECRET. La connexion au compte se fait
// une fois par /tiktok/connecter ; les jetons sont gardes chiffres dans D1.
// Tant que l'app n'a pas passe l'audit de TikTok, tout post sort en "moi seule" (SELF_ONLY).
// La video part en morceaux depuis R2 (FILE_UPLOAD), puis on suit son etat a chaque passage.

import { chiffrer, dechiffrer } from "./threads.js";

const API = "https://open.tiktokapis.com/v2";
const SCOPES = "user.info.basic,video.publish,video.upload";
const retour = (env) => `${env.PUBLIC_URL}/tiktok/retour`;
const MO = 1024 * 1024;

async function reglage(env, nom) {
  const r = await env.DB.prepare("SELECT valeur FROM reglages WHERE nom = ?1").bind(nom).first();
  return r ? JSON.parse(r.valeur) : null;
}
async function poser(env, nom, valeur) {
  await env.DB.prepare("INSERT INTO reglages (nom, valeur) VALUES (?1, ?2) ON CONFLICT (nom) DO UPDATE SET valeur = ?2")
    .bind(nom, JSON.stringify(valeur)).run();
}

let compteur = () => {};
export function compter(f) { compteur = f; }

async function jetons(env, corps) {
  compteur();
  const r = await fetch(`${API}/oauth/token/`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_key: env.TT_CLIENT_KEY, client_secret: env.TT_CLIENT_SECRET, ...corps }),
  });
  const d = await r.json().catch(() => ({}));
  if (!d.access_token) throw new Error(`TikTok refuse la connexion (${d.error_description || d.error || r.status})`);
  await poser(env, "tt_jeton", {
    acces: await chiffrer(env, d.access_token),
    renouv: await chiffrer(env, d.refresh_token),
    expire: Date.now() + (d.expires_in || 86400) * 1000,
    fin_renouv: Date.now() + (d.refresh_expires_in || 31536000) * 1000,
  });
  return d.access_token;
}

export async function connecter(env) {
  const etat = crypto.randomUUID();
  await poser(env, "tt_etat", { etat, quand: Date.now() });
  const u = new URL("https://www.tiktok.com/v2/auth/authorize/");
  u.search = new URLSearchParams({ client_key: env.TT_CLIENT_KEY, scope: SCOPES, response_type: "code", redirect_uri: retour(env), state: etat });
  return Response.redirect(u.toString(), 302);
}

export async function retourTiktok(env, url) {
  const page = (t) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font:16px -apple-system,sans-serif;padding:40px;max-width:520px">${t}</body>`, { headers: { "content-type": "text/html; charset=utf-8" } });
  const e = await reglage(env, "tt_etat");
  if (!e || e.etat !== url.searchParams.get("state") || Date.now() - e.quand > 15 * 60000) return page("Lien expire. Recommence depuis la page de programmation.");
  if (!url.searchParams.get("code")) return page("Connexion annulee.");
  try {
    await jetons(env, { grant_type: "authorization_code", code: url.searchParams.get("code"), redirect_uri: retour(env) });
    const u = await api(env, "user/info/?fields=open_id,display_name,avatar_url", null, "GET");
    await poser(env, "tt_compte", { nom: u.user?.display_name || "", avatar: u.user?.avatar_url || "" });
  } catch (err) {
    return page(String(err.message));
  }
  await poser(env, "tt_etat", null);
  return page("TikTok est connecte. Tu peux fermer cette page.");
}

async function acces(env) {
  const g = await reglage(env, "tt_jeton");
  if (!g) throw new Error("TikTok n'est pas encore connecte.");
  if (Date.now() < g.expire - 10 * 60000) return dechiffrer(env, g.acces);
  if (Date.now() > g.fin_renouv) throw new Error("La connexion TikTok a expire, reconnecte ton compte.");
  return jetons(env, { grant_type: "refresh_token", refresh_token: await dechiffrer(env, g.renouv) });
}

async function api(env, chemin, corps, methode = "POST") {
  const t = await acces(env);
  compteur();
  const r = await fetch(`${API}/${chemin}`, {
    method: methode,
    headers: { authorization: `Bearer ${t}`, "content-type": "application/json; charset=UTF-8" },
    body: methode === "POST" ? JSON.stringify(corps || {}) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || (d.error && d.error.code && d.error.code !== "ok")) throw new Error(`TikTok refuse (${d.error?.code || r.status}) ${String(d.error?.message || "").slice(0, 200)}`);
  return d.data || {};
}

export async function etatConnexion(env) {
  return { connecte: Boolean(await reglage(env, "tt_jeton")), compte: (await reglage(env, "tt_compte"))?.nom || "" };
}

// Ce que le compte permet avant un post (TikTok demande de le montrer a chaque fois).
export async function createur(env) {
  const d = await api(env, "post/publish/creator_info/query/");
  return {
    nom: d.creator_nickname || d.creator_username || "",
    avatar: d.creator_avatar_url || "",
    confidentialites: d.privacy_level_options || ["SELF_ONLY"],
    commentaires_off: Boolean(d.comment_disabled),
    duo_off: Boolean(d.duet_disabled),
    collage_off: Boolean(d.stitch_disabled),
    duree_max: d.max_video_post_duration_sec || 600,
  };
}

// Etape 1 : annonce la video, puis l'envoie en morceaux depuis R2. Renvoie l'id de publication.
export async function envoyer(env, p) {
  const extra = JSON.parse(p.extra || "{}");
  const cle = JSON.parse(p.medias)[0];
  const tete = await env.R2.head(`planning/${cle}`);
  if (!tete) throw new Error("Fichier video introuvable");
  const taille = tete.size;
  const morceau = taille <= 64 * MO ? taille : 32 * MO;
  const nombre = Math.max(1, Math.floor(taille / morceau));
  const options = (await createur(env)).confidentialites;
  const prive = options.includes(extra.confidentialite) ? extra.confidentialite : (options.includes("SELF_ONLY") ? "SELF_ONLY" : options[0]);
  const post = {
    title: String(p.legende || "").slice(0, 2200),
    privacy_level: prive,
    disable_comment: extra.commentaires === false,
    disable_duet: extra.duo === false,
    disable_stitch: extra.collage === false,
  };
  if (Number.isFinite(p.couverture)) post.video_cover_timestamp_ms = Math.max(0, Math.round(p.couverture));
  const d = await api(env, "post/publish/video/init/", {
    post_info: post,
    source_info: { source: "FILE_UPLOAD", video_size: taille, chunk_size: morceau, total_chunk_count: nombre },
  });
  for (let i = 0; i < nombre; i++) {
    const debut = i * morceau;
    const fin = i === nombre - 1 ? taille : debut + morceau;
    const o = await env.R2.get(`planning/${cle}`, { range: { offset: debut, length: fin - debut } });
    const { readable, writable } = new FixedLengthStream(fin - debut);
    o.body.pipeTo(writable);
    compteur();
    const r = await fetch(d.upload_url, {
      method: "PUT",
      headers: { "content-type": /\.mov$/.test(cle) ? "video/quicktime" : "video/mp4", "content-range": `bytes ${debut}-${fin - 1}/${taille}` },
      body: readable,
    });
    if (!r.ok) throw new Error(`Envoi TikTok interrompu (${r.status}) ${(await r.text()).slice(0, 200)}`);
  }
  return d.publish_id;
}

// Etape 2 : ou en est la publication.
export async function etat(env, id, compte) {
  const d = await api(env, "post/publish/status/fetch/", { publish_id: id });
  if (d.status === "FAILED") return { code: "ERROR", detail: d.fail_reason || "echec" };
  if (d.status !== "PUBLISH_COMPLETE") return { code: "IN_PROGRESS" };
  const vid = (d.publicaly_available_post_id || [])[0];
  return { code: "FINISHED", id: vid ? String(vid) : id, lien: vid && compte ? `https://www.tiktok.com/@${compte}/video/${vid}` : null };
}
