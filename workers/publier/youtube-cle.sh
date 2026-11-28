#!/bin/bash
# Copie les cles du client OAuth Google (fichier client_secret_*.json telecharge
# dans Telechargements) vers Cloudflare, sans les afficher, puis supprime le fichier.
set -e
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd "$(dirname "$0")"
F=$(ls -t ~/Downloads/client_secret_*.json 2>/dev/null | head -1)
[ -n "$F" ] || { echo "Fichier de cles introuvable dans Telechargements."; exit 1; }
ID=$(python3 -c 'import json,sys;d=json.load(open(sys.argv[1]));print(d["web"]["client_id"])' "$F")
SECRET=$(python3 -c 'import json,sys;d=json.load(open(sys.argv[1]));print(d["web"]["client_secret"])' "$F")
printf '%s' "$ID" | npx --yes wrangler@4.168.0 secret put YT_CLIENT_ID 2>&1 | grep -E 'Success|ERROR'
printf '%s' "$SECRET" | npx --yes wrangler@4.168.0 secret put YT_CLIENT_SECRET 2>&1 | grep -E 'Success|ERROR'
unset ID SECRET
rm -f "$F"
echo "OK"
