// Single source of truth for site-wide config.
// Edit this file when your status, contact, social, or pricing changes.

export const site = {
  name: "Sandrine Ceuppens",
  tagline: "The Girl With A Camera",
  url: "https://thegirlwithacamera.com",
  email: "hello@thegirlwithacamera.com",
  pressEmail: "press@thegirlwithacamera.com",
  city: "Brussels",
  country: "Belgium",
  // Compteur d'abonnes Instagram, source unique. Format decimal par langue
  // (virgule en FR, point en EN). Mettre a jour ici uniquement.
  instagramFollowers: { fr: "33,3K", en: "33.3K" },
  // Set to false if you go off-grid for a while (sabbatical, full project pipeline).
  availability: {
    open: true,
    nextWindow: {
      fr: "Disponible : projets de mai à août 2026",
      en: "Available : projects May to August 2026",
    },
  },
  social: {
    instagram: "https://www.instagram.com/sandrinecppns/",
    threads: "https://www.threads.net/@sandrinecppns",
    tiktok: "https://www.tiktok.com/@sandrinecppns",
    instagramHandle: "@sandrinecppns",
  },
  partners: [
    { name: "Ricoh Europe", url: "https://www.ricoh-imaging.eu/" },
    { name: "Pentax Europe", url: "https://www.ricoh-imaging.eu/pentax/" },
  ],
} as const;

export type Lang = "fr" | "en";

export function alt<T>(lang: Lang, fr: T, en: T): T {
  return lang === "fr" ? fr : en;
}
