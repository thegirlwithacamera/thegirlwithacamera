#!/bin/bash
# A lancer par Sandrine, une fois, dans le Terminal :
#   bash ~/Developer/tgwac-website/workers/publier/alerte.sh
# Te demande ta cle Resend (elle ne s'affiche pas quand tu la colles) et la
# range chiffree dans Cloudflare, pour les emails d'alerte.
set -e
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd "$(dirname "$0")"
printf "Colle ta cle Resend puis appuie sur Entree (rien ne s'affiche, c'est normal) : "
read -rs CLE_RESEND
echo
if [ -z "$CLE_RESEND" ]; then echo "Rien colle, on arrete."; exit 1; fi
printf '%s' "$CLE_RESEND" | npx --yes wrangler@4.168.0 secret put RESEND_KEY 2>&1 | grep -E 'Success|ERROR'
unset CLE_RESEND
echo "C'est fait. Tu peux fermer cette fenetre."
