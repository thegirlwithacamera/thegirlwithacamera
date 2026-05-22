// ============================================================
//  🎨 FICHIER DE CONFIGURATION — THE GIRL WITH A CAMERA
// ============================================================
//  C'est ici que tu modifies TOUT le contenu du site.
//  Tu n'as pas besoin de toucher au code des pages.
//
//  COMMENT MODIFIER :
//  - Texte        → change la valeur entre les guillemets ""
//  - Image        → remplace le chemin "/images/..." par le tien
//                   (le fichier doit être dans public/)
//  - Lien         → remplace l'URL "https://..."
//  - Vrai/faux    → change true ou false
// ============================================================

// ─────────────────────────────────────────
//  IDENTITÉ & CONTACTS
// ─────────────────────────────────────────
export const identity = {
  // Ton nom affiché partout sur le site
  name: "Sandrine Ceuppens",

  // Nom de marque (utilisé dans le logo de nav)
  brandName: "The Girl With A Camera",

  // Ta ville
  city: "Brussels",

  // Email principal (formulaire de contact, footer)
  email: "hello@thegirlwithacamera.com",

  // Email presse (page press kit)
  pressEmail: "press@thegirlwithacamera.com",

  // URL du site en production
  siteUrl: "https://thegirlwithacamera.com",
};

// ─────────────────────────────────────────
//  RÉSEAUX SOCIAUX
// ─────────────────────────────────────────
export const social = {
  // Lien Instagram
  instagram: "https://www.instagram.com/sandrinecppns/",

  // Handle affiché (ex: @sandrinecppns)
  instagramHandle: "@sandrinecppns",

  // Lien Threads (laisse "" si tu n'as pas)
  threads: "https://www.threads.net/@sandrinecppns",

  // Lien LinkedIn (laisse "" si tu n'as pas)
  linkedin: "",

  // Lien TikTok (laisse "" si tu n'as pas)
  tiktok: "",
};

// ─────────────────────────────────────────
//  DISPONIBILITÉ
// ─────────────────────────────────────────
export const availability = {
  // Mets false si tu n'es pas disponible pour de nouveaux projets
  open: true,

  // Message affiché dans le header / contact quand tu es dispo
  message: {
    fr: "Disponible : projets de mai à août 2026",
    en: "Available: projects May to August 2026",
  },
};

// ─────────────────────────────────────────
//  COLLABORATIONS (logos affichés sur la homepage)
// ─────────────────────────────────────────
export const partners = [
  { name: "Ricoh Europe",  url: "https://www.ricoh-imaging.eu/" },
  { name: "Pentax Europe", url: "https://www.ricoh-imaging.eu/pentax/" },
  // Ajoute d'autres partenaires comme ça :
  // { name: "Nom de la marque", url: "https://..." },
];

// ─────────────────────────────────────────
//  HOMEPAGE — ACCROCHE PRINCIPALE
// ─────────────────────────────────────────
export const hero = {
  // Sous-titre au-dessus du titre (petit texte en haut)
  eyebrow: {
    fr: "Photographe documentaire & éditoriale · Bruxelles",
    en: "Documentary & editorial photographer · Brussels",
  },

  // Titre principal
  titleLine1: {
    fr: "Ce qui est là,",
    en: "What is there,",
  },
  titleLine2: {
    fr: "tel que c'était.",
    en: "as it was.",
  },

  // Tagline sous le titre principal
  tagline: {
    fr: "Photographie de rue · Mode · Voyage · Ricoh GR",
    en: "Street photography · Fashion · Travel · Ricoh GR",
  },
};

// ─────────────────────────────────────────
//  HOMEPAGE — GRILLE DE PHOTOS
// ─────────────────────────────────────────
//  Chaque entrée = une cellule dans la grille.
//  - src    : chemin de l'image (dans public/)
//  - href   : lien quand on clique (ex: "/gallery/mercato")
//  - cat    : petite étiquette colorée (en FR et EN)
//  - title  : titre affiché au hover (laisse "" pour pas de titre)
//  - wide   : true = la cellule prend 2 colonnes (plus large)
//  - tall   : true = la cellule prend 2 rangées (plus haute)
// ─────────────────────────────────────────
export const homeGrid = [
  {
    src: "/images/series/dramatic-bw/cover.JPG",
    href: "/gallery/dramatic-bw",
    cat: { fr: "Autoportraits · 2026", en: "Self-portraits · 2026" },
    title: "Dramatic B&W",
    wide: false,
    tall: false,
  },
  {
    src: "/images/series/behind-doors/cover.JPG",
    href: "/gallery/behind-doors",
    cat: { fr: "Sicile · 2026", en: "Sicily · 2026" },
    title: "Behind Doors",
    wide: false,
    tall: false,
  },
  {
    src: "/images/series/mercato/cover.jpg",
    href: "/gallery/mercato",
    cat: { fr: "Palerme · 2026", en: "Palermo · 2026" },
    title: "Mercato",
    wide: false,
    tall: false,
  },
  {
    src: "/images/series/color-hunting/cover.jpg",
    href: "/gallery/color-hunting",
    cat: { fr: "En cours · 2026", en: "Ongoing · 2026" },
    title: "Color Hunting",
    wide: false,
    tall: false,
  },
  {
    src: "/images/series/workers/cover.jpg",
    href: "/gallery/workers",
    cat: { fr: "Osaka · Tokyo · Kyoto", en: "Osaka · Tokyo · Kyoto" },
    title: "Workers",
    wide: false,
    tall: false,
  },
  // ─── Pour ajouter une photo, copie-colle ce bloc : ───
  // {
  //   src: "/images/ton-image.jpg",      ← ton fichier dans public/
  //   href: "/gallery",                  ← où ça pointe quand on clique
  //   cat: { fr: "Galerie", en: "Gallery" },
  //   title: "Mon titre",
  //   wide: false,
  //   tall: false,
  // },
];

