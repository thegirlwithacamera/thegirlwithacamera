// Private scheduling page, "strawberry matcha" look, in English, with a month calendar.
// Plain string (String.raw): the browser script below never uses backticks or ${ }.

export function pageProgrammation() {
  return String.raw`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta name="referrer" content="no-referrer">
<title>My social media planner · The Girl with a Camera</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
/* Strawberry matcha: matcha greens for structure, strawberry pinks for accents, white background. */
:root{--bg:#ffffff;--panel:#ffffff;--ink:#2c3622;--muted:#7b8870;--line:#e5ecda;
--matcha:#6f8f4e;--matcha-deep:#4e6a34;--matcha-mid:#c5d6aa;--matcha-soft:#f1f6e8;
--fraise:#e0566f;--fraise-deep:#b8324c;--fraise-mid:#f4b1bd;--fraise-soft:#fdecef;--on:#fff;
--display:"Cormorant Garamond","Didot",Georgia,serif;--body:"Inter",-apple-system,"Helvetica Neue",Arial,sans-serif}
@media (prefers-color-scheme:dark){:root{--bg:#141a10;--panel:#1b2316;--ink:#eef3e6;--muted:#a9b79c;--line:#2c3824;
--matcha:#a8c585;--matcha-deep:#c5dca7;--matcha-mid:#3d5030;--matcha-soft:#212c1b;--fraise:#ff8a9e;--fraise-deep:#ffb0bd;--fraise-mid:#7a3443;--fraise-soft:#2d1a1f;--on:#141a10;color-scheme:dark}}
*{box-sizing:border-box}[hidden]{display:none!important}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.6 var(--body)}
main{max-width:1240px;margin:0 auto;padding:52px max(20px,env(safe-area-inset-left)) 80px}
a{color:var(--fraise-deep)}
.hero{display:flex;flex-wrap:wrap;gap:28px 48px;align-items:flex-end;justify-content:space-between}
.sur{font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--fraise);font-weight:600}
.sur i{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--matcha);margin:0 8px 1px 0;box-shadow:12px 0 0 var(--fraise)}
.sur i+span{margin-left:12px}
h1{font-family:var(--display);font-weight:500;font-size:clamp(42px,7vw,80px);line-height:.92;margin:12px 0 14px;letter-spacing:-.01em;color:var(--matcha-deep)}
h1 em{color:var(--fraise)}
.lead{color:var(--muted);max-width:46ch;margin:0}
.stats{display:flex;gap:34px}
.stat b{display:block;font-family:var(--display);font-weight:500;font-size:46px;line-height:1;font-variant-numeric:lining-nums tabular-nums}
.stat span{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.stat.a b{color:var(--matcha)}.stat.b b{color:var(--fraise)}.stat.c b{color:var(--fraise-deep)}
.rang{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin:40px 0 44px}
.rang>*{width:100%;aspect-ratio:2/3;object-fit:cover;border-radius:14px;display:block;background:var(--matcha-soft)}
@media(max-width:640px){.rang{grid-template-columns:repeat(3,1fr)}.rang>:nth-child(n+4){display:none}}
.cols{display:grid;grid-template-columns:minmax(0,480px) minmax(0,1fr);gap:36px;align-items:start}
@media(max-width:960px){.cols{grid-template-columns:1fr}}
.carte{background:var(--matcha-soft);border-radius:22px;padding:24px 22px;position:sticky;top:20px}
@media(max-width:960px){.carte{position:static}}
h2{font-family:var(--display);font-weight:500;font-size:32px;line-height:1.05;margin:0;color:var(--matcha-deep)}
.pilules{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 2px}
.pilules button{font:500 13px var(--body);color:var(--matcha-deep);background:var(--panel);border:1px solid var(--matcha-mid);padding:6px 12px;border-radius:999px;cursor:pointer;min-height:0}
.pilules button[aria-pressed="true"]{color:#fff;background:var(--fraise);border-color:var(--fraise)}
.cache{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
label{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;color:var(--muted);margin:18px 0 6px}
select,input,textarea{font:14px var(--body);color:var(--ink);width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
.depot{display:flex;align-items:center;gap:12px;padding:9px;background:var(--fraise-soft);border:1px dashed var(--fraise-mid);border-radius:12px;cursor:pointer;margin:0;letter-spacing:0;text-transform:none;font:400 14px var(--body);color:var(--ink)}
.depot b{font:600 12.5px var(--body);border-radius:999px;background:var(--fraise);color:#fff;padding:7px 14px;white-space:nowrap}
.depot span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.depot input{position:absolute;width:1px;height:1px;opacity:0}
textarea{min-height:84px;resize:vertical}
select:focus,input:focus,textarea:focus{outline:2px solid var(--fraise-mid);outline-offset:1px;border-color:transparent}
.ligne2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
button{font:600 14px var(--body);border:1px solid var(--matcha-deep);background:var(--matcha-deep);color:var(--on);padding:12px 22px;min-height:46px;border-radius:999px;cursor:pointer}
#go{width:100%;margin-top:6px;background:var(--fraise);border-color:var(--fraise);color:#fff}
#go:hover{background:var(--fraise-deep)}
button.leger{background:var(--panel);color:var(--ink);border-color:var(--line);font-size:12.5px;padding:7px 14px;min-height:34px}
button.leger:hover{border-color:var(--fraise)}
button:disabled{opacity:.45;cursor:wait}
.fichier{display:grid;grid-template-columns:64px 1fr;gap:12px;margin-top:12px;align-items:start}
.fichier video,.fichier img{width:64px;aspect-ratio:9/16;object-fit:cover;border-radius:10px;background:#000}
.aide{font-size:12.5px;color:var(--muted);margin-top:6px}
#msg{color:var(--fraise-deep);font-weight:500}
.connexions{margin-top:16px;padding:12px 14px;background:var(--panel);border-radius:12px;font-size:13px}
.connexions:not(:has(.aide:not([hidden]))){display:none}
.connexions .aide{margin:0}
.coche{display:flex;align-items:center;gap:8px;font:400 14px var(--body);letter-spacing:0;text-transform:none;color:var(--ink);margin:6px 0}.coche input{width:auto;margin:0;accent-color:var(--fraise)}
#ttCompte{display:flex;align-items:center;gap:8px;margin-top:14px}
.studio{display:grid;grid-template-columns:repeat(auto-fill,minmax(78px,1fr));gap:8px}
.sitem{position:relative;display:flex;flex-direction:column;gap:4px;padding:0;min-height:0;background:transparent;border:0;color:var(--ink);font:500 11px/1.25 var(--body);text-align:left;cursor:pointer}
.sitem video{width:100%;aspect-ratio:9/16;object-fit:cover;border-radius:12px;background:#000;border:2px solid transparent}
.sitem[aria-pressed="true"] video{border-color:var(--fraise);box-shadow:0 0 0 3px var(--fraise-soft)}
.sitem span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.sitem i{position:absolute;top:6px;right:6px;width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.9);color:#2c3622;font:600 13px/20px var(--body);text-align:center;font-style:normal;opacity:0}
.sitem:hover i{opacity:1}
.choisi{margin-top:8px;padding:10px 12px;border-radius:12px;background:var(--panel);font-size:13px;display:flex;justify-content:space-between;gap:10px;align-items:center}
.barre{height:4px;background:var(--fraise-soft);border-radius:4px;margin-top:12px;overflow:hidden}.barre span{display:block;height:100%;width:0;background:var(--fraise)}

/* calendar */
.tete{display:flex;flex-wrap:wrap;gap:12px 20px;align-items:center;justify-content:space-between;margin-bottom:18px}
.nav{display:flex;align-items:center;gap:10px}
.nav b{font-family:var(--display);font-size:26px;font-weight:500;min-width:190px;text-align:center}
.nav button{width:36px;height:36px;min-height:0;padding:0;border-radius:50%;background:var(--panel);color:var(--matcha-deep);border-color:var(--matcha-mid);font-size:18px;line-height:1}
.nav button.auj{width:auto;padding:0 14px;font-size:12.5px}
.cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}
.jsem{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600;text-align:center;padding-bottom:4px}
.case{min-height:100px;border-radius:14px;background:var(--panel);border:1px solid var(--line);padding:7px;display:flex;flex-direction:column;gap:4px;cursor:pointer;text-align:left;font:inherit;color:inherit;min-width:0}
.case:hover{border-color:var(--matcha-mid)}
.case.hors{opacity:.4}
.case.auj .num{background:var(--fraise);color:#fff}
.case.sel{border:2px solid var(--matcha);padding:6px;background:var(--matcha-soft)}
.case .num{align-self:flex-start;font-size:12px;font-weight:600;min-width:24px;height:24px;border-radius:999px;display:grid;place-items:center;padding:0 6px}
.puce{display:flex;align-items:center;gap:5px;font-size:11px;line-height:1.2;min-width:0;border-radius:8px;padding:2px 4px 2px 2px;background:var(--matcha-soft)}
.puce img,.puce video,.puce .tx{width:18px;height:24px;border-radius:4px;object-fit:cover;flex:none;background:#000}
.puce .tx{background:var(--fraise-soft)}
.puce span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.puce.publie{background:var(--fraise-soft)}
.puce.erreur{background:var(--fraise);color:#fff}
.plus{font-size:11px;color:var(--muted);padding-left:4px}
.point{width:6px;height:6px;border-radius:50%;flex:none}
@media(max-width:640px){.case{min-height:64px;padding:4px}.puce span{display:none}.puce{padding:2px}.jsem{font-size:9px;letter-spacing:.06em}}

/* day detail and list */
.jour{font-family:var(--display);font-style:italic;font-size:26px;margin:30px 0 10px;padding-bottom:8px;border-bottom:1px solid var(--line);color:var(--matcha-deep)}
.post{display:grid;grid-template-columns:62px 1fr auto;gap:16px;padding:12px 0;align-items:start}
.post+.post{border-top:1px solid var(--line)}
.post video,.post img,.texte{width:62px;aspect-ratio:9/16;object-fit:cover;border-radius:12px;background:#000}
.texte{display:flex;align-items:center;justify-content:center;font:italic 22px var(--display);color:var(--fraise);background:var(--fraise-soft)}
.meta{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center;font-size:12px;color:var(--muted)}
.meta .res{color:var(--matcha-deep);text-transform:uppercase;letter-spacing:.12em;font-weight:600;font-size:10.5px;display:flex;align-items:center;gap:6px}
.leg{font-size:14px;margin-top:4px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.st{font:600 10px var(--body);letter-spacing:.08em;text-transform:uppercase;padding:3px 9px;border-radius:999px;background:var(--matcha-soft);color:var(--matcha-deep)}
.st.publie{background:var(--fraise-soft);color:var(--fraise-deep)}.st.erreur{background:var(--fraise);color:#fff}.st.traitement,.st.enfants{background:var(--matcha-mid);color:#2c3622}
.voir{font-size:12.5px;color:var(--fraise-deep);font-weight:500;text-decoration:none}
.err{color:var(--fraise-deep);font-size:12.5px;margin-top:4px;padding:6px 10px;background:var(--fraise-soft);border-radius:10px}
.vide{color:var(--muted);font-style:italic}
</style></head><body><main>
<div class="hero">
  <div><div class="sur"><i></i><span>The Girl with a Camera</span></div>
  <h1>My social media <em>planner</em></h1>
  <p class="lead">Instagram, Threads, YouTube, Pinterest and TikTok in one place. Drop your files, pick a time, and it posts itself.</p></div>
  <div class="stats" aria-live="polite">
    <div class="stat a"><b id="nPrevus">·</b><span>scheduled</span></div>
    <div class="stat b"><b id="nPublies">·</b><span>posted · 7 days</span></div>
    <div class="stat c"><b id="nErreurs">·</b><span>to check</span></div>
  </div>
</div>
<div class="rang" id="rang" aria-hidden="true"></div>
<div class="cols">
<div class="carte">
  <h2>New post</h2>
  <label>Network</label><div class="pilules" id="pReseau"></div>
  <label>Type</label><div class="pilules" id="pGenre"></div>
  <div class="cache" aria-hidden="true">
    <select id="genre" tabindex="-1"></select>
    <select id="reseau" tabindex="-1"><option value="instagram">Instagram</option><option value="threads">Threads</option><option value="youtube">YouTube</option><option value="pinterest">Pinterest</option><option value="tiktok">TikTok</option></select>
  </div>
  <div id="blocStudio" hidden><label>From the studio</label><div class="studio" id="studio"></div>
  <div class="aide">Kept in Studio TGWAC, sound included. Click one to use it.</div></div>
  <div class="choisi" id="choisi" hidden></div>
  <div id="blocFichiers"><label>Or your own files</label><label class="depot"><input type="file" id="fichiers" multiple accept="video/mp4,video/quicktime,image/jpeg,image/png"><b>Choose files</b><span id="nomFichiers">No file chosen</span></label>
  <div class="aide" id="aideFichiers"></div></div>
  <label id="titreLegende">Caption</label><textarea id="legende" placeholder="Used for every file, editable one by one"></textarea>
  <div class="ligne2">
    <div><label>First one at</label><input type="datetime-local" id="quand"></div>
    <div><label>Gap (min)</label><input type="number" id="intervalle" value="60" min="5"></div>
  </div>
  <div id="blocPin" hidden>
    <div class="ligne2">
      <div><label>Board</label><select id="tableau"><option value="">Loading…</option></select></div>
      <div><label>Pin link</label><input id="lienPin" placeholder="https://www.thegirlwithacamera.com/en/store/..."></div>
    </div>
    <div class="aide"><a href="#" id="nouveauTableau">Create a board</a></div>
    <div class="ligne2" id="blocTableau" hidden><div><input id="nomTableau" placeholder="New board name"></div><div><button class="leger" id="creerTableau">Create</button></div></div>
  </div>
  <div id="blocTt" hidden>
    <div class="aide" id="ttCompte"></div>
    <label>How</label><div class="pilules" id="pTtMode"></div>
    <select id="ttMode" class="cache" tabindex="-1" aria-hidden="true"><option value="direct">Post directly</option><option value="brouillon">Send as a draft to the TikTok app</option></select>
    <div class="ligne2" id="ttDirect">
      <div><label>Who can watch</label><select id="ttPriv"><option value="">Choose…</option></select></div>
      <div><label>Allow</label>
        <label class="coche"><input type="checkbox" id="ttCom"> Comments</label>
        <label class="coche"><input type="checkbox" id="ttDuo"> Duet</label>
        <label class="coche"><input type="checkbox" id="ttCol"> Stitch</label></div>
    </div>
    <div class="aide">By posting, you agree to TikTok's <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener">Music Usage Confirmation</a>.</div>
  </div>
  <div id="liste-fichiers"></div>
  <div style="margin-top:22px"><button id="go">Schedule</button></div>
  <div class="barre" id="barre" hidden><span></span></div>
  <div id="msg" class="aide"></div>
  <div class="connexions">
    <div id="ytCo" class="aide" hidden></div>
    <div id="pinCo" class="aide" hidden></div>
    <div id="ttCo" class="aide" hidden></div>
  </div>
</div>
<div>
  <div class="tete">
    <h2>Coming up</h2>
    <div class="pilules" id="pVue"></div>
  </div>
  <div id="vueCal">
    <div class="tete"><div class="nav"><button id="moisAvant" aria-label="Previous month">‹</button><b id="moisNom"></b><button id="moisApres" aria-label="Next month">›</button></div><button class="leger auj" id="aujourdhui">Today</button></div>
    <div class="cal" id="cal"></div>
    <div id="detail"></div>
  </div>
  <div id="vueListe" hidden><div id="posts"><p class="vide">Loading…</p></div></div>
</div>
</div>
</main>
<script>
const CLE = new URLSearchParams(location.search).get('key') || '';
const q = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const api = (chemin, opts = {}) => fetch(chemin + (chemin.includes('?') ? '&' : '?') + 'key=' + encodeURIComponent(CLE), opts);
const LANG = 'en-GB';
let fichiers = [], posts = [], studio = [], studioChoisi = null;
const TYPES_RESEAU = {
  instagram: [['essai', 'Trial reel'], ['reel', 'Reel'], ['photo', 'Photo'], ['carrousel', 'Carousel']],
  threads: [['texte', 'Text only'], ['photo', 'Photo'], ['video', 'Video'], ['carrousel', 'Carousel']],
  youtube: [['video', 'Video']],
  pinterest: [['epingle', 'Photo pin']],
  tiktok: [['video', 'Video']],
};
const RESEAUX = [['instagram', 'Instagram'], ['threads', 'Threads'], ['youtube', 'YouTube'], ['pinterest', 'Pinterest'], ['tiktok', 'TikTok']];
const NOM_RES = { instagram: 'Instagram', threads: 'Threads', youtube: 'YouTube', pinterest: 'Pinterest', tiktok: 'TikTok' };
const COUL = { instagram: '#e0566f', threads: '#2c3622', youtube: '#b8324c', pinterest: '#f4b1bd', tiktok: '#6f8f4e' };
const NOMS = { essai: 'Trial reel', reel: 'Reel', photo: 'Photo', carrousel: 'Carousel', texte: 'Text', video: 'Video', epingle: 'Pin' };
const ST = { prevu: 'scheduled', traitement: 'posting', enfants: 'posting', publie: 'posted', erreur: 'error' };
const PRIV = { PUBLIC_TO_EVERYONE: 'Everyone', MUTUAL_FOLLOW_FRIENDS: 'Friends', FOLLOWER_OF_CREATOR: 'Followers', SELF_ONLY: 'Only me' };

function pilules(boite, liste, valeur, quand) {
  q(boite).innerHTML = liste.map(([v, n]) => '<button type="button" data-v="' + v + '" aria-pressed="' + (v === valeur) + '">' + esc(n) + '</button>').join('');
  q(boite).onclick = e => { const b = e.target.closest('button'); if (b) quand(b.dataset.v); };
}
function majReseau() {
  const r = q('#reseau').value;
  q('#genre').innerHTML = TYPES_RESEAU[r].map(([v, n]) => '<option value="' + v + '">' + n + '</option>').join('');
  pilules('#pReseau', RESEAUX, r, v => { q('#reseau').value = v; majReseau(); });
  majGenre();
}
function majGenre() {
  const r = q('#reseau').value, g = q('#genre').value, texte = g === 'texte';
  pilules('#pGenre', TYPES_RESEAU[r], g, v => { q('#genre').value = v; majGenre(); });
  q('#blocFichiers').hidden = texte || !!studioChoisi;
  dessinerStudio();
  q('#titreLegende').textContent = (texte || r === 'threads') ? 'Text (500 characters max)' : (r === 'youtube' || r === 'pinterest') ? 'Title on the first line, then the description' : 'Caption';
  q('#blocPin').hidden = q('#pinCo').hidden = r !== 'pinterest';
  if (r === 'pinterest') chargerTableaux();
  q('#ytCo').hidden = r !== 'youtube';
  q('#blocTt').hidden = q('#ttCo').hidden = r !== 'tiktok';
  if (r === 'tiktok') { chargerCreateur(); majTtMode(); }
  q('#aideFichiers').textContent = g === 'carrousel' ? 'All the files you pick become one carousel.' : 'Several files = one post per file, spaced by the gap below.';
  if (texte) { fichiers = []; q('#fichiers').value = ''; }
  dessinerFichiers();
}
function majTtMode() {
  const m = q('#ttMode').value;
  pilules('#pTtMode', [['direct', 'Post directly'], ['brouillon', 'Draft in the app']], m, v => { q('#ttMode').value = v; majTtMode(); });
  q('#ttDirect').hidden = m === 'brouillon';
}

(function () { const d = new Date(Date.now() + 3600e3); d.setMinutes(0, 0, 0); q('#quand').value = new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16); })();

function dessinerFichiers() {
  q('#nomFichiers').textContent = !fichiers.length ? 'No file chosen' : fichiers.length === 1 ? fichiers[0].name : fichiers.length + ' files';
  const g = q('#genre').value, groupe = g === 'carrousel' || g === 'photo' || g === 'epingle';
  q('#liste-fichiers').innerHTML = groupe ? '' : fichiers.map((f, i) =>
    '<div class="fichier">' + (f.type.startsWith('video') ? '<video muted src="' + f.apercu + '"></video>' : '<img src="' + f.apercu + '">') +
    '<div><div class="meta">' + esc(f.name) + '</div><textarea data-i="' + i + '" placeholder="Caption for this post (empty = shared caption)">' + esc(f.legende || '') + '</textarea></div></div>').join('');
}
q('#fichiers').addEventListener('change', e => { fichiers = [...e.target.files].map(f => Object.assign(f, { apercu: URL.createObjectURL(f) })); dessinerFichiers(); });
q('#liste-fichiers').addEventListener('input', e => { if (e.target.dataset.i) fichiers[e.target.dataset.i].legende = e.target.value; });

async function envoyer(f, progres) {
  const ext = f.name.split('.').pop().toLowerCase();
  const d = await (await api('/api/envoi/debut?ext=' + ext, { method: 'POST' })).json();
  if (d.erreur) throw new Error(d.erreur);
  const TAILLE = 20 * 1024 * 1024, parts = [];
  for (let n = 1, pos = 0; pos < f.size; n++, pos += TAILLE) {
    const r = await api('/api/envoi/morceau?cle=' + d.cle + '&uploadId=' + encodeURIComponent(d.uploadId) + '&n=' + n, { method: 'PUT', body: f.slice(pos, pos + TAILLE) });
    if (!r.ok) throw new Error('Upload interrupted, try again.');
    parts.push(await r.json()); progres(Math.min(f.size, pos + TAILLE));
  }
  const fin = await api('/api/envoi/fin?cle=' + d.cle + '&uploadId=' + encodeURIComponent(d.uploadId), { method: 'POST', body: JSON.stringify({ parts }) });
  if (!fin.ok) throw new Error('Upload not finished, try again.');
  return d.cle;
}

q('#go').addEventListener('click', async () => {
  const g = q('#genre').value, msg = q('#msg'), reseau = q('#reseau').value;
  if (g === 'texte') {
    const t = q('#legende').value.trim(), d0 = new Date(q('#quand').value);
    if (!t) { msg.textContent = 'Write the text first.'; return; }
    if (isNaN(d0)) { msg.textContent = 'Pick a date.'; return; }
    const r = await (await api('/api/posts', { method: 'POST', body: JSON.stringify({ posts: [{ reseau, genre: g, medias: [], legende: t, quand: d0.toISOString() }] }) })).json();
    msg.textContent = r.erreur || 'Post scheduled.';
    if (!r.erreur) { q('#legende').value = ''; charger(); }
    return;
  }
  if (studioChoisi) {
    const d0 = new Date(q('#quand').value);
    if (isNaN(d0)) { msg.textContent = 'Pick a date.'; return; }
    const p = Object.assign({ reseau, genre: g, medias: [studioChoisi.cle], legende: q('#legende').value, quand: d0.toISOString() },
      reseau === 'tiktok' ? { mode: q('#ttMode').value, confidentialite: q('#ttPriv').value, commentaires: q('#ttCom').checked, duo: q('#ttDuo').checked, collage: q('#ttCol').checked } : {});
    q('#go').disabled = true;
    const r = await (await api('/api/posts', { method: 'POST', body: JSON.stringify({ posts: [p] }) })).json();
    q('#go').disabled = false;
    if (r.erreur) { msg.textContent = r.erreur; return; }
    await api('/api/studio/' + studioChoisi.id + '/utilise', { method: 'POST' });
    msg.textContent = 'Scheduled from the studio.';
    studioChoisi = null; q('#legende').value = ''; choisi = cleJour(d0); mois = new Date(d0.getFullYear(), d0.getMonth(), 1);
    chargerStudio(); charger(); return;
  }
  if (!fichiers.length) { msg.textContent = 'Pick at least one file, or one from the studio.'; return; }
  const debut = new Date(q('#quand').value);
  if (isNaN(debut)) { msg.textContent = 'Pick a date.'; return; }
  const total = fichiers.reduce((s, f) => s + f.size, 0); let fait = 0;
  q('#go').disabled = true; q('#barre').hidden = false; msg.textContent = 'Uploading…';
  try {
    const cles = [];
    for (const f of fichiers) { const avant = fait; cles.push(await envoyer(f, x => { fait = avant + x; q('#barre span').style.width = (fait / total * 100) + '%'; })); }
    const commun = q('#legende').value, pas = Math.max(5, Number(q('#intervalle').value) || 60) * 6e4;
    let liste = (g === 'carrousel' || g === 'photo' || g === 'epingle')
      ? (g === 'carrousel' ? [{ genre: g, medias: cles, legende: commun, quand: debut.toISOString() }]
        : cles.map((c, i) => ({ genre: g, medias: [c], legende: commun, quand: new Date(+debut + i * pas).toISOString() })))
      : cles.map((c, i) => ({ genre: g, medias: [c], legende: fichiers[i].legende || commun, quand: new Date(+debut + i * pas).toISOString() }));
    liste = liste.map(p => Object.assign(p, { reseau }, reseau === 'pinterest' ? { genre: 'epingle', tableau: q('#tableau').value, lien: q('#lienPin').value.trim() } : {},
      reseau === 'tiktok' ? { mode: q('#ttMode').value, confidentialite: q('#ttPriv').value, commentaires: q('#ttCom').checked, duo: q('#ttDuo').checked, collage: q('#ttCol').checked } : {}));
    const r = await (await api('/api/posts', { method: 'POST', body: JSON.stringify({ posts: liste }) })).json();
    if (r.erreur) throw new Error(r.erreur);
    msg.textContent = liste.length + (liste.length > 1 ? ' posts scheduled.' : ' post scheduled.');
    fichiers = []; q('#fichiers').value = ''; q('#legende').value = ''; dessinerFichiers();
    choisi = cleJour(debut); mois = new Date(debut.getFullYear(), debut.getMonth(), 1); charger();
  } catch (e) { msg.textContent = e.message; }
  q('#go').disabled = false; setTimeout(() => { q('#barre').hidden = true; q('#barre span').style.width = 0; }, 800);
});

// ---- studio tray
async function chargerStudio() { try { studio = await (await api('/api/studio')).json(); } catch (e) { studio = []; } dessinerStudio(); }
function dessinerStudio() {
  const r = q('#reseau').value, g = q('#genre').value, l = studio.filter(x => x.reseau === r);
  if (studioChoisi && studioChoisi.reseau !== r) studioChoisi = null;
  q('#blocStudio').hidden = !l.length || g === 'texte' || g === 'photo' || g === 'carrousel' || g === 'epingle';
  q('#studio').innerHTML = l.map(x => '<button type="button" class="sitem" data-id="' + esc(x.id) + '" aria-pressed="' + (studioChoisi && studioChoisi.id === x.id) + '"><video muted playsinline preload="metadata" src="/media/' + esc(x.cle) + '#t=1"></video><span>' + esc(x.titre || x.id) + '</span><i data-retirer="' + esc(x.id) + '" title="Remove from the tray">×</i></button>').join('');
  q('#choisi').hidden = !studioChoisi;
  if (studioChoisi) q('#choisi').innerHTML = '<span>Using <b>' + esc(studioChoisi.titre || studioChoisi.id) + '</b> from the studio</span><button type="button" class="leger" id="lacher">Change</button>';
  q('#blocFichiers').hidden = g === 'texte' || !!studioChoisi;
}
q('#studio').addEventListener('click', async e => {
  const x = e.target.closest('[data-retirer]');
  if (x) { e.stopPropagation(); await api('/api/studio/' + x.dataset.retirer + '/retirer', { method: 'POST' }); if (studioChoisi && studioChoisi.id === x.dataset.retirer) studioChoisi = null; chargerStudio(); return; }
  const b = e.target.closest('.sitem'); if (!b) return;
  const it = studio.find(s => s.id === b.dataset.id);
  studioChoisi = studioChoisi && studioChoisi.id === it.id ? null : it;
  if (studioChoisi) { q('#legende').value = it.legende || ''; fichiers = []; q('#fichiers').value = ''; dessinerFichiers(); }
  dessinerStudio();
});
q('#choisi').addEventListener('click', e => { if (e.target.id === 'lacher') { studioChoisi = null; q('#legende').value = ''; dessinerStudio(); } });

// ---- posts: shared bits
const estVid = m => /\.(mp4|mov|m4v)$/.test(m);
function apercu(m) { return !m ? '<div class="texte">Aa</div>' : estVid(m) ? '<video muted playsinline preload="metadata" src="/media/' + m + '#t=1"></video>' : '<img loading="lazy" src="/media/' + m + '" alt="">'; }
const heure = d => d.toLocaleTimeString(LANG, { hour: '2-digit', minute: '2-digit' });
const cleJour = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
function carte(p) {
  const d = new Date(p.quand), m = p.medias[0], res = NOM_RES[p.reseau] || 'Instagram';
  return '<div class="post">' + apercu(m) +
    '<div><div class="meta"><span class="res"><i class="point" style="background:' + (COUL[p.reseau] || COUL.instagram) + '"></i>' + res + '</span><span>' + heure(d) + ' · ' + NOMS[p.genre] + (p.medias.length > 1 ? ' · ' + p.medias.length + ' files' : '') + '</span>' +
    '<span class="st ' + p.statut + '">' + ST[p.statut] + '</span></div><div class="leg">' + (esc(p.legende) || '<span class="vide">No caption</span>') + '</div>' +
    (p.erreur && p.statut === 'erreur' ? '<div class="err">' + esc(p.erreur) + '</div>' : '') +
    (p.lien ? '<a class="voir" href="' + esc(p.lien) + '" target="_blank" rel="noopener">See it on ' + res + ' →</a>' : '') + '</div><div>' +
    (p.statut === 'prevu' ? '<button class="leger" data-sup="' + p.id + '">Remove</button>' : '') +
    (p.statut === 'erreur' ? '<button class="leger" data-rel="' + p.id + '">Try again</button>' : '') + '</div></div>';
}

// ---- views
let vue = 'cal', mois = new Date(new Date().getFullYear(), new Date().getMonth(), 1), choisi = cleJour(new Date());
try { vue = localStorage.getItem('vue') || 'cal'; } catch (e) {}
function majVue() {
  pilules('#pVue', [['cal', 'Calendar'], ['liste', 'List']], vue, v => { vue = v; try { localStorage.setItem('vue', v); } catch (e) {} majVue(); });
  q('#vueCal').hidden = vue !== 'cal'; q('#vueListe').hidden = vue !== 'liste';
}
function dessinerCal() {
  q('#moisNom').textContent = mois.toLocaleDateString(LANG, { month: 'long', year: 'numeric' });
  const parJour = {};
  for (const p of posts) (parJour[cleJour(new Date(p.quand))] ||= []).push(p);
  const premier = new Date(mois), decal = (premier.getDay() + 6) % 7;
  const depart = new Date(premier.getFullYear(), premier.getMonth(), 1 - decal);
  const auj = cleJour(new Date());
  let h = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(j => '<div class="jsem">' + j + '</div>').join('');
  for (let i = 0; i < 42; i++) {
    const d = new Date(depart.getFullYear(), depart.getMonth(), depart.getDate() + i), k = cleJour(d), l = parJour[k] || [];
    if (i === 35 && d.getMonth() !== mois.getMonth()) break;
    h += '<button type="button" class="case' + (d.getMonth() !== mois.getMonth() ? ' hors' : '') + (k === auj ? ' auj' : '') + (k === choisi ? ' sel' : '') + '" data-j="' + k + '">' +
      '<span class="num">' + d.getDate() + '</span>' +
      l.slice(0, 3).map(p => '<span class="puce ' + p.statut + '">' + (p.medias[0] ? (estVid(p.medias[0]) ? '<video muted preload="metadata" src="/media/' + p.medias[0] + '#t=1"></video>' : '<img loading="lazy" src="/media/' + p.medias[0] + '" alt="">') : '<i class="tx"></i>') +
        '<i class="point" style="background:' + (COUL[p.reseau] || COUL.instagram) + '"></i><span>' + heure(new Date(p.quand)) + '</span></span>').join('') +
      (l.length > 3 ? '<span class="plus">+' + (l.length - 3) + ' more</span>' : '') + '</button>';
  }
  q('#cal').innerHTML = h;
  const l = (parJour[choisi] || []);
  const [a, mo, j] = choisi.split('-').map(Number);
  q('#detail').innerHTML = '<div class="jour">' + new Date(a, mo - 1, j).toLocaleDateString(LANG, { weekday: 'long', day: 'numeric', month: 'long' }) + '</div>' +
    (l.length ? l.map(carte).join('') : '<p class="vide">Nothing on this day.</p>');
}
function dessinerListe() {
  if (!posts.length) { q('#posts').innerHTML = '<p class="vide">Nothing scheduled.</p>'; return; }
  let jour = '', h = '';
  for (const p of posts) {
    const j = new Date(p.quand).toLocaleDateString(LANG, { weekday: 'long', day: 'numeric', month: 'long' });
    if (j !== jour) { h += '<div class="jour">' + j + '</div>'; jour = j; }
    h += carte(p);
  }
  q('#posts').innerHTML = h;
}
async function charger() {
  posts = await (await api('/api/posts')).json();
  const semaine = Date.now() - 7 * 864e5;
  q('#nPrevus').textContent = posts.filter(p => p.statut !== 'publie' && p.statut !== 'erreur').length;
  q('#nPublies').textContent = posts.filter(p => p.statut === 'publie' && new Date(p.quand) > semaine).length;
  q('#nErreurs').textContent = posts.filter(p => p.statut === 'erreur').length;
  const avenir = posts.filter(p => p.statut === 'prevu' && p.medias[0]).slice(0, 6);
  const rang = avenir.length >= 3 ? avenir : posts.filter(p => p.medias[0]).slice(-6);
  q('#rang').innerHTML = rang.map(p => apercu(p.medias[0])).join('');
  q('#rang').hidden = !rang.length;
  dessinerCal(); dessinerListe();
}
q('#cal').addEventListener('click', e => { const c = e.target.closest('.case'); if (!c) return; choisi = c.dataset.j; dessinerCal(); });
q('#moisAvant').addEventListener('click', () => { mois = new Date(mois.getFullYear(), mois.getMonth() - 1, 1); dessinerCal(); });
q('#moisApres').addEventListener('click', () => { mois = new Date(mois.getFullYear(), mois.getMonth() + 1, 1); dessinerCal(); });
q('#aujourdhui').addEventListener('click', () => { const t = new Date(); mois = new Date(t.getFullYear(), t.getMonth(), 1); choisi = cleJour(t); dessinerCal(); });
function actions(e) {
  const b = e.target.closest('button[data-sup],button[data-rel]'); if (!b) return;
  if (b.dataset.sup && !b.dataset.ok) { b.dataset.ok = 1; b.textContent = 'Sure?'; setTimeout(() => { delete b.dataset.ok; b.textContent = 'Remove'; }, 4000); return; }
  b.disabled = true;
  api('/api/posts/' + (b.dataset.sup || b.dataset.rel) + '/' + (b.dataset.sup ? 'supprimer' : 'relancer'), { method: 'POST' }).then(charger);
}
q('#posts').addEventListener('click', actions);
q('#detail').addEventListener('click', actions);

// ---- networks
async function chargerCreateur() {
  const c = await (await api('/api/tiktok/createur')).json();
  if (c.erreur) { q('#ttCompte').textContent = c.erreur; return; }
  q('#ttCompte').innerHTML = (c.avatar ? '<img src="' + esc(c.avatar) + '" style="width:24px;height:24px;border-radius:50%">' : '') + 'Posting as ' + esc(c.nom) + ' · videos up to ' + Math.round(c.duree_max / 60) + ' min';
  q('#ttPriv').innerHTML = '<option value="">Choose…</option>' + c.confidentialites.map(v => '<option value="' + esc(v) + '">' + esc(PRIV[v] || v) + '</option>').join('');
  [['#ttCom', c.commentaires_off], ['#ttDuo', c.duo_off], ['#ttCol', c.collage_off]].forEach(([s, off]) => { q(s).disabled = off; if (off) q(s).checked = false; });
}
async function chargerTableaux() {
  const r = await (await api('/api/pinterest/tableaux')).json();
  q('#tableau').innerHTML = r.erreur ? '<option value="">' + esc(r.erreur) + '</option>' : (r.length ? r.map(b => '<option value="' + esc(b.id) + '">' + esc(b.nom) + '</option>').join('') : '<option value="">No board yet</option>');
}
q('#nouveauTableau').addEventListener('click', e => { e.preventDefault(); q('#blocTableau').hidden = false; q('#nomTableau').focus(); });
q('#creerTableau').addEventListener('click', async e => { e.preventDefault(); const nom = q('#nomTableau').value.trim(); if (!nom) return; const r = await (await api('/api/pinterest/tableaux', { method: 'POST', body: JSON.stringify({ nom }) })).json(); q('#nomTableau').value = ''; q('#blocTableau').hidden = true; await chargerTableaux(); if (r.id) q('#tableau').value = r.id; });
api('/api/etat').then(r => r.json()).then(e => {
  const lien = (chemin, texte) => '<a href="' + chemin + '?key=' + encodeURIComponent(CLE) + '">' + texte + '</a>';
  const pn = e.pinterest || {}, y = e.youtube || {}, t = e.tiktok || {};
  q('#pinCo').innerHTML = (pn.connecte ? 'Pinterest connected' + (pn.bac_a_sable ? ' (test mode: pins only visible to you)' : '') + '. ' : '') + lien('/pinterest/connecter', pn.connecte ? 'Reconnect' : 'Connect my Pinterest');
  q('#ytCo').innerHTML = (y.connecte ? 'YouTube connected' + (y.chaine ? ': ' + esc(y.chaine) : '') + (y.souci ? ' (' + esc(y.souci) + ')' : '') + '. ' : '') + lien('/youtube/connecter', y.connecte ? 'Change channel' : 'Connect my YouTube channel');
  q('#ttCo').innerHTML = (t.connecte ? 'TikTok connected' + (t.compte ? ': ' + esc(t.compte) : '') + '. ' : '') + lien('/tiktok/connecter', t.connecte ? 'Reconnect' : 'Connect my TikTok');
});

majReseau(); majVue(); charger(); chargerStudio(); setInterval(charger, 60000);
</script></body></html>`;
}
