// Page privee de la machine a commentaires : etat, regles, journal.
export function pageCommentaires() {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta name="referrer" content="no-referrer">
<title>Commentaires</title>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital@0;1&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}body{margin:0;padding:26px 16px 80px;font:14px/1.5 Inter,-apple-system,sans-serif;color:#111;background:#fff}
main{max-width:980px;margin:0 auto}
.sur{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#777}
h1{font:italic 34px/1.15 "EB Garamond",Georgia,serif;margin:6px 0 22px;font-weight:400}
h2{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#777;font-weight:500;margin:34px 0 12px}
.etat{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #111}
.etat div{padding:12px 12px 0 0}
.etat .k{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#777}
.etat .v{font:italic 26px/1.2 "EB Garamond",Georgia,serif;margin-top:4px}
.on{color:#1c6b3a}.off{color:#b02c1e}
.regles{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:12px}
.regle{border:1px solid #e6e6e6;padding:14px}
.regle h3{font:italic 22px "EB Garamond",Georgia,serif;margin:0 0 8px;font-weight:400}
.mots{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px}
.mots span{font-size:11px;border:1px solid #ccc;padding:1px 7px}
.dm{font-size:13px;background:#f5f5f5;padding:10px 12px;border-radius:14px 14px 14px 4px}
.btn{display:inline-block;margin-top:8px;font-size:12px;border:1px solid #111;padding:5px 10px}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#777;font-weight:500;padding:0 10px 8px 0;border-bottom:1px solid #111}
td{padding:9px 10px 9px 0;border-bottom:1px solid #eee;vertical-align:top}
.a{font-size:10px;letter-spacing:.06em;text-transform:uppercase;padding:1px 6px;border:1px solid #ccc;color:#555;white-space:nowrap}
.a.dm_envoye{border-color:#1c6b3a;color:#1c6b3a}.a.reponse_publique{border-color:#111;color:#111}.a.erreur{border-color:#b02c1e;color:#b02c1e}
.vide{color:#777}
</style></head><body><main>
<div class="sur">The Girl With A Camera</div>
<h1>Commentaires</h1>
<div class="etat">
  <div><div class="k">Machine</div><div class="v" id="actif">…</div></div>
  <div><div class="k">Dernier passage</div><div class="v" id="dernier">…</div></div>
  <div><div class="k">DM envoyés, 7 jours</div><div class="v" id="dms">…</div></div>
  <div><div class="k">Règles actives</div><div class="v" id="nregles">…</div></div>
</div>
<h2>Mots clés</h2>
<div class="regles" id="regles"></div>
<h2>Journal</h2>
<table><thead><tr><th style="width:14%">Quand</th><th style="width:16%">Compte</th><th>Commentaire</th><th style="width:12%">Règle</th><th style="width:16%">Action</th></tr></thead><tbody id="journal"></tbody></table>
</main>
<script>
const CLE = new URLSearchParams(location.search).get('key') || '';
const q = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ACTIONS = { dm_envoye: 'DM envoyé', reponse_publique: 'Réponse publique', ignore_trop_vieux: 'Trop ancien', erreur_dm: 'Erreur DM', erreur_reponse_publique: 'Erreur réponse' };
const quand = d => new Date(d).toLocaleString('fr-BE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
async function charger() {
  const d = await (await fetch('/api/commentaires/vue?key=' + encodeURIComponent(CLE))).json();
  q('#actif').innerHTML = d.actif ? '<span class="on">Allumée</span>' : '<span class="off">Éteinte</span>';
  q('#dernier').textContent = d.dernier ? new Date(d.dernier).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }) : '–';
  q('#dms').textContent = d.dms7 ?? 0;
  const rs = d.regles.filter(r => r.actif);
  q('#nregles').textContent = rs.length;
  q('#regles').innerHTML = rs.map(r => '<div class="regle"><h3>' + esc(r.nom) + '</h3><div class="mots">' + (r.mots || []).map(m => '<span>' + esc(m) + '</span>').join('') +
    '</div><div class="dm">' + esc(r.dm) + '</div>' + (r.bouton && r.bouton.titre ? '<span class="btn">' + esc(r.bouton.titre) + '</span>' : '') + '</div>').join('') || '<p class="vide">Aucune règle.</p>';
  q('#journal').innerHTML = d.journal.map(j => '<tr><td>' + quand(j.date) + '</td><td>@' + esc(j.compte) + '</td><td>' + esc(j.commentaire) + '</td><td>' + esc(j.regle) +
    '</td><td><span class="a ' + (j.action.startsWith('erreur') ? 'erreur' : j.action) + '">' + esc(ACTIONS[j.action] || j.action) + '</span></td></tr>').join('') || '<tr><td colspan="5" class="vide">Rien pour l\\'instant.</td></tr>';
}
charger(); setInterval(charger, 60000);
</script></body></html>`;
}
