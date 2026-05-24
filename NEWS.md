# Galerie News/Brand Content

## Vue d'ensemble
La page News (`/[lang]/news`) est une **galerie visuelle** minimaliste qui affiche **tous tes contenus professionnels** : vidéos partagées par les marques, tes publications dans des magazines, et tes projets créatifs.

### Ce qu'on y met :
✅ **Vidéos des marques** (TikTok Ricoh, Instagram Reels Pentax, etc.)
✅ **Publications magazines** (Vogue, Design Boom, etc.)
✅ **Projets créatifs** (photos/vidéos significatives)

### Format & Affichage :
- **Route** : `/[lang]/news` (ex: `/fr/news`, `/en/news`)
- **Grille** : 3 colonnes desktop, 2 tablet, 1 mobile
- **Format items** : Portrait 9:16 (comme TikTok/Instagram Stories)
- **Hover effects** : 
  - Vidéos : affiche marque + icône play
  - Publications : affiche badge "PUBLICATION" + nom du magazine + date

## Format des Éléments

Chaque item peut être une **vidéo**, **image** ou **publication magazine** :

```typescript
{
  id: "item-1",               // ID unique
  type: "video" | "image" | "publication",  // Type de média
  src: "/images/...",         // Chemin local OU URL externe
  thumbnail?: "...",          // (Optionnel) Miniature vidéo
  link?: "https://...",       // Lien vers le post/article original
  brand?: "RICOH EUROPE",     // Marque ou nom du magazine
  title?: { fr: "...", en: "..." },  // (Optionnel) Titre
  publication?: {             // PUBLICATION uniquement
    name?: "Vogue France",
    date?: "Mai 2025",
    url?: "https://vogue.fr/article",
  }
}
```

## Comment Ajouter du Contenu

### 📺 Vidéos - Option 1 : Hébergées localement
1. Placer les fichiers vidéo dans `/public/videos/`
2. Ajouter à `GALLERY_ITEMS` :

```typescript
{
  id: "ricoh-tiktok-1",
  type: "video",
  src: "/videos/ricoh-tiktok-001.mp4",
  thumbnail: "/images/gallery/ricoh-thumb-1.jpg",
  link: "https://www.tiktok.com/@ricoh/video/...",
  brand: "RICOH EUROPE",
}
```

### 📺 Vidéos - Option 2 : YouTube/Vimeo
Utiliser l'URL d'embed directement :

```typescript
{
  id: "pentax-youtube-1",
  type: "video",
  src: "https://www.youtube.com/embed/VIDEO_ID",  // Embed, pas la URL normale
  link: "https://youtube.com/watch?v=VIDEO_ID",
  brand: "PENTAX EUROPE",
}
```

### 🖼️ Images
```typescript
{
  id: "insta360-carousel-1",
  type: "image",
  src: "/images/gallery/insta360-carousel.jpg",
  link: "https://www.instagram.com/p/POST_ID/",
  brand: "INSTA360",
}
```

### 📰 Publications Magazines / Articles
Pour tes publications dans des magazines, journaux ou sites éditoriaux :

```typescript
{
  id: "magazine-vogue-1",
  type: "publication",
  src: "/images/gallery/magazine-vogue-cover.jpg",  // Couverture ou capture d'article
  link: "https://www.vogue.fr/article/...",         // Lien vers l'article complet
  brand: "VOGUE FRANCE",                             // Nom du magazine
  publication: {
    name: "Vogue France",                            // Titre du magazine
    date: "Mai 2025",                                // Mois/année de publication
    url: "https://www.vogue.fr/article/...",        // (Optionnel, redondant avec link)
  }
}
```

**Affichage** :
- Badge "PUBLICATION" en haut à droite
- Au hover : affiche le nom du magazine et la date
- Lien cliquable vers l'article complet

## Où Obtenir les Vidéos

### TikTok / Instagram Reels
1. Ouvrir le post sur TikTok/Instagram
2. Télécharger la vidéo (pas de watermark possible avec les téléchargements directs)
3. Placer dans `/public/videos/`
4. Lier avec `link` vers le post original

### YouTube
1. Obtenir l'ID vidéo de l'URL : `youtube.com/watch?v=**ABC123XYZ**`
2. Utiliser : `https://www.youtube.com/embed/ABC123XYZ`

### Vimeo
1. Obtenir l'ID vidéo de l'URL : `vimeo.com/**123456789**`
2. Utiliser : `https://player.vimeo.com/video/123456789`

## Exemple Complet

