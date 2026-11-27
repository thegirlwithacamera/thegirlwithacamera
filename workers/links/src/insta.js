// Tableau de bord Instagram (prive).
//
// Les chiffres sont releves sur le Mac de Sandrine par
// ~/Developer/tableau-instagram/collecte.py (voie officielle Meta), puis
// deposes ici. Le jeton Meta ne vient jamais ici : seuls les chiffres arrivent.
//
//   POST /insta/depot        depot du releve (en-tete x-cle = cle de lecture)
//   GET  /insta?key=<cle>    le tableau de bord
//   GET  /insta.json?key=    les memes donnees, pour le media kit

function jourBruxelles() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Brussels" }).format(new Date());
}

export async function depot(request, env) {
  const cle = request.headers.get("x-cle") || "";
  if (!env.STATS_KEY || cle !== env.STATS_KEY) return new Response("Introuvable", { status: 404 });
  const texte = await request.text();
  if (texte.length > 1800000) return new Response("Trop gros", { status: 413 });
  let d;
  try {
    d = JSON.parse(texte);
  } catch {
    return new Response("Illisible", { status: 400 });
  }
  if (!d || !d.compte || !Array.isArray(d.posts)) return new Response("Incomplet", { status: 400 });

  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO releves (nom, corps, maj) VALUES ('insta', ?1, ?2) " +
        "ON CONFLICT (nom) DO UPDATE SET corps = ?1, maj = ?2",
    ).bind(texte, new Date().toISOString()),
    env.DB.prepare(
      "INSERT INTO abonnes (jour, n) VALUES (?1, ?2) ON CONFLICT (jour) DO UPDATE SET n = ?2",
    ).bind(jourBruxelles(), Number(d.compte.abonnes) || 0),
  ]);
  return new Response("ok");
}

