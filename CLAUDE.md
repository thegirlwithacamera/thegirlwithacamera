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
- **Fonts**: Playfair Display (serif), Inter (sans-serif)
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

- **Couleurs** : Fond blanc (#FFFFFF), Texte noir (#000000), Muted (#737373), Border (#e5e5e5)
- **Typography** : Playfair Display (titres), Inter (corps)
- **Style** : Éditorial, minimaliste, magazine de mode

## Images

Les images sont stockées dans `public/images/`. Pour ajouter de nouvelles photos :
1. Placer les fichiers dans le dossier approprié
2. Mettre à jour les tableaux de données dans les pages correspondantes

## Deployment

Le site est déployé sur Vercel. Connecter le repository GitHub et configurer le nom de domaine `thegirlwithacamera.com` dans les paramètres Vercel.
