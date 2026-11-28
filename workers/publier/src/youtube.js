// Publication sur YouTube (YouTube Data API v3, voie officielle Google).
//
// Les cles du client OAuth (YT_CLIENT_ID, YT_CLIENT_SECRET) sont des secrets du
// Worker. La connexion a la chaine se fait une fois par /youtube/connecter :
// Google renvoie un jeton de renouvellement, garde chiffre dans D1.

import { chiffrer, dechiffrer } from "./threads.js";

const SCOPES = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly";
const retour = (env) => `${env.PUBLIC_URL}/youtube/retour`;

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

// Etape 1 : envoie Sandrine sur l'ecran d'autorisation Google.
export async function connecter(env) {
  const etat = crypto.randomUUID();
  await poser(env, "yt_etat", { etat, quand: Date.now() });
  const u = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  u.search = new URLSearchParams({
    client_id: env.YT_CLIENT_ID, redirect_uri: retour(env), response_type: "code", scope: SCOPES,
    access_type: "offline", prompt: "consent", include_granted_scopes: "true", state: etat,
  });
  return Response.redirect(u.toString(), 302);
}

// Etape 2 : Google revient ici avec un code, echange contre les jetons.
export async function retourGoogle(env, url) {
  const page = (t) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font:16px -apple-system,sans-serif;padding:40px;max-width:520px">${t}</body>`, { headers: { "content-type": "text/html; charset=utf-8" } });
  const e = await reglage(env, "yt_etat");
  if (!e || e.etat !== url.searchParams.get("state") || Date.now() - e.quand > 15 * 60000) return page("Lien expire. Recommence depuis la page de programmation.");
  if (url.searchParams.get("error")) return page("Connexion annulee.");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({ code: url.searchParams.get("code") || "", client_id: env.YT_CLIENT_ID, client_secret: env.YT_CLIENT_SECRET, redirect_uri: retour(env), grant_type: "authorization_code" }),
  });
  const d = await r.json().catch(() => ({}));
  if (!d.refresh_token) return page("Google n'a pas donne de jeton. Recommence la connexion.");
  await poser(env, "yt_jeton", { chiffre: await chiffrer(env, d.refresh_token) });
  await poser(env, "yt_etat", null);
  let nom = "";
  try {
    const c = await (await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", { headers: { authorization: `Bearer ${d.access_token}` } })).json();
    nom = (c.items && c.items[0] && c.items[0].snippet.title) || "";
    await poser(env, "yt_chaine", nom);
  } catch {}
  return page(`YouTube est connecte${nom ? ` a la chaine <b>${nom.replace(/[<>&]/g, "")}</b>` : ""}. Tu peux fermer cette page.`);
}

async function acces(env) {
  const g = await reglage(env, "yt_jeton");
  if (!g) throw new Error("YouTube n'est pas encore connecte.");
  compteur();
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({ client_id: env.YT_CLIENT_ID, client_secret: env.YT_CLIENT_SECRET, refresh_token: await dechiffrer(env, g.chiffre), grant_type: "refresh_token" }),
  });
  const d = await r.json().catch(() => ({}));
  if (!d.access_token) throw new Error("Google refuse le jeton : reconnecte YouTube depuis la page de programmation.");
  return d.access_token;
}

export async function etatConnexion(env) {
  return { connecte: Boolean(await reglage(env, "yt_jeton")), chaine: await reglage(env, "yt_chaine") };
}

// Publie une video : la premiere ligne de la legende devient le titre, le reste la description.
export async function publier(env, p) {
  const cle = JSON.parse(p.medias)[0];
  const o = await env.R2.get(`planning/${cle}`);
  if (!o) throw new Error("Fichier video introuvable");
  const t = await acces(env);
  const lignes = String(p.legende || "").split("\n");
  const titre = (lignes[0] || "Untitled").slice(0, 100);
  const description = lignes.slice(1).join("\n").trim().slice(0, 4900);
  compteur();
  const init = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
    method: "POST",
    headers: { authorization: `Bearer ${t}`, "content-type": "application/json; charset=UTF-8", "x-upload-content-length": String(o.size), "x-upload-content-type": "video/*" },
    body: JSON.stringify({
      snippet: { title: titre, description, categoryId: "19" },
      status: { privacyStatus: "public", selfDeclaredMadeForKids: false },
    }),
  });
  if (!init.ok) throw new Error(`YouTube refuse la video (${init.status}) ${(await init.text()).slice(0, 200)}`);
  const lieu = init.headers.get("location");
  compteur();
  const { readable, writable } = new FixedLengthStream(o.size);
  o.body.pipeTo(writable);
  const up = await fetch(lieu, { method: "PUT", headers: { "content-type": "video/*" }, body: readable });
  const d = await up.json().catch(() => ({}));
  if (!up.ok || !d.id) throw new Error(`Envoi YouTube interrompu (${up.status}) ${JSON.stringify(d.error || {}).slice(0, 200)}`);
  return { id: d.id, lien: `https://youtu.be/${d.id}` };
}
