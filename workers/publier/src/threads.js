// Publication sur Threads (API officielle Meta, graph.threads.net).
//
// Le jeton de depart est pose par Sandrine elle-meme (secret THREADS_TOKEN).
// Il dure 60 jours : le cron le renouvelle chaque semaine et garde la nouvelle
// version chiffree dans D1 (jamais en clair, jamais affichee).

const API = "https://graph.threads.net/v1.0";

async function cleChiffrement(env) {
  const brut = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`threads|${env.CLE}`));
  return crypto.subtle.importKey("raw", brut, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function chiffrer(env, texte) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const c = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await cleChiffrement(env), new TextEncoder().encode(texte)));
  const tout = new Uint8Array(12 + c.length);
  tout.set(iv); tout.set(c, 12);
  return btoa(String.fromCharCode(...tout));
}

export async function dechiffrer(env, b64) {
  const tout = Uint8Array.from(atob(b64), (x) => x.charCodeAt(0));
  const p = await crypto.subtle.decrypt({ name: "AES-GCM", iv: tout.slice(0, 12) }, await cleChiffrement(env), tout.slice(12));
  return new TextDecoder().decode(p);
}

async function reglage(env, nom) {
  const r = await env.DB.prepare("SELECT valeur FROM reglages WHERE nom = ?1").bind(nom).first();
  return r ? JSON.parse(r.valeur) : null;
}

async function poser(env, nom, valeur) {
  await env.DB.prepare("INSERT INTO reglages (nom, valeur) VALUES (?1, ?2) ON CONFLICT (nom) DO UPDATE SET valeur = ?2")
    .bind(nom, JSON.stringify(valeur)).run();
}

export async function jeton(env) {
  const garde = await reglage(env, "threads_jeton");
  // Un nouveau secret pose par Sandrine remplace toujours l'ancien jeton garde.
  if (garde && garde.source === (env.THREADS_TOKEN || "").slice(-6)) {
    try { return await dechiffrer(env, garde.chiffre); } catch {}
  }
  return env.THREADS_TOKEN || null;
}

let compteur = () => {};
export function compter(f) { compteur = f; }

async function appel(env, chemin, params, methode = "GET") {
  compteur();
  const t = await jeton(env);
  if (!t) throw new Error("Threads n'est pas encore connecte.");
  const u = new URL(`${API}/${chemin}`);
  for (const [k, v] of Object.entries(params || {})) if (v != null) u.searchParams.set(k, String(v));
  const r = await fetch(u, { method: methode, headers: { authorization: `Bearer ${t}` } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.error) {
    const m = (d.error && (d.error.error_user_msg || d.error.message)) || `HTTP ${r.status}`;
    throw new Error(String(m).replaceAll(t, "[jeton]").slice(0, 300));
  }
  return d;
}

// Renouvelle le jeton une fois par semaine (il expire au bout de 60 jours).
export async function entretien(env) {
  if (!env.THREADS_TOKEN) return;
  const dernier = await reglage(env, "threads_renouvele");
  if (dernier && Date.now() - new Date(dernier).getTime() < 6 * 86400000) return;
  try {
    const t = await jeton(env);
    compteur();
    const r = await fetch(`https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=${encodeURIComponent(t)}`);
    const d = await r.json().catch(() => ({}));
    if (d.access_token) {
      await poser(env, "threads_jeton", { chiffre: await chiffrer(env, d.access_token), source: env.THREADS_TOKEN.slice(-6) });
      await poser(env, "threads_renouvele", new Date().toISOString());
      await poser(env, "threads_expire", new Date(Date.now() + (d.expires_in || 5184000) * 1000).toISOString());
    } else {
      await poser(env, "threads_erreur", String((d.error && d.error.message) || r.status).slice(0, 200));
    }
  } catch {}
}

export async function profil(env) {
  return appel(env, "me", { fields: "id,username" });
}

const estVideo = (cle) => /\.(mp4|mov|m4v)$/i.test(cle);

export async function creer(env, p) {
  const url = (cle) => `${env.PUBLIC_URL}/media/${cle}`;
  const medias = JSON.parse(p.medias || "[]");
  const texte = (p.legende || "").slice(0, 500);
  if (p.genre === "texte") {
    return { statut: "traitement", conteneur: (await appel(env, "me/threads", { media_type: "TEXT", text: texte }, "POST")).id };
  }
  if (p.genre === "photo" || p.genre === "video") {
    const v = estVideo(medias[0]);
    const c = await appel(env, "me/threads", { media_type: v ? "VIDEO" : "IMAGE", [v ? "video_url" : "image_url"]: url(medias[0]), text: texte }, "POST");
    return { statut: "traitement", conteneur: c.id };
  }
  const enfants = [];
  for (const cle of medias) {
    const v = estVideo(cle);
    enfants.push((await appel(env, "me/threads", { media_type: v ? "VIDEO" : "IMAGE", [v ? "video_url" : "image_url"]: url(cle), is_carousel_item: true }, "POST")).id);
  }
  return { statut: "enfants", enfants: JSON.stringify(enfants) };
}

export async function carrousel(env, p, enfants) {
  const c = await appel(env, "me/threads", { media_type: "CAROUSEL", children: enfants.join(","), text: (p.legende || "").slice(0, 500) }, "POST");
  return c.id;
}

export async function etat(env, conteneur) {
  const d = await appel(env, conteneur, { fields: "status,error_message" });
  const code = { IN_PROGRESS: "IN_PROGRESS", FINISHED: "FINISHED", PUBLISHED: "FINISHED", ERROR: "ERROR", EXPIRED: "EXPIRED" }[d.status] || d.status;
  return { code, detail: d.error_message };
}

export async function publier(env, conteneur) {
  const d = await appel(env, "me/threads_publish", { creation_id: conteneur }, "POST");
  let lien = null;
  try { lien = (await appel(env, d.id, { fields: "permalink" })).permalink || null; } catch {}
  return { id: d.id, lien };
}
