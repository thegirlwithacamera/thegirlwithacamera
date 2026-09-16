# Journal

Un article = un fichier `.md` dans ce dossier. Le nom du fichier devient
l'adresse de la page : `tokyo-at-five.md` donne `/en/journal/tokyo-at-five`.

En haut du fichier, entre les deux lignes `---` :

```
---
title: Tokyo at five in the morning
date: 2026-09-20
place: Tokyo, Japan
cover: /images/journal/tokyo-at-five/cover.jpg
excerpt: One sentence that makes people want to read.
---
```

`title` et `date` sont obligatoires. Ajoute `draft: true` pour préparer un
article sans le publier. Un fichier qui commence par `_` n'est jamais publié.

Ensuite, le texte :

- un paragraphe par bloc, séparé par une ligne vide
- `## Titre` et `### Sous-titre`
- une photo seule sur sa ligne : `![Légende](/images/journal/tokyo-at-five/1.jpg)`
- `*italique*`, `**gras**`, `[lien](https://...)`
- `> citation`
- listes avec `- `

Les photos vont dans `public/images/journal/<nom-de-l-article>/`, en JPG
de 1800 px de large au maximum.
