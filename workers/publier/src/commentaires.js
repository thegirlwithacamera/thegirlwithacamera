// Machine a commentaires, en ligne (remplace la version qui tournait sur le Mac).
//
// Quelqu'un commente un mot cle sous un post ou un reel : la machine envoie un
// DM (reponse privee, avec un bouton) et repond en public sous le commentaire.
// Voie officielle Meta, meme jeton que la programmation (secret META_TOKEN).
//
// Regles : la table reglages (nom = 'mots_cles'), copiee depuis
// machine-commentaires/mots_cles.json par regles.sh.
//
// Limite Cloudflare gratuite : 50 appels sortants par passage. Chaque passage
// lit les 50 derniers posts, plus 3 pages plus anciennes a tour de role : un
// commentaire sur un vieux post est vu en moins d'une demi-heure.

const GRAPH = "https://graph.facebook.com/v25.0";
const FENETRE_JOURS = 7; // Meta refuse une reponse privee apres 7 jours
// Machine allumee le 27/11/2026 a 10h28, Bruxelles : rien d'ecrit avant ne compte.
const ACTIVATION = Date.parse("2026-11-27T09:28:00Z");
const PAGES_ANCIENNES = 3;
const MAX_MEDIAS = 10;
const MAX_ENVOIS = 6;

class ErreurMeta extends Error {}

function compteur() {
  let n = 0;
  return { plus: () => ++n, reste: (max) => max - n };
}

async function meta(env, budget, chemin, { corps, form, url } = {}) {
  budget.plus();
  const init = { headers: { authorization: `Bearer ${env.META_TOKEN}` } };
  if (corps) {
    init.method = "POST";
    init.headers["content-type"] = "application/json";
    init.body = JSON.stringify(corps);
  } else if (form) {
    init.method = "POST";
    init.body = new URLSearchParams(form);
  }
  const r = await fetch(url || `${GRAPH}/${chemin}`, init);
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.error) {
    const m = (d.error && d.error.message) || `HTTP ${r.status}`;
    throw new ErreurMeta(String(m).replaceAll(env.META_TOKEN || "§", "[jeton]").slice(0, 300));
  }
  return d;
}

const normaliser = (t) => (t || "").normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
const echapper = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function regles(brut) {
  const out = [];
  for (const r of (brut && brut.regles) || []) {
    if (!r.actif) continue;
    const mots = (r.mots || []).map((m) => normaliser(m).trim()).filter(Boolean);
    const dm = (r.dm || "").trim();
    if (!mots.length || !dm) continue;
    const b = r.bouton || {};
    const bouton = b.titre && /^https:\/\//.test(b.lien || "") && b.titre.length <= 20 && dm.length <= 640 ? { titre: b.titre, lien: b.lien } : null;
    out.push({
      nom: r.nom || "regle",
      motifs: mots.map((m) => new RegExp(`(?<![\\p{L}\\p{N}_])${echapper(m)}(?![\\p{L}\\p{N}_])`, "u")),
      dm,
      bouton,
      reponses: (r.reponses_publiques || []).filter((x) => x.trim()),
      medias: new Set((r.medias || []).map(String)),
    });
  }
  return out;
}

function trouver(rs, texte, media) {
  const t = normaliser(texte);
  return rs.find((r) => (!r.medias.size || r.medias.has(String(media))) && r.motifs.some((m) => m.test(t))) || null;
}

async function lire(env, nom, defaut) {
  const r = await env.DB.prepare("SELECT valeur FROM reglages WHERE nom = ?1").bind(nom).first();
  return r ? JSON.parse(r.valeur) : defaut;
}
async function ecrire(env, nom, valeur) {
  await env.DB.prepare("INSERT INTO reglages (nom, valeur) VALUES (?1, ?2) ON CONFLICT (nom) DO UPDATE SET valeur = ?2")
    .bind(nom, JSON.stringify(valeur)).run();
}
async function journal(env, action, c, regle = "", detail = "") {
  await env.DB.prepare(
    "INSERT INTO com_journal (date, action, regle, compte, commentaire, id_commentaire, id_media, detail) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
  ).bind(new Date().toISOString(), action, regle, c.username || "", (c.text || "").slice(0, 200), c.id || "", c.media_id || "", String(detail).slice(0, 300)).run();
}
const fait = (env, id) => env.DB.prepare("INSERT OR IGNORE INTO com_faits (id, quand) VALUES (?1, ?2)").bind(String(id), Date.now()).run();

async function envoyerDM(env, budget, compteId, idc, regle) {
  const destinataire = { comment_id: idc };
  if (regle.bouton) {
    try {
      await meta(env, budget, `${compteId}/messages`, { corps: { recipient: destinataire, message: { attachment: { type: "template", payload: {
        template_type: "button", text: regle.dm, buttons: [{ type: "web_url", url: regle.bouton.lien, title: regle.bouton.titre }] } } } } });
      return "bouton";
    } catch {
      const texte = regle.dm.includes(regle.bouton.lien) ? regle.dm : `${regle.dm}\n${regle.bouton.lien}`;
      await meta(env, budget, `${compteId}/messages`, { corps: { recipient: destinataire, message: { text: texte } } });
      return "texte";
    }
  }
  await meta(env, budget, `${compteId}/messages`, { corps: { recipient: destinataire, message: { text: regle.dm } } });
  return "texte";
}

