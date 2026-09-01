// ───────────────────────────────────────────────────────────
// Les offres, source unique.
//
// Elles vivaient dans app/[lang]/about/page.tsx et se sont retrouvees en
// double avec la page Services le 01/09. Deux pages qui vendent la meme
// chose avec deux textes differents, c'est une contradiction qui finit par
// se voir. Elles sont donc sorties ici et la page Services les rend ; la
// page A propos ne parle plus que de Sandrine.
//
// Aucun prix, jamais. La grille tarifaire est prete mais ne se donne pas au
// premier contact, et un tarif publie devient le plafond des suivants.
// ───────────────────────────────────────────────────────────

import { site } from "@/lib/site";

// ── Work with me : 3 offres, sans prix, CTA commun "Let's talk" ──
export type Offer = {
  // Numero d'index, pas un pictogramme. Les trois cartes portaient un emoji
  // systeme (fronton, pellicule, clap) : seule chose du site qui ne sortait
  // pas de la meme typographie que le reste. Retire le 01/09.
  index: string;
  title: string;
  subtitle: string;
  packageName?: string;
  items: string[];
  addonsLabel?: string;
  addons?: string[];
  // Lien de preuve : la page qui montre ce que la carte décrit.
  proof?: { href: string; label: string };
};
export type Work = { title: string; intro: string; letsTalk: string; talkMail: string; offers: Offer[] };

export const TALK_MAIL = "sandrine@thegirlwithacamera.com";

