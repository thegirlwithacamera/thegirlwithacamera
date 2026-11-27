#!/bin/bash
# Etat de la machine a commentaires en ligne et de la programmation.
#   bash workers/publier/etat.sh
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd "$(dirname "$0")"
npx --yes wrangler@4.168.0 d1 execute tgwac-links --remote --json --command "SELECT (SELECT count(*) FROM com_faits) AS faits, (SELECT count(*) FROM com_compteurs) AS compteurs, (SELECT count(*) FROM com_journal) AS journal, (SELECT valeur FROM reglages WHERE nom='com_pseudo') AS pseudo, (SELECT valeur FROM reglages WHERE nom='com_actif') AS actif, (SELECT CASE WHEN valeur = 'null' THEN 'debut' ELSE 'en route' END FROM reglages WHERE nom='com_curseur') AS curseur" 2>/dev/null \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)[0]["results"][0])'
npx --yes wrangler@4.168.0 d1 execute tgwac-links --remote --json --command "SELECT date, action, regle, compte, substr(commentaire,1,40) AS commentaire, substr(detail,1,80) AS detail FROM com_journal ORDER BY date DESC LIMIT 8" 2>/dev/null \
  | python3 -c 'import json,sys; [print(r) for r in json.load(sys.stdin)[0]["results"]]'
