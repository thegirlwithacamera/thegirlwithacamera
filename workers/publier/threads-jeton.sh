#!/bin/bash
# A lancer par Sandrine, une seule fois, dans le Terminal :
#   bash ~/Developer/tgwac-website/workers/publier/threads-jeton.sh
# Colle le jeton Threads genere dans Meta, puis Entree. Rien ne s'affiche
# pendant que tu colles : c'est normal. Il part directement chez Cloudflare,
# garde chiffre, et l'outil le renouvelle tout seul chaque semaine.
set -e
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd "$(dirname "$0")"
printf 'Colle le jeton Threads puis appuie sur Entree : '
read -rs JETON
echo
JETON=$(printf '%s' "$JETON" | tr -d "\"' \r\n")
if [ ${#JETON} -lt 40 ]; then echo "Ce jeton semble incomplet, recommence."; exit 1; fi
printf '%s' "$JETON" | npx --yes wrangler@4.168.0 secret put THREADS_TOKEN 2>&1 | grep -E 'Success|ERROR'
unset JETON
echo "C'est fait. Tu peux fermer cette fenetre."