// Les 3 offres matchent les 3 onglets du site : Creator, Filmmaker, Photographer.
// Les 3 offres sont des missions, pas des métiers : on achète un tournage,
// un film, ou du contenu qui revient tous les mois. Hôtels & maisons en premier,
// c'est la direction. Les chiffres de livrables viennent de la grille hôtels
// (03_PARTNERSHIPS/Rate_Cards/GRILLE_HOTELS_2026.md), les prix n'y figurent
// jamais : la grille ne se donne pas au premier contact.
export const WORK: Record<"fr" | "en", Work> = {
  en: {
    title: "WORK WITH ME",
    intro: "Documentary photographer and filmmaker based in Brussels. I mostly work with houses, hotels and tables, in natural light, in real places. Depending on the package, the content goes to your channels, to mine, or to both.",
    letsTalk: "Let's talk",
    talkMail: TALK_MAIL,
    offers: [
      {
        index: "01",
        title: "Hotels & venues",
        subtitle: "The whole place, stills and film. Shot between six and nine, when the building is empty.",
        packageName: "Packages",
        items: [
          "Essential: 1 day and 1 night, 20 edited stills, 2 verticals",
          "Signature: 1 day and 1 night, 30 edited stills, 4 verticals, a 60 to 90s film",
          "Complete: 2 days and 2 nights, 50 edited stills, 6 verticals, a 2 to 3min film",
          "Series of 3 addresses, treated as one body of work, with a connecting film",
          "Two visits a year, one per season, to cover twelve months of publishing",
        ],
        addonsLabel: "What you get on the images",
        addons: [
          "Unlimited organic use by the property shot",
          "Website and booking pages, social, newsletter, OTA listings",
          "Credited press distribution, editorial use",
          "Paid media, print, campaigns, exclusivity, other addresses in the group: scoped and quoted separately based on territory, duration and media",
          "Licence tied to the property, non-transferable on change of ownership or brand",
          "A night on site is part of every package: it is what gives access to the hours when the place is empty",
          "Travel included within two hours by train from Brussels",
        ],
      },
      {
        index: "02",
        title: "Brand film",
        subtitle: "Cinematic films for your campaigns.",
        packageName: "What's included",
        items: [
          "Concept and creative direction",
          "Cinematic editorial look",
          "Long-form film and short cutdowns, Reels and Stories",
          "Narrative editing, sound design",
          "Worldwide usage rights on your organic channels, 12 months",
        ],
        addonsLabel: "Options",
        addons: [
          "Rush delivery",
          "Yearly package, several films across the year",
        ],
      },
      {
        index: "03",
        title: "Ongoing content",
        subtitle: "Vertical video and edited stills for your channels. I create, you post.",
        packageName: "Ways to work",
        items: [
          "Essential: 4 videos a month",
          "Signature: 4 videos and 10 edited stills a month",
          "Intensive: 8 videos and 15 edited stills a month",
          "Or start with a test, or book a one-off",
          "Concept, scripting and editing included",
          "Worldwide usage rights on your organic channels, 12 months",
          "Paid social, all media, exclusivity: quoted separately. Raw files are never handed over",
        ],
        addonsLabel: "Or on my channels",
        addons: [
          "Reel cross-posted to TikTok, with Stories",
          "Reel and a series of edited stills, or three Reels",
          `${site.instagramFollowers.en.toLowerCase()}+ followers, 497k views in 30 days`,
        ],
        proof: { href: "/creator", label: "See the formats" },
      },
    ],
  },
  fr: {
    title: "TRAVAILLER AVEC MOI",
    intro: "Photographe et vidéaste documentaire, basée à Bruxelles. Je travaille surtout avec des maisons, des hôtels et des tables, en lumière naturelle, dans de vrais lieux. Selon la formule, le contenu part sur vos canaux, sur les miens, ou sur les deux.",
    letsTalk: "Parlons-en",
    talkMail: TALK_MAIL,
    offers: [
      {
        index: "01",
        title: "Hôtels & maisons",
        subtitle: "Le lieu entier, photo et film. Tourné entre six et neuf heures, quand le bâtiment est vide.",
        packageName: "Les formules",
        items: [
          "Essentiel : 1 journée et 1 nuit, 20 photos éditées, 2 verticaux",
          "Signature : 1 journée et 1 nuit, 30 photos éditées, 4 verticaux, un film de 60 à 90 s",
          "Complet : 2 journées et 2 nuits, 50 photos éditées, 6 verticaux, un film de 2 à 3 min",
          "Série de 3 adresses, traitées comme un corpus, avec un film de liaison",
          "Deux passages par an, une saison chacun, pour couvrir douze mois de publication",
        ],
        addonsLabel: "Ce que vous obtenez sur les images",
        addons: [
          "Usage organique illimité par la maison shootée",
          "Site et pages de réservation, réseaux, newsletter, fiches OTA",
          "Distribution presse créditée, à usage éditorial",
          "Publicité payante, print, campagnes, exclusivité, autres adresses du groupe : facturés séparément selon le territoire, la durée et les médias",
          "Licence attachée à l'établissement, non transférable en cas de changement de propriétaire ou d'enseigne",
          "La nuit sur place fait partie de toutes les formules : c'est ce qui donne accès aux heures où le lieu est vide",
          "Transport inclus dans un rayon de moins de 2 h de train depuis Bruxelles",
        ],
      },
      {
        index: "02",
        title: "Film de marque",
        subtitle: "Films cinématiques pour vos campagnes.",
        packageName: "Ce qui est inclus",
        items: [
          "Concept et direction créative",
          "Rendu cinématique et éditorial",
          "Film long format et déclinaisons courtes, Reels et Stories",
          "Montage narratif, sound design",
          "Droits d'usage monde sur vos canaux organiques, 12 mois",
        ],
        addonsLabel: "Options",
        addons: [
          "Livraison express",
          "Forfait annuel, plusieurs films dans l'année",
        ],
      },
      {
        index: "03",
        title: "Contenu récurrent",
        subtitle: "Vidéo verticale et photos éditées pour vos canaux. Je crée, vous publiez.",
        packageName: "Comment on travaille",
        items: [
          "Essential : 4 vidéos par mois",
          "Signature : 4 vidéos et 10 photos par mois",
          "Intensive : 8 vidéos et 15 photos par mois",
          "Ou un premier test, ou une session à l'unité",
          "Concept, scénario et montage inclus",
          "Droits d'usage monde sur vos canaux organiques, 12 mois",
          "Paid social, tous médias, exclusivité : sur devis. Les fichiers bruts ne se cèdent pas",
        ],
        addonsLabel: "Ou sur mes canaux",
        addons: [
          "1 Reel republié sur TikTok, avec Stories",
          "1 Reel et une série de photos éditées, ou trois Reels",
          `${site.instagramFollowers.fr.toLowerCase()}+ abonnés, 497k vues sur 30 jours`,
        ],
        proof: { href: "/creator", label: "Voir les formats" },
      },
    ],
  },
};
