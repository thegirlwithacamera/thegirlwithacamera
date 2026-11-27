#!/bin/bash
# Met le compteur de clics en ligne. A lancer depuis n'importe ou :
#   bash workers/links/deploy.sh
# La cle de lecture est creee une seule fois et gardee dans .env.stats-key
# (fichier ignore par git). Elle n'est jamais affichee par ce script.
set -e
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd "$(dirname "$0")"

npx --no-install wrangler d1 execute tgwac-links --remote --file=schema.sql -y >/dev/null
echo "base prete"

npx --no-install wrangler deploy 2>&1 | grep -E 'https://|Deployed|ERROR' || true

if [ ! -f .env.stats-key ]; then
  openssl rand -hex 16 > .env.stats-key
  chmod 600 .env.stats-key
fi
npx --no-install wrangler secret put STATS_KEY < .env.stats-key 2>&1 | grep -E 'Success|ERROR' || true