export async function passageCommentaires(env) {
  if (!env.META_TOKEN) return;
  if (!(await lire(env, "com_actif", false))) return; // allumee seulement apres la reprise depuis le Mac
  const budget = compteur();
  const rs = regles(await lire(env, "mots_cles", null));
  if (!rs.length) return;
  const compteId = env.IG_ID;
  let pseudo = await lire(env, "com_pseudo", null);
  if (!pseudo) {
    pseudo = (await meta(env, budget, `${compteId}?fields=username`)).username;
    await ecrire(env, "com_pseudo", pseudo);
  }

  // 1. Les posts a regarder : les 50 derniers, puis des pages plus anciennes a tour de role.
  const champs = "id,comments_count,timestamp";
  const medias = [];
  const p1 = await meta(env, budget, `${compteId}/media?fields=${champs}&limit=50`);
  medias.push(...(p1.data || []));
  let suite = await lire(env, "com_curseur", null);
  for (let i = 0; i < PAGES_ANCIENNES; i++) {
    const url = suite || (p1.paging && p1.paging.next);
    if (!url) break;
    const p = await meta(env, budget, "", { url });
    medias.push(...(p.data || []));
    suite = (p.paging && p.paging.next) || null;
    if (!suite) break;
  }
  await ecrire(env, "com_curseur", suite);

  // 2. Ceux dont le nombre de commentaires a bouge.
  const ids = medias.map((m) => String(m.id));
  const connus = new Map();
  for (let i = 0; i < ids.length; i += 90) {
    const lot = ids.slice(i, i + 90);
    const { results } = await env.DB.prepare(`SELECT media, n FROM com_compteurs WHERE media IN (${lot.map((_, j) => `?${j + 1}`).join(",")})`).bind(...lot).all();
    for (const r of results) connus.set(r.media, r.n);
  }
  const limite = Date.now() - FENETRE_JOURS * 86400000;
  const aVoir = [];
  for (const m of medias) {
    const n = m.comments_count || 0, id = String(m.id);
    if (!n || connus.get(id) === n) continue;
    if (!connus.has(id) && Date.parse(m.timestamp) < limite) {
      // Vieux post vu pour la premiere fois : on note son compte, seuls les commentaires suivants comptent.
      await env.DB.prepare("INSERT OR REPLACE INTO com_compteurs (media, n) VALUES (?1, ?2)").bind(id, n).run();
      continue;
    }
    aVoir.push({ id, n });
  }

  // 3. Les commentaires de ces posts.
  let envois = 0, tour = await lire(env, "com_tour", 0);
  for (const m of aVoir.slice(0, MAX_MEDIAS)) {
    if (budget.reste(50) < 4) break;
    let complet = true;
    const page = await meta(env, budget, `${m.id}/comments?fields=id,text,username,timestamp,from&limit=50`);
    for (const c of page.data || []) {
      c.media_id = m.id;
      const deja = await env.DB.prepare("SELECT 1 FROM com_faits WHERE id = ?1").bind(String(c.id)).first();
      if (deja) continue;
      const auteur = c.username || (c.from && c.from.username) || "";
      c.username = auteur;
      if (auteur === pseudo || (c.from && String(c.from.id) === String(compteId))) { await fait(env, c.id); continue; }
      const regle = trouver(rs, c.text, m.id);
      if (!regle) { await fait(env, c.id); continue; }
      const quand = Date.parse(c.timestamp || "");
      if (quand && (quand < ACTIVATION || quand < limite)) { await fait(env, c.id); await journal(env, "ignore_trop_vieux", c, regle.nom); continue; }
      if (envois >= MAX_ENVOIS || budget.reste(50) < 3) { complet = false; break; }
      try {
        const forme = await envoyerDM(env, budget, compteId, String(c.id), regle);
        await fait(env, c.id);
        envois++;
        await journal(env, "dm_envoye", c, regle.nom, regle.bouton ? forme : "");
        if (regle.reponses.length) {
          const rep = regle.reponses[tour % regle.reponses.length];
          tour++;
          try {
            await meta(env, budget, `${c.id}/replies`, { form: { message: rep } });
            await journal(env, "reponse_publique", c, regle.nom, rep);
          } catch (e) {
            await journal(env, "erreur_reponse_publique", c, regle.nom, e.message);
          }
        }
      } catch (e) {
        const k = `essais_${c.id}`;
        const essais = (await lire(env, k, 0)) + 1;
        await ecrire(env, k, essais);
        if (essais >= 3) await fait(env, c.id); else complet = false;
        await journal(env, "erreur_dm", c, regle.nom, `essai ${essais} : ${e.message}`);
      }
    }
    if (complet) await env.DB.prepare("INSERT OR REPLACE INTO com_compteurs (media, n) VALUES (?1, ?2)").bind(m.id, m.n).run();
  }
  await ecrire(env, "com_tour", tour);
  // Menage : on oublie les commentaires traites il y a plus de 30 jours.
  await env.DB.prepare("DELETE FROM com_faits WHERE quand < ?1").bind(Date.now() - 30 * 86400000).run();
}
