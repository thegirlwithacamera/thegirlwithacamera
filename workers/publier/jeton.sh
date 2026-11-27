#!/bin/bash
# A lancer par Sandrine, une seule fois, dans le Terminal :
#   bash ~/Developer/tgwac-website/workers/publier/jeton.sh
# Copie le jeton Meta de la machine a commentaires vers Cloudflare, sans
# l'afficher nulle part. Il y est garde chiffre, comme secret du Worker.
set -e
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd "$(dirname "$0")"
JETON=$(grep -E '^IG_ACCESS_TOKEN=' ~/Developer/machine-commentaires/.env | head -1 | cut -d= -f2- | tr -d "\"' ")
if [ -z "$JETON" ]; then echo "Jeton introuvable dans machine-commentaires/.env"; exit 1; fi
printf '%s' "$JETON" | npx --yes wrangler@4.168.0 secret put META_TOKEN 2>&1 | grep -E 'Success|ERROR'
unset JETON
echo "C'est fait. Tu peux fermer cette fenetre."
