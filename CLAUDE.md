# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Girl With A Camera** - Portfolio de photographe et blog de création de contenu pour Sandrine CPPNS.

Site web editorial style magazine de mode avec :
- Page d'accueil portfolio
- Portfolio photos (avec filtrage par catégorie)
- Portfolio création de contenu
- Blog
- Page À propos
- Page Contact

## Tech Stack

- **Framework**: Next.js 16.2.3 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Fonts**: EB Garamond (serif), Inter (sans-serif), via next/font
- **Deployment**: Vercel

## Commands

```bash
# Development
npm run dev          # Lance le serveur de dev sur http://localhost:3000

# Production
npm run build        # Build de production
npm run start        # Lance le serveur de production

# Linting
npm run lint         # ESLint
```

## Architecture

```
app/
├── layout.tsx       # Layout global avec Header + Footer
├── page.tsx         # Page d'accueil
├── globals.css      # Styles globaux + Tailwind
├── components/
│   ├── Header.tsx   # Navigation responsive
│   └── Footer.tsx   # Footer avec liens
├── portfolio/       # Page portfolio photos
├── creation/        # Page création de contenu
├── blog/            # Page blog
├── a-propos/        # Page à propos
└── contact/         # Page contact
```

## Design System

Direction éditoriale depuis le 08/09/2026 (magazine, photobook, sobre, fond blanc) :
- **Couleurs** : variables dans `app/[lang]/globals.css`. `--paper` #FFFFFF (fond blanc), `--ink` #141414 (texte), `--brick` #8C3A2B (accent, italiques des titres uniquement), `--stone` #6B6560 (texte secondaire), `--line` #E3DDD3 (filets). Aucune couleur en dur dans les pages.
- **Typographie** : EB Garamond (titres, textes éditoriaux, légendes), Inter (menus, eyebrows, formulaire). Échelle `--text-xl` à `--text-label`. Jamais sous 11 px.
- **Composants** : `app/[lang]/components/editorial/` (Eyebrow, Display avec `*italique brique*`, Lede, Caption, Cta, PageHead, ProjectGrid, ProjectCard, Section). Styles en CSS Modules, un par composant ou par page. Pas de bloc `<style>` dans les pages.
- **Identité conservée** : grille 3 colonnes (2 sur mobile), mockups téléphone sur Creator (`components/showcase.css`).

## Images

Les images sont stockées dans `public/images/`. Pour ajouter de nouvelles photos :
1. Placer les fichiers dans le dossier approprié
2. Mettre à jour les tableaux de données dans les pages correspondantes

## Deployment

Le site est déployé sur Vercel. Connecter le repository GitHub et configurer le nom de domaine `thegirlwithacamera.com` dans les paramètres Vercel.