// Code court d'un post (le bout apres /reel/ ou /p/ dans son lien).
function code(lien) {
  const m = /\/(?:reel|p|tv)\/([^/?#]+)/.exec(lien || "");
  return m ? m[1] : null;
}

export async function lire(env) {
  const releve = await env.DB.prepare("SELECT corps FROM releves WHERE nom = 'insta'").first();
  const { results } = await env.DB.prepare("SELECT jour, n FROM abonnes ORDER BY jour").all();
  const corr = (await env.DB.prepare("SELECT code, vues, portee FROM corrections").all()).results;
  const donnees = releve ? JSON.parse(releve.corps) : null;
  if (donnees && corr.length) {
    // Chiffres notes a la main depuis l'app, pour les reels pousses en pub par
    // un partenaire : Meta ne donne alors par l'acces officiel que la part sans pub.
    const parCode = new Map(corr.map((c) => [c.code, c]));
    for (const p of donnees.posts) {
      const c = parCode.get(code(p.lien));
      if (!c) continue;
      p.vues_meta = p.vues;
      p.portee_meta = p.portee;
      if (c.vues != null) p.vues = c.vues;
      if (c.portee != null) p.portee = c.portee;
      p.corrige = true;
    }
  }
  return { donnees, abonnes: results };
}

// Enregistre (ou efface) le chiffre de l'app pour un post.
export async function corriger(request, env) {
  let d;
  try {
    d = await request.json();
  } catch {
    return new Response("Illisible", { status: 400 });
  }
  const c = code(d.lien) || (typeof d.code === "string" && /^[\w-]{5,20}$/.test(d.code) ? d.code : null);
  if (!c) return new Response("Post inconnu", { status: 400 });
  const entier = (v) => (v === null || v === undefined || v === "" ? null : Math.max(0, Math.round(Number(v))) || null);
  const vues = entier(d.vues), portee = entier(d.portee);
  if (vues === null && portee === null) {
    await env.DB.prepare("DELETE FROM corrections WHERE code = ?1").bind(c).run();
  } else {
    await env.DB.prepare(
      "INSERT INTO corrections (code, vues, portee, maj) VALUES (?1, ?2, ?3, ?4) " +
        "ON CONFLICT (code) DO UPDATE SET vues = ?2, portee = ?3, maj = ?4",
    ).bind(c, vues, portee, new Date().toISOString()).run();
  }
  return Response.json({ ok: true, code: c, vues, portee });
}

export function page(tout, cle) {
  const json = JSON.stringify(tout).replace(/</g, "\\u003c");
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<meta name="referrer" content="no-referrer">
<title>Mes chiffres Instagram</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;1,400&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
body{margin:0;padding:26px 16px 70px;background:#fff;color:#111;font:14px/1.5 Inter,-apple-system,BlinkMacSystemFont,sans-serif}
main{max-width:720px;margin:0 auto}
a{color:inherit}
.sur{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#777}
h1{font:italic 34px/1.15 "EB Garamond",Georgia,serif;margin:6px 0 2px;font-weight:400}
.maj{color:#777;font-size:12px;margin:0 0 6px}
.nav{display:flex;gap:18px;font-size:12px;margin:0 0 26px}
.nav a{color:#777}
h2{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#777;font-weight:500;margin:38px 0 12px}
.grand{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}
.grand b{font:400 54px/1 "EB Garamond",Georgia,serif}
.grand span{color:#555}
.plus{color:#1c6b3a}.moins{color:#b02c1e}
.cases{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#e6e6e6;border:1px solid #e6e6e6}
.case{background:#fff;padding:14px 12px}
.case b{display:block;font:400 26px/1.1 "EB Garamond",Georgia,serif}
.case span{font-size:11px;color:#777}
svg.courbe{display:block;width:100%;height:90px;margin-top:10px}
.legende{display:flex;justify-content:space-between;font-size:11px;color:#777;margin-top:4px}
.onglets,.choix{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 10px}
button{font:inherit;font-size:12px;border:1px solid #d9d9d9;background:#fff;color:#111;padding:8px 12px;min-height:38px;cursor:pointer;border-radius:0}
button.on{background:#111;color:#fff;border-color:#111}
.choix button{border:none;padding:6px 8px;min-height:32px;color:#777}
.choix button.on{background:none;color:#111;text-decoration:underline;text-underline-offset:4px}
.resume{color:#555;margin:6px 0 14px}
.ligne{display:grid;grid-template-columns:52px 1fr;gap:12px;padding:12px 0;border-top:1px solid #e6e6e6;text-decoration:none}
.ligne img,.ligne .vide{width:52px;height:69px;object-fit:cover;background:#f1f1f1;display:block}
.texte{display:block;font:17px/1.25 "EB Garamond",Georgia,serif;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.meta{font-size:11px;color:#777;margin:2px 0 6px}
.badge{display:inline-block;background:#b02c1e;color:#fff;font-size:10px;letter-spacing:.06em;padding:1px 6px;margin-left:6px}
.chiffres{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:#555;font-variant-numeric:tabular-nums}
.chiffres b{color:#111;font-weight:500}
.chiffres .tri b{color:#b02c1e}
.vide-msg{color:#777;padding:16px 0;border-top:1px solid #e6e6e6}
.corr{display:inline-block;font-size:10px;letter-spacing:.06em;color:#777;border:1px solid #ccc;padding:0 5px;margin-left:6px}
.edit{background:none;border:none;color:#777;text-decoration:underline;text-underline-offset:3px;font-size:11px;padding:4px 0;min-height:30px;margin-top:2px}
.form{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:8px}
.form[hidden]{display:none}
.form input{font:inherit;font-size:13px;width:110px;padding:7px 8px;border:1px solid #ccc;border-radius:0}
.form button{min-height:34px;padding:6px 10px}
.form .aide{flex-basis:100%;font-size:11px;color:#777}
.alerte{background:#fbf1ef;color:#7a1f15;padding:10px 12px;font-size:12px;margin-top:20px}
@media(max-width:420px){.grand b{font-size:46px}.case b{font-size:22px}}
</style></head><body><main>
<div class="sur">The Girl With A Camera</div>
<h1>Mes chiffres Instagram</h1>
<p class="maj" id="maj"></p>
<div class="nav"><a href="/stats?key=${encodeURIComponent(cle)}">Clics du lien en bio</a></div>
<div id="app"></div>
</main>
<script id="d" type="application/json">${json}</script>
<script>
const T = JSON.parse(document.getElementById('d').textContent);
const D = T.donnees, H = T.abonnes || [];
const app = document.getElementById('app');
const nf = new Intl.NumberFormat('fr-BE');
const n = v => (v === null || v === undefined) ? '·' : nf.format(v);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const signe = v => (v > 0 ? '+' : '') + nf.format(v);
let onglet = 'reel', periode = 30, tri = 'vues';

function courbe(points, couleur) {
  if (points.length < 2) return '';
  const min = Math.min(...points), max = Math.max(...points), w = 700, h = 90, e = (max - min) || 1;
  const xy = points.map((v, i) => [(i / (points.length - 1)) * w, h - 6 - ((v - min) / e) * (h - 14)]);
  return '<svg class="courbe" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none"><polyline fill="none" stroke="' + couleur +
    '" stroke-width="2" vector-effect="non-scaling-stroke" points="' + xy.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') + '"/></svg>';
}
function barres(points) {
  if (!points.length) return '';
  const max = Math.max(1, ...points), w = 700, h = 90, pas = w / points.length;
  return '<svg class="courbe" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">' + points.map((v, i) => {
    const hh = Math.max(1, (v / max) * (h - 6));
    return '<rect x="' + (i * pas + 1).toFixed(1) + '" y="' + (h - hh).toFixed(1) + '" width="' + Math.max(1, pas - 2).toFixed(1) + '" height="' + hh.toFixed(1) + '" fill="#111"/>';
  }).join('') + '</svg>';
}
function jourCourt(j) { const [a, m, d] = j.split('-'); return d + '/' + m; }

function haut() {
  const c = D.compte, t = D.totaux_28j || {};
  let h = '<h2>Abonnés</h2><div class="grand"><b>' + n(c.abonnes) + '</b>';
  if (t.nouveaux_abonnes != null) {
    const net = (t.nouveaux_abonnes || 0) - (t.desabonnes || 0);
    h += '<span><span class="' + (net >= 0 ? 'plus' : 'moins') + '">' + signe(net) + '</span> sur 28 jours (' + n(t.nouveaux_abonnes) + ' arrivés, ' + n(t.desabonnes || 0) + ' partis)</span>';
  }
  h += '</div>';
  if (H.length >= 2) {
    h += courbe(H.map(x => x.n), '#b02c1e') + '<div class="legende"><span>' + jourCourt(H[0].jour) + ' : ' + n(H[0].n) + '</span><span>' + jourCourt(H[H.length - 1].jour) + ' : ' + n(H[H.length - 1].n) + '</span></div>';
  } else {
    h += '<p class="maj">La courbe des abonnés se dessine à partir d\\'aujourd\\'hui, un point par jour.</p>';
  }
  h += '<h2>Les 28 derniers jours</h2><div class="cases">' + [
    ['Vues', t.views], ['Comptes touchés', t.reach], ['Interactions', t.total_interactions],
    ['Enregistrements', t.saves], ['Partages', t.shares], ['Visites du profil', t.profile_views],
  ].map(x => '<div class="case"><b>' + n(x[1]) + '</b><span>' + x[0] + '</span></div>').join('') + '</div>';
  const pj = (D.par_jour || []).filter(x => x.portee != null);
  if (pj.length) h += '<h2>Comptes touchés, jour par jour</h2>' + barres(pj.map(x => x.portee)) +
    '<div class="legende"><span>' + jourCourt(pj[0].jour) + '</span><span>' + jourCourt(pj[pj.length - 1].jour) + '</span></div>';
  return h;
}

function liste() {
  const depuis = periode ? Date.now() - periode * 86400000 : 0;
  let posts = D.posts.filter(p => new Date(p.date + 'Z').getTime() >= depuis);
  posts = onglet === 'essai' ? posts.filter(p => p.essai) : posts.filter(p => p.genre === onglet && !p.essai);
  posts.sort((a, b) => tri === 'date' ? (a.date < b.date ? 1 : -1) : ((b[tri] || 0) - (a[tri] || 0)));
  let h = '<h2>Ce qui marche</h2><div class="onglets">' +
    [['reel', 'Reels'], ['post', 'Posts'], ['essai', 'Reels d\\'essai']].map(o => '<button data-o="' + o[0] + '" class="' + (onglet === o[0] ? 'on' : '') + '">' + o[1] + '</button>').join('') + '</div>' +
    '<div class="choix">' + [[7, '7 jours'], [30, '30 jours'], [90, '90 jours'], [0, 'Tout']].map(o => '<button data-p="' + o[0] + '" class="' + (periode === o[0] ? 'on' : '') + '">' + o[1] + '</button>').join('') + '</div>' +
    '<div class="choix">' + [['vues', 'Vues'], ['enregistrements', 'Enregistrements'], ['partages', 'Partages'], ['portee', 'Portée'], ['date', 'Date']].map(o => '<button data-t="' + o[0] + '" class="' + (tri === o[0] ? 'on' : '') + '">' + o[1] + '</button>').join('') + '</div>';
  if (onglet === 'essai' && posts.length) {
    const gagnants = posts.filter(p => (p.vues || 0) >= 2000).length;
    h += '<p class="resume">' + posts.length + ' essais sur la période, <b>' + gagnants + '</b> au-dessus de 2 000 vues.</p>';
  }
  if (!posts.length) return h + '<div class="vide-msg">Rien sur cette période.</div>';
  h += posts.slice(0, 60).map(p => {
    const c = (k, nom, v) => '<span class="' + (tri === k ? 'tri' : '') + '"><b>' + n(v) + '</b> ' + nom + '</span>';
    const date = new Date(p.date + 'Z').toLocaleDateString('fr-BE', { day: 'numeric', month: 'short' });
    const lien = '<a href="' + esc(p.lien) + '" target="_blank" rel="noopener noreferrer"';
    return '<div class="ligne">' + lien + '>' +
      (p.image ? '<img loading="lazy" referrerpolicy="no-referrer" src="' + esc(p.image) + '" alt="">' : '<span class="vide"></span>') + '</a>' +
      '<span>' + lien + ' style="text-decoration:none"><span class="texte">' + (esc(p.texte) || 'Sans texte') + '</span></a>' +
      '<span class="meta">' + date + (p.son ? ' · ' + p.son : '') + (p.duree_moyenne_s ? ' · regardé ' + String(p.duree_moyenne_s).replace('.', ',') + ' s en moyenne' : '') +
      ((p.essai && (p.vues || 0) >= 2000) ? '<span class="badge">2K+</span>' : '') +
      (p.corrige ? '<span class="corr">CHIFFRE DE L\\'APP</span>' : '') + '</span>' +
      '<span class="chiffres">' + c('vues', 'vues', p.vues) + c('enregistrements', 'enreg.', p.enregistrements) + c('partages', 'partages', p.partages) + c('portee', 'portée', p.portee) + '<span><b>' + n(p.likes) + '</b> likes</span></span>' +
      '<button class="edit" data-edit="' + esc(p.lien) + '">' + (p.corrige ? 'Modifier le chiffre de l\\'app' : 'Corriger avec le chiffre de l\\'app') + '</button>' +
      '<span class="form" data-form="' + esc(p.lien) + '" hidden>' +
      '<input inputmode="numeric" placeholder="Vues" value="' + (p.corrige && p.vues != null ? p.vues : '') + '">' +
      '<input inputmode="numeric" placeholder="Comptes touchés" value="' + (p.corrige && p.portee != null ? p.portee : '') + '">' +
      '<button data-save="' + esc(p.lien) + '">Enregistrer</button>' +
      '<span class="aide">Les chiffres de l\\'app, dans Voir les statistiques. Videz les deux cases pour revenir au chiffre de Meta' + (p.corrige ? ' (' + n(p.vues_meta) + ' vues)' : '') + '.</span>' +
      '</span></span></div>';
  }).join('');
  if (posts.length > 60) h += '<div class="vide-msg">Les 60 premiers sur ' + posts.length + '.</div>';
  return h;
}

function dessiner() {
  if (!D) { app.innerHTML = '<p>Aucun relevé pour l\\'instant.</p>'; return; }
  document.getElementById('maj').textContent = '@' + D.compte.pseudo + ' · relevé du ' + new Date(D.releve).toLocaleString('fr-BE', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  app.innerHTML = haut() + '<div id="liste">' + liste() + '</div>' +
    ((D.alertes || []).length ? '<div class="alerte">Certains chiffres n\\'ont pas pu être lus : ' + esc(D.alertes.join(' ; ')) + '</div>' : '');
}
const CLE = new URLSearchParams(location.search).get('key') || '';
app.addEventListener('click', async e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.edit) {
    const f = [...document.querySelectorAll('[data-form]')].find(x => x.dataset.form === b.dataset.edit);
    if (f) { f.hidden = !f.hidden; if (!f.hidden) f.querySelector('input').focus(); }
    return;
  }
  if (b.dataset.save) {
    const f = b.closest('.form'), [v, r] = f.querySelectorAll('input');
    const chiffre = s => s.value.replace(/[^0-9]/g, '');
    b.disabled = true; b.textContent = '...';
    try {
      const rep = await fetch('/insta/correction?key=' + encodeURIComponent(CLE), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ lien: b.dataset.save, vues: chiffre(v), portee: chiffre(r) }) });
      if (!rep.ok) throw 0;
      location.reload();
    } catch { b.disabled = false; b.textContent = 'Réessayer'; }
    return;
  }
  if (b.dataset.o) onglet = b.dataset.o;
  if (b.dataset.p !== undefined) periode = Number(b.dataset.p);
  if (b.dataset.t) tri = b.dataset.t;
  document.getElementById('liste').innerHTML = liste();
});
dessiner();
</script></body></html>`;
}

// Media kit : un extrait public des chiffres, sans rien de prive (pas de pays,
// pas de villes, pas de reels d'essai). Lu par la page /en/media-kit du site.
export function kit(tout) {
  const d = tout.donnees;
  if (!d) return null;
  const t = d.totaux_28j || {};
  const pct = (lignes) => {
    const total = (lignes || []).reduce((s, l) => s + (l[1] || 0), 0) || 1;
    return (lignes || []).map((l) => [l[0], Math.round((l[1] / total) * 1000) / 10]);
  };
  const depuis = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 16);
  const visibles = d.posts.filter((p) => p.genre === "reel" && !p.essai);
  const recents = visibles.filter((p) => p.date >= depuis);
  const trente = visibles.filter((p) => p.date >= new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 16));
  const moyenne = trente.length ? Math.round(trente.reduce((s, p) => s + (p.vues || 0), 0) / trente.length) : null;
  const ordreAges = ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
  return {
    releve: d.releve,
    abonnes: d.compte.abonnes,
    croissance_28j: t.nouveaux_abonnes != null ? (t.nouveaux_abonnes || 0) - (t.desabonnes || 0) : null,
    vues_28j: t.views ?? null,
    portee_28j: t.reach ?? null,
    interactions_28j: t.total_interactions ?? null,
    enregistrements_28j: t.saves ?? null,
    partages_28j: t.shares ?? null,
    visites_profil_28j: t.profile_views ?? null,
    vues_moyennes_reel_30j: moyenne,
    ages: pct((d.public && d.public.age) || []).sort((a, b) => ordreAges.indexOf(a[0]) - ordreAges.indexOf(b[0])),
    genres: pct((d.public && d.public.gender) || []),
    meilleurs_reels: recents
      .sort((a, b) => (b.vues || 0) - (a.vues || 0))
      .slice(0, 3)
      .map((p) => ({ texte: (p.texte || "").split(/\s#/)[0].slice(0, 90), vues: p.vues, lien: p.lien, date: p.date.slice(0, 10) })),
  };
}
