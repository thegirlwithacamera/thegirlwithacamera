# thegirlwithacamera.com

Site éditorial de Sandrine Ceuppens — photographe et créatrice de contenu basée à Bruxelles.

## Stack
- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4
- Sanity (journal) · Resend (emails contact + newsletter) · Vercel (hosting)
- Bilingue FR / EN sous `/[lang]/...`

## Démarrer en local

```bash
npm install
npm run dev
```

Site : `http://localhost:3000` (redirige vers `/fr` ou `/en` selon `Accept-Language`).

## Variables d'environnement

À placer dans `.env.local` (et dans Vercel) :

```
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
RESEND_API_KEY=re_...
# Optionnel : si tu veux que les emails newsletter soient ajoutés à une audience Resend
RESEND_AUDIENCE_ID=...
```

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de dev |
| `npm run build` | Build prod |
| `npm run start` | Serveur prod |
| `npm run lint` | ESLint |
| `npm run optimize:images` | Compresse les JPG sous `/public/images` (resize 1800px + qualité 82). Backup dans `/public/images/_originals`. Nécessite `npm i -D sharp`. |

## Structure

```
app/
  [lang]/                 toutes les pages publiques bilingues
    page.tsx              accueil
    gallery/              séries (liste + détail + lightbox)
    creation/             vidéo / brand content
    services/             3 offres + process + FAQ
    blog/                 journal Sanity
    about/  press/  now/  contact/  legal/{privacy,mentions}/
    components/           Header, Footer, LanguageSwitcher, Lightbox
  api/contact/            Resend + rate limit + honeypot
  api/newsletter/         signup (Resend audience ou notification email)
  studio/[[...tool]]/     Sanity Studio
  sitemap.ts robots.ts opengraph-image.tsx page.tsx not-found.tsx
lib/
  site.ts                 source unique des infos (URL, statut, contact, partenaires)
  series.ts               toutes les séries photo
  creations.ts            tous les projets vidéo
  sanity.client.ts sanity.queries.ts
public/images/            série/cover.jpg + photos numérotées
scripts/optimize-images.mjs
```

## À faire de ton côté (ce que je ne peux pas inventer)

1. **Compresser les images** — `npm i -D sharp && npm run optimize:images`. Diminue les JPG de 3-8 Mo → 200-400 Ko.
2. **Mettre à jour `lib/site.ts`** — vraie disponibilité, partenaires, numéro d'entreprise (BCE) pour les mentions légales.
3. **Mettre à jour `lib/series.ts`** — affiner les descriptions pour le SEO (mots-clés naturels : « street photography Brussels », « documentary Sicily »).
4. **Mettre à jour `lib/creations.ts`** — héberger les vidéos (Mux/Cloudflare Stream/Vimeo) et remplacer `instagramId` par `videoUrl + poster`.
5. **Page `/press`** — ajouter les vraies mentions presse au fur et à mesure dans `app/[lang]/press/page.tsx`.
6. **Page `/now`** — actualiser tous les 1-2 mois (date + sections).
7. **Mentions légales** — ajouter le numéro BCE.
8. **Resend** — créer une « Audience » et coller son ID dans `RESEND_AUDIENCE_ID` pour que les inscrits newsletter soient stockés au bon endroit.
9. **Favicon + OG** — remplacer le `favicon.ico` Next par défaut par un wordmark. L'OG image se génère automatiquement via `app/opengraph-image.tsx`.
10. **Analytics** — activer Vercel Analytics (gratuit, RGPD-friendly).
11. **Domain email** — vérifier que `hello@` et `press@` sont bien configurés (DKIM/SPF) côté Resend.
12. **Publier dans le journal** — viser un article tous les 15 jours pour amorcer.

## Déploiement

`git push` → Vercel build automatique. Configurer le domaine `thegirlwithacamera.com` dans Vercel → Domains.
