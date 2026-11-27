#!/bin/bash
# Met l'outil de programmation en ligne : bash workers/publier/deploy.sh
set -e
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd "$(dirname "$0")"
W="npx --yes wrangler@4.168.0"
$W d1 execute tgwac-links --remote --file=schema.sql -y >/dev/null
echo "base prete"
$W deploy 2>&1 | grep -E 'https://|Deployed|ERROR|schedule' || true
# Meme cle privee que la page des clics et le tableau de bord.
$W secret put CLE < ../links/.env.stats-key 2>&1 | grep -E 'Success|ERROR' || true
