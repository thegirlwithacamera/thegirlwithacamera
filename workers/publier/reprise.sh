#!/bin/bash
# Reprise depuis la machine du Mac : arrete la version Mac, recopie ce qu'elle a
# deja traite (pour ne jamais renvoyer un DM), puis allume la version en ligne.
#   bash workers/publier/reprise.sh
set -e
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd "$(dirname "$0")"
P=~/Library/LaunchAgents/com.tgwac.machine-commentaires.plist
launchctl unload "$P" 2>/dev/null && echo "machine du Mac arretee" || echo "machine du Mac deja arretee"
python3 - <<'PY' > /tmp/reprise.sql
import json, pathlib
e = json.loads((pathlib.Path.home() / "Developer/machine-commentaires/etat.json").read_text())
for i, t in e.get("faits", {}).items():
    print(f"INSERT OR IGNORE INTO com_faits (id, quand) VALUES ('{i}', {int(float(t) * 1000)});")
for m, n in e.get("compteurs", {}).items():
    print(f"INSERT OR REPLACE INTO com_compteurs (media, n) VALUES ('{m}', {int(n)});")
print(f"INSERT INTO reglages (nom, valeur) VALUES ('com_tour', '{int(e.get('tour', 0))}') ON CONFLICT (nom) DO UPDATE SET valeur = excluded.valeur;")
print("INSERT INTO reglages (nom, valeur) VALUES ('com_actif', 'true') ON CONFLICT (nom) DO UPDATE SET valeur = 'true';")
PY
echo "$(grep -c com_faits /tmp/reprise.sql) commentaires deja traites, $(grep -c com_compteurs /tmp/reprise.sql) posts connus"
npx --yes wrangler@4.168.0 d1 execute tgwac-links --remote --file=/tmp/reprise.sql -y >/dev/null && echo "machine en ligne allumee"
rm -f /tmp/reprise.sql