```typescript
const GALLERY_ITEMS: GalleryItem[] = [
  // Ricoh TikTok video
  {
    id: "ricoh-tiktok-sept-2025",
    type: "video",
    src: "/videos/ricoh-content-sept-2025.mp4",
    thumbnail: "/images/gallery/ricoh-thumb.jpg",
    link: "https://www.tiktok.com/@ricoheurope/video/...",
    brand: "RICOH EUROPE",
  },
  
  // Pentax Instagram Reel
  {
    id: "pentax-insta-reel-aug-2025",
    type: "video",
    src: "/videos/pentax-reel-aug-2025.mp4",
    thumbnail: "/images/gallery/pentax-thumb.jpg",
    link: "https://www.instagram.com/pentaxeurope/reel/...",
    brand: "PENTAX EUROPE",
  },
  
  // Publication Vogue
  {
    id: "vogue-france-may-2025",
    type: "publication",
    src: "/images/gallery/vogue-france-cover.jpg",
    link: "https://www.vogue.fr/article/sandrine-ceuppens/...",
    brand: "VOGUE FRANCE",
    publication: {
      name: "Vogue France",
      date: "Mai 2025",
      url: "https://www.vogue.fr/article/...",
    }
  },
  
  // Insta360 YouTube
  {
    id: "insta360-youtube-tutorial",
    type: "video",
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    link: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    brand: "INSTA360",
  },
  
  // Image / Carousel
  {
    id: "insta360-carousel",
    type: "image",
    src: "/images/gallery/insta360-carousel.jpg",
    link: "https://www.instagram.com/p/XYZ123/",
    brand: "INSTA360",
  },
  
  // Publication Blog/Magazine en ligne
  {
    id: "designboom-article-march-2025",
    type: "publication",
    src: "/images/gallery/designboom-feature.jpg",
    link: "https://www.designboom.com/design/sandrine-ceuppens/...",
    brand: "DESIGNBOOM",
    publication: {
      name: "Design Boom",
      date: "Mars 2025",
      url: "https://www.designboom.com/design/...",
    }
  },
];
```

## Design

### Layout
- **Desktop** : 3 colonnes
- **Tablet** : 2 colonnes
- **Mobile** : 1 colonne (ou 2 selon l'écran)

### Aspect Ratio
- **Format** : 9:16 (portrait, comme TikTok/Instagram Stories)
- **Border** : Léger (1px gris #ebebeb)
- **Border Radius** : 12px (8px mobile)

### Hover Effects
- Légère ombre
- Border plus foncée
- Marque visible
- Play icon (vidéos seulement)

## Points Importants

1. **Src obligatoire** : Chemin local ou URL externe
2. **Type obligatoire** : "video" ou "image"
3. **Lien optionnel** : Cliquable sur tout l'item si fourni
4. **Brand optionnel** : Affiche au hover en bas à gauche
5. **Bilingue** : Titre peut être bilingue, marque reste en anglais

## Fichiers à Créer

```
public/
├── videos/
│   ├── ricoh-content-1.mp4
│   ├── pentax-content-1.mp4
│   └── ...
└── images/
    └── gallery/
        ├── ricoh-thumb.jpg
        ├── pentax-thumb.jpg
        └── ...
```

## Préparer les Couvertures de Magazines

Pour les publications magazines, il te faut une image qui représente le contenu :

### Options :
1. **Screenshot de la page web** 
   - Ouvre l'article sur le site du magazine
   - Prends une capture d'écran (Cmd+Shift+4 sur Mac)
   - Rogne pour garder la partie pertinente (headline, ton nom, image)
   - Exporte en JPG

2. **Couverture du magazine**
   - Si c'est une publication print, scanne ou photographie la couverture
   - Exporte en JPG

3. **Capture visuelle pertinente**
   - Une photo de toi du projet partagé dans la publication
   - Le logo du magazine + ta photo

**Dimensions** : Idéalement portrait (ratio 9:16), mais n'importe quelle taille fonctionne (elle s'ajuste automatiquement)

## Affichage des Publications

**Badge** : "PUBLICATION" en haut à droite (fond semi-transparent noir)

**Au hover** :
- Gradient sombre en bas
- Affiche le **nom du magazine** (ex: "Vogue France")
- Affiche la **date** (ex: "Mai 2025")

**Clic** : Ouvre le lien vers l'article complet dans un nouvel onglet

## Intégration TikTok/Instagram Embed Avancée

Si tu veux intégrer directement les vidéos TikTok/Instagram sans télécharger (plus tard, besoin de modifs du composant) :

**TikTok Embed** :
```html
<iframe src="https://www.tiktok.com/embed/v2/TIKTOK_VIDEO_ID"></iframe>
```

**Instagram Embed** :
```html
<blockquote class="instagram-media">...</blockquote>
```

(À implémenter si tu le souhaites)

## SEO
- Metadata déjà incluse
- Alt text sur les images
- Schema.org JSON-LD pour la page
- Pas besoin de configuration supplémentaire

## Exemple pour Tester
Les items par défaut affichent des chemins de test. Remplace-les par tes vrais contenus une fois prêt.

## Ordre d'Affichage
La galerie affiche les items dans l'ordre qu'ils apparaissent dans l'array `GALLERY_ITEMS`. 
💡 **Conseil** : Mets les contenus les plus récents ou importants en premier.
