import Image from "next/image";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import TrustLogos from "../components/TrustLogos";
import HashScroll from "../components/HashScroll";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "About",
    description: lang === "fr"
      ? "À propos de Sandrine Ceuppens. Photographe documentaire et créatrice de contenu basée à Bruxelles. Collaborations avec Ricoh Europe, Pentax Europe et Insta360."
      : "About Sandrine Ceuppens. Documentary photographer and content creator based in Brussels. Collaborations with Ricoh Europe, Pentax Europe and Insta360.",
    alternates: { canonical: `/${lang}/about`, languages: { fr: "/fr/about", en: "/en/about" } },
  };
}

// Photo du hero (Mont Fuji, IMG_8304).
const HERO_PHOTO = "/images/about/hero.jpg";

// Clients (bande "Ils me font confiance") : donnees dans lib/brands.ts,
// rendu via le composant partage TrustLogos (reutilise aussi sur /creator).

// ── Work with me : 3 offres, sans prix, CTA commun "Let's talk" ──
type Offer = {
  emoji: string;
  title: string;
  subtitle: string;
  packageName?: string;
  items: string[];
  addonsLabel?: string;
  addons?: string[];
};
type Work = { title: string; intro: string; letsTalk: string; talkMail: string; offers: Offer[] };

const TALK_MAIL = "sandrine@thegirlwithacamera.com";

// Les 3 offres matchent les 3 onglets du site : Creator, Filmmaker, Photographer.
// Les 3 offres sont des missions, pas des métiers : on achète un tournage,
// un film, ou du contenu qui revient tous les mois. Hôtels & maisons en premier,
// c'est la direction. Les chiffres de livrables viennent de la grille hôtels
// (03_PARTNERSHIPS/Rate_Cards/GRILLE_HOTELS_2026.md), les prix n'y figurent
// jamais : la grille ne se donne pas au premier contact.
const WORK: Record<"fr" | "en", Work> = {
  en: {
    title: "WORK WITH ME",
    intro: "Documentary photographer and filmmaker based in Brussels. I mostly work with houses, hotels and tables, in natural light, in real places. Nothing is posted on my channels unless you want it to be.",
    letsTalk: "Let's talk",
    talkMail: TALK_MAIL,
    offers: [
      {
        emoji: "🏛️",
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
        emoji: "🎞️",
        title: "Brand film",
        subtitle: "Cinematic films for your campaigns.",
        packageName: "What's included",
        items: [
          "Concept and creative direction",
          "Filmed on Luna Ultra, cinematic editorial look",
          "Long-form film and short cutdowns, Reels and Stories",
          "Narrative editing, sound design",
          "Worldwide usage rights on your organic channels, 12 months",
        ],
        addonsLabel: "Options",
        addons: [
          "Raw footage on request",
          "Rush delivery",
          "Yearly package, several films across the year",
        ],
      },
      {
        emoji: "🎬",
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
          "Paid social, all media, exclusivity, raw files: quoted separately",
        ],
        addonsLabel: "Or on my channels",
        addons: [
          "Reel cross-posted to TikTok, with Stories",
          "Reel and a series of edited stills, or three Reels",
          `${site.instagramFollowers.en.toLowerCase()}+ followers, 497k views in 30 days`,
        ],
      },
    ],
  },
  fr: {
    title: "TRAVAILLER AVEC MOI",
    intro: "Photographe et vidéaste documentaire, basée à Bruxelles. Je travaille surtout avec des maisons, des hôtels et des tables, en lumière naturelle, dans de vrais lieux. Rien n'est publié sur mes canaux sauf si vous le voulez.",
    letsTalk: "Parlons-en",
    talkMail: TALK_MAIL,
    offers: [
      {
        emoji: "🏛️",
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
        emoji: "🎞️",
        title: "Film de marque",
        subtitle: "Films cinématiques pour vos campagnes.",
        packageName: "Ce qui est inclus",
        items: [
          "Concept et direction créative",
          "Filmé sur Luna Ultra, rendu cinématique et éditorial",
          "Film long format et déclinaisons courtes, Reels et Stories",
          "Montage narratif, sound design",
          "Droits d'usage monde sur vos canaux organiques, 12 mois",
        ],
        addonsLabel: "Options",
        addons: [
          "Rushes bruts sur demande",
          "Livraison express",
          "Forfait annuel, plusieurs films dans l'année",
        ],
      },
      {
        emoji: "🎬",
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
          "Paid social, tous médias, exclusivité, fichiers bruts : sur devis",
        ],
        addonsLabel: "Ou sur mes canaux",
        addons: [
          "1 Reel republié sur TikTok, avec Stories",
          "1 Reel et une série de photos éditées, ou trois Reels",
          `${site.instagramFollowers.fr.toLowerCase()}+ abonnés, 497k vues sur 30 jours`,
        ],
      },
    ],
  },
};

