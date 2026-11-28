// Publication sur Pinterest (API v5, voie officielle).
//
// Secrets du Worker : PIN_APP_ID, PIN_APP_SECRET. La connexion au compte se fait
// une fois par /pinterest/connecter ; les jetons sont gardes chiffres dans D1.
// Tant que l'app est en acces "Trial", Pinterest n'accepte que le bac a sable
// (api-sandbox), ou les epingles ne sont visibles que par Sandrine.
// Variable PIN_API : "https://api-sandbox.pinterest.com" ou "https://api.pinterest.com".

import { chiffrer, dechiffrer } from "./threads.js";

const SCOPES = "boards:read,boards:write,pins:read,pins:write,user_accounts:read";
const retour = (env) => `${env.PUBLIC_URL}/pinterest/retour`;
const base = (env) => env.PIN_API || "https://api-sandbox.pinterest.com";

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

const basic = (env) => "Basic " + btoa(`${env.PIN_APP_ID}:${env.PIN_APP_SECRET}`);

async function jetons(env, corps) {
  compteur();
  const r = await fetch("https://api.pinterest.com/v5/oauth/token", {
    method: "POST",
    headers: { authorization: basic(env), "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(corps),
  });
  const d = await r.json().catch(() => ({}));
  if (!d.access_token) throw new Error(`Pinterest refuse la connexion (${d.message || r.status})`);
  await poser(env, "pin_jeton", {
    acces: await chiffrer(env, d.access_token),
    renouv: d.refresh_token ? await chiffrer(env, d.refresh_token) : (await reglage(env, "pin_jeton") || {}).renouv,
    expire: Date.now() + (d.expires_in || 2592000) * 1000,
  });
  return d.access_token;
}

export async function connecter(env) {
  const etat = crypto.randomUUID();
  await poser(env, "pin_etat", { etat, quand: Date.now() });
  const u = new URL("https://www.pinterest.com/oauth/");
  u.search = new URLSearchParams({ client_id: env.PIN_APP_ID, redirect_uri: retour(env), response_type: "code", scope: SCOPES, state: etat });
  return Response.redirect(u.toString(), 302);
}

export async function retourPinterest(env, url) {
  const page = (t) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font:16px -apple-system,sans-serif;padding:40px;max-width:520px">${t}</body>`, { headers: { "content-type": "text/html; charset=utf-8" } });
  const e = await reglage(env, "pin_etat");
  if (!e || e.etat !== url.searchParams.get("state") || Date.now() - e.quand > 15 * 60000) return page("Lien expire. Recommence depuis la page de programmation.");
  if (!url.searchParams.get("code")) return page("Connexion annulee.");
  try {
    await jetons(env, { grant_type: "authorization_code", code: url.searchParams.get("code"), redirect_uri: retour(env), continuous_refresh: "true" });
  } catch (err) {
    return page(String(err.message));
  }
  await poser(env, "pin_etat", null);
  return page("Pinterest est connecte. Tu peux fermer cette page.");
}

async function acces(env) {
  const g = await reglage(env, "pin_jeton");
  if (!g) throw new Error("Pinterest n'est pas encore connecte.");
  if (Date.now() < g.expire - 3 * 86400000) return dechiffrer(env, g.acces);
  return jetons(env, { grant_type: "refresh_token", refresh_token: await dechiffrer(env, g.renouv), continuous_refresh: "true" });
}

async function api(env, chemin, corps) {
  const t = await acces(env);
  compteur();
  const r = await fetch(`${base(env)}/v5/${chemin}`, {
    method: corps ? "POST" : "GET",
    headers: { authorization: `Bearer ${t}`, "content-type": "application/json" },
    body: corps ? JSON.stringify(corps) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Pinterest refuse (${r.status}) ${String(d.message || "").slice(0, 200)}`);
  return d;
}

export async function etatConnexion(env) {
  return { connecte: Boolean(await reglage(env, "pin_jeton")), bac_a_sable: base(env).includes("sandbox") };
}

export async function tableaux(env) {
  const d = await api(env, "boards?page_size=100");
  return (d.items || []).map((b) => ({ id: b.id, nom: b.name }));
}

export async function creerTableau(env, nom) {
  const d = await api(env, "boards", { name: String(nom).slice(0, 50), privacy: "PUBLIC" });
  return { id: d.id, nom: d.name };
}

// Une epingle : la premiere ligne de la legende devient le titre, le reste la description.
export async function publier(env, p) {
  const extra = JSON.parse(p.extra || "{}");
  if (!extra.tableau) throw new Error("Aucun tableau Pinterest choisi");
  const cle = JSON.parse(p.medias)[0];
  const lignes = String(p.legende || "").split("\n");
  const corps = {
    board_id: extra.tableau,
    title: (lignes[0] || "").slice(0, 100),
    description: lignes.slice(1).join("\n").trim().slice(0, 800),
    alt_text: (lignes[0] || "").slice(0, 500),
    media_source: { source_type: "image_url", url: `${env.PUBLIC_URL}/media/${cle}` },
  };
  if (extra.lien) corps.link = extra.lien;
  const d = await api(env, "pins", corps);
  return { id: d.id, lien: `https://www.pinterest.com/pin/${d.id}/` };
}