// ─────────────────────────────────────────
//  PAGE À PROPOS — TEXTES
// ─────────────────────────────────────────
export const about = {
  // Photo principale de la page À propos
  // → remplace par "/images/ton-portrait.jpg"
  photo: "/images/about.jpg",

  bio: {
    fr: {
      // Phrase d'accroche (titre en gras)
      headline: "J'ai eu un appareil photo entre les mains depuis l'enfance.",

      // Paragraphes (tu peux en ajouter autant que tu veux)
      paragraphs: [
        "Puis la vie a pris le dessus, et je l'ai posé. En 2024, je l'ai repris. Ce qui est revenu n'était pas juste une passion. C'était une façon de voir.",
        "Je photographie les rues, la lumière, les moments silencieux. Ceux qu'on ne remarque pas. Mon travail se situe à la croisée du documentaire et de la mode. Post-traitement minimal. Je touche à peine l'image. Ce qui est là, tel que c'était.",
        "Au-delà de la photo, je crée du contenu vidéo : scripting, tournage, montage. Actuellement avec Ricoh et Pentax Europe. Je construis un corpus de travail personnel que j'aimerais voir publié.",
      ],

      // Ligne sous la bio (ville, dispo)
      based: "Basée à Bruxelles. Disponible pour voyager.",
    },
    en: {
      headline: "I've had a camera in my hands since I was a child.",
      paragraphs: [
        "Then life happened, and I put it down. In 2024, I picked it up again. What came back wasn't just a hobby. It was a way of seeing.",
        "I photograph streets, light, and quiet moments. The kind that go unnoticed. My work sits at the intersection of documentary and fashion. Minimal editing. I barely touch the image after. Just what's there, as it was.",
        "Beyond stills, I create video content: scripting, filming, editing. Currently working with Ricoh and Pentax Europe. I'm building a body of personal work I want to see in print.",
      ],
      based: "Based in Brussels. Available to travel.",
    },
  },

  // Les 3 blocs "Ce que je fais"
  services: {
    fr: [
      {
        title: "Photographie",
        desc: "Street, documentaire, voyage, mode.\nSéries personnelles et travail éditorial.",
      },
      {
        title: "Vidéo & Contenu",
        desc: "Scripting, tournage, montage.\nContenu de marque pour les réseaux sociaux.",
      },
      {
        title: "Collaborations",
        desc: "Ricoh Europe · Pentax Europe\nOuverte aux marques et magazines.",
      },
    ],
    en: [
      {
        title: "Photography",
        desc: "Street, documentary, travel, fashion.\nPersonal series and editorial work.",
      },
      {
        title: "Video & Content",
        desc: "Scripting, filming, editing.\nBrand content for social media.",
      },
      {
        title: "Collaborations",
        desc: "Ricoh Europe · Pentax Europe\nOpen to brands and magazines.",
      },
    ],
  },
};

// ─────────────────────────────────────────
//  PAGE CONTACT — TEXTES
// ─────────────────────────────────────────
export const contact = {
  fr: {
    title: "Ouvrir une conversation.",
    desc: "Pour les marques et magazines qui ont quelque chose à dire — projets éditoriaux, collaborations créatives, commandes photographiques.",
    btnEmail: "Écrire un message",
    btnInstagram: "Instagram",
  },
  en: {
    title: "Start a conversation.",
    desc: "For brands and publications with something to say — editorial projects, creative collaborations, photographic commissions.",
    btnEmail: "Send a message",
    btnInstagram: "Instagram",
  },
};

// ─────────────────────────────────────────
//  FOOTER — TEXTE COPYRIGHT
// ─────────────────────────────────────────
export const footer = {
  // Tu peux changer l'année ou le texte
  copyright: `© ${new Date().getFullYear()} Sandrine Ceuppens · Bruxelles · Tous droits réservés`,
};