const content = {
  fr: {
    name: "SANDRINE CEUPPENS",
    role: "Photographe et vidéaste documentaire · Hôtels, tables et maisons · Bruxelles",
    followersLabel: "ABONNÉS INSTAGRAM",
    skills: "COMPÉTENCES",
    projectsPdf: "Projets récents (PDF)",
    based: "Bruxelles · disponible pour voyager",
    cta: "On travaille ensemble ?",
    letsTalk: "Écrire un mail",
  },
  en: {
    name: "SANDRINE CEUPPENS",
    role: "Documentary photographer and filmmaker · Hotels, tables and venues · Brussels",
    followersLabel: "INSTAGRAM FOLLOWERS",
    skills: "SKILLS",
    projectsPdf: "Recent projects (PDF)",
    based: "Brussels · available to travel",
    cta: "Want to work together?",
    letsTalk: "Send an email",
  },
};

const SKILLS = {
  en: [
    "Natural light",
    "Interiors & architecture",
    "Table & food",
    "Team portraits",
    "Short film",
    "Digital & film photography",
  ],
  fr: [
    "Lumière naturelle",
    "Intérieurs & architecture",
    "Art de la table",
    "Portraits d'équipe",
    "Film court",
    "Photographie numérique & argentique",
  ],
};

const SOCIALS = [
  {
    label: "Instagram",
    handle: "@sandrinecppns",
    href: "https://www.instagram.com/sandrinecppns/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    handle: "@sandrineceuppens",
    href: "https://www.youtube.com/@sandrineceuppens",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    handle: "@sandrinecppns",
    href: "https://www.tiktok.com/@sandrinecppns",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.84 1.56V6.81a4.85 4.85 0 01-1.07-.12z"/>
      </svg>
    ),
  },
];

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const t = content[lang];
  const work = WORK[lang];

  return (
    <main style={{ paddingBottom: "80px", background: "#ffffff" }}>
      <HashScroll />
      <style>{`
        /* ── Hero : photo + nom + stats + CTA ── */
        .hero {
          display: grid;
          grid-template-columns: minmax(0, 420px) 1fr;
          gap: 56px;
          max-width: 1180px;
          margin: 0 auto;
          padding: 32px 40px 0;
          align-items: center;
        }
        .hero-photo {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #f2f2f2;
        }
        .hero-photo img { object-fit: cover; }
        .hero-name {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 42px;
          line-height: 1.05;
          letter-spacing: 0.01em;
          color: #0a0a0a;
          margin: 0 0 10px;
          font-weight: 400;
        }
        .hero-role {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999999;
          margin: 0 0 32px;
        }

        /* ── Sections generales ── */
        .info-hr { height: 1px; background: #ebebeb; max-width: 960px; margin: 48px auto; border: none; }
        .about-first { padding-top: 44px; }
        .info-section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #0a0a0a;
          text-align: center;
          margin: 0 0 28px;
          scroll-margin-top: 90px;
        }

        /* Skills : pills */
        .skills-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
        .skill-pill {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #333333;
          border: 1px solid #e5e5e5;
          border-radius: 100px;
          padding: 8px 18px;
        }

        /* Work with me : offres */
        /* Indice de défilement, visible seulement là où les offres deviennent
           un carrousel horizontal. */
        .offers-hint {
          display: none;
          text-align: center;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #b3aca2;
          margin: 14px 0 0;
        }
        .offers-intro {
          max-width: 620px;
          margin: -14px auto 32px;
          padding: 0 24px;
          text-align: center;
          font-size: 12px;
          line-height: 1.7;
          font-style: italic;
          color: #666666;
        }
        .offers {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .offer {
          display: flex;
          flex-direction: column;
          border: 1px solid #ebebeb;
          padding: 32px 26px;
          text-align: left;
        }
        .offer-emoji { font-size: 22px; line-height: 1; margin-bottom: 14px; }
        .offer-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 21px;
          color: #0a0a0a;
          margin: 0 0 8px;
        }
        .offer-sub {
          font-size: 12px;
          line-height: 1.6;
          font-style: italic;
          color: #666666;
          margin: 0 0 20px;
        }
        .offer-pkg {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0a0a0a;
          margin: 0 0 12px;
        }
        .offer-addons-label { margin-top: 20px; color: #999999; }
        .offer-list { list-style: none; padding: 0; margin: 0; }
        .offer-list li {
          position: relative;
          font-size: 12.5px;
          line-height: 1.5;
          color: #333333;
          padding: 5px 0 5px 16px;
        }
        .offer-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 13px;
          width: 6px;
          height: 1px;
          background: #b8a98a;
        }
        .offer-addons li { color: #777777; font-size: 11.5px; }
        .offer-cta-wrap { margin-top: auto; padding-top: 26px; }
        .offer-cta {
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 1px solid #0a0a0a;
          padding-bottom: 3px;
        }

        /* Projets recents : simple lien PDF, pas de bloc sur la page */
        .pdf-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0a0a0a;
          text-decoration: none;
          border: 1px solid #0a0a0a;
          padding: 12px 22px;
        }
        .pdf-link:hover { background: #0a0a0a; color: #ffffff; }
        .pdf-link-wrap { text-align: center; }

        /* Footer : based / socials / contact */
        .info-based { font-size: 11px; letter-spacing: 0.14em; color: #999999; text-align: center; text-transform: uppercase; }
        .social-row { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; }
        .social-item { display: flex; flex-direction: column; align-items: center; gap: 8px; text-decoration: none; color: #0a0a0a; }
        .social-handle { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #666666; }
        .email-row { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .email-link {
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .email-link:hover { border-bottom-color: #0a0a0a; }

        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; gap: 28px; padding: 0 24px; }
          .hero-photo { width: 100%; max-width: 340px; margin: 0 auto; }
          .hero-name { font-size: 30px; text-align: center; }
          .hero-role { text-align: center; }
        }
        @media (max-width: 767px) {
          .offers {
            display: flex;
            grid-template-columns: none;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 14px;
            padding: 4px 16px 10px;
            max-width: none;
            scrollbar-width: none;
          }
          .offers::-webkit-scrollbar { display: none; }
          .offer { flex: 0 0 82vw; scroll-snap-align: center; padding: 26px 22px; }
          .about-first { padding-top: 28px; }
          .offers-hint { display: block; }
        }
      `}</style>

      {/* Work with me : offres. Remonté en tête de page le 27/08 : un client
          arrive ici pour savoir ce qu'on vend, pas pour lire une biographie.
          La présentation est descendue en bas. */}
      <p className="info-section-title about-first" id="travailler-avec-moi">{work.title}</p>
      <p className="offers-intro">{work.intro}</p>
      <div className="offers">
        {work.offers.map((o, i) => (
          <div key={i} className="offer">
            <div className="offer-emoji">{o.emoji}</div>
            <h3 className="offer-title">{o.title}</h3>
            <p className="offer-sub">{o.subtitle}</p>
            {o.packageName && <p className="offer-pkg">{o.packageName}</p>}
            <ul className="offer-list">
              {o.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
            {o.addons && o.addons.length > 0 && (
              <>
                {o.addonsLabel && <p className="offer-pkg offer-addons-label">{o.addonsLabel}</p>}
                <ul className="offer-list offer-addons">
                  {o.addons.map((a, j) => (
                    <li key={j}>{a}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="offer-cta-wrap">
              <a className="offer-cta" href={`mailto:${work.talkMail}`}>{work.letsTalk}</a>
            </div>
          </div>
        ))}
      </div>
      <p className="offers-hint">{lang === "fr" ? "Faites défiler →" : "Swipe →"}</p>

      <hr className="info-hr" />

      {/* Clients */}
      <TrustLogos lang={lang} />

      <hr className="info-hr" />

      {/* Projets récents (PDF) : retiré le 27/08, le dossier doit être remis à
          jour avant de le remettre en ligne. Le fichier et les libellés
          t.projectsPdf existent toujours, il suffit de rétablir ce bloc. */}

      {/* Skills */}
      <p className="info-section-title">{t.skills}</p>
      <div className="skills-row">
        {SKILLS[lang].map((s) => (
          <span key={s} className="skill-pill">{s}</span>
        ))}
      </div>

      <hr className="info-hr" />

      {/* Présentation, descendue en bas de page le 27/08. */}
      <section className="hero">
        <div className="hero-photo">
          <Image src={HERO_PHOTO} alt="Sandrine Ceuppens" fill sizes="(max-width: 900px) 340px, 420px" priority quality={82} />
        </div>
        <div>
          <h1 className="hero-name">{t.name}</h1>
          <p className="hero-role">{t.role}</p>
        </div>
      </section>

      <hr className="info-hr" />

      {/* Footer : based, socials, contact */}
      <p className="info-based">{t.based}</p>

      <div style={{ height: "32px" }} />

      <div className="social-row">
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-item">
            {s.icon}
            <span className="social-handle">{s.handle}</span>
          </a>
        ))}
      </div>

      <div className="email-row" style={{ marginTop: "44px" }}>
        <a href="mailto:hello@thegirlwithacamera.com" className="email-link">
          {lang === "fr" ? "Projets" : "Projects"} · hello@thegirlwithacamera.com
        </a>
        <a href="mailto:press@thegirlwithacamera.com" className="email-link">
          {lang === "fr" ? "Presse" : "Press"} · press@thegirlwithacamera.com
        </a>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: lang === "fr" ? "À propos" : "About",
        description: lang === "fr"
          ? "Sandrine Ceuppens, photographe et vidéaste documentaire basée à Bruxelles."
          : "Sandrine Ceuppens, documentary photographer and filmmaker based in Brussels.",
        mainEntity: {
          "@type": "Person",
          name: "Sandrine Ceuppens",
          jobTitle: lang === "fr" ? "Photographe et vidéaste documentaire" : "Documentary photographer and filmmaker",
          url: "https://thegirlwithacamera.com",
          image: "https://thegirlwithacamera.com/og-image.jpg",
          sameAs: ["https://www.instagram.com/sandrinecppns/", "https://www.youtube.com/@sandrineceuppens", "https://www.tiktok.com/@sandrinecppns"],
          address: { "@type": "PostalAddress", addressLocality: "Brussels", addressCountry: "Belgium" },
          knowsAbout: ["HOTEL PHOTOGRAPHY", "INTERIORS & ARCHITECTURE", "FOOD & TABLE", "NATURAL LIGHT", "SHORT FILM", "DIGITAL & FILM PHOTOGRAPHY"]
        }
      })}} />
    </main>
  );
}
