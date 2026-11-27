#!/bin/bash
# Copie les mots cles de machine-commentaires/mots_cles.json vers la machine en ligne.
#   bash workers/publier/regles.sh
set -e
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd "$(dirname "$0")"
python3 - <<'PY' > /tmp/regles.sql
import json, pathlib
d = json.loads((pathlib.Path.home() / "Developer/machine-commentaires/mots_cles.json").read_text())
v = json.dumps(d, ensure_ascii=False).replace("'", "''")
print(f"INSERT INTO reglages (nom, valeur) VALUES ('mots_cles', '{v}') ON CONFLICT (nom) DO UPDATE SET valeur = excluded.valeur;")
PY
npx --yes wrangler@4.168.0 d1 execute tgwac-links --remote --file=/tmp/regles.sql -y >/dev/null && echo "mots cles copies"
rm -f /tmp/regles.sql
