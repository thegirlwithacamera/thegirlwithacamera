import type { Metadata } from "next";

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

// Clients : logo reel si dispo (public/images/brands/), sinon nom en texte.
type Brand = { name: string; logo?: string };
const BRANDS: Brand[] = [
  { name: "RICOH EUROPE", logo: "/images/brands/ricoh.svg" },
  { name: "PENTAX EUROPE", logo: "/images/brands/pentax-black.png" },
  { name: "INSTA360", logo: "/images/brands/insta360-wordmark.svg" },
  { name: "EDIFIER", logo: "/images/brands/edifier.png" },
  { name: "TELESIN", logo: "/images/brands/telesin.png" },
  { name: "L'ORÉAL", logo: "/images/brands/loreal.svg" },
  { name: "COLOC HOUSING", logo: "/images/brands/coloc-housing.png" },
  { name: "VAN DER VALK SELYS", logo: "/images/brands/van-der-valk-selys.png" },
  { name: "DAO LIÈGE", logo: "/images/brands/dao-liege.png" },
  { name: "CÉ-PAGES", logo: "/images/brands/ce-pages.png" },
];

const STATS = {
  instagram: { followers: "32,4K", reelViews: "381K", reach: "174K" },
};

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
type Work = { title: string; letsTalk: string; talkMail: string; offers: Offer[] };

const TALK_MAIL = "sandrine@thegirlwithacamera.com";

const WORK: Record<"fr" | "en", Work> = {
  en: {
    title: "WORK WITH ME",
    letsTalk: "Let's talk",
    talkMail: TALK_MAIL,
    offers: [
      {
        emoji: "🎬",
        title: "UGC Content Creation",
        subtitle: "Content for your brand's channels. I create, you post.",
        packageName: "Starter Package",
        items: [
          "1 UGC video (Reel format)",
          "2 hook variations (3 videos total)",
          "Concept & scripting",
          "Filming & retention editing",
          "Filmed on Luna Ultra (photography: Ricoh GR III), cinematic, editorial look",
          "Organic usage rights",
          "30-day ad usage rights",
        ],
        addonsLabel: "Add-ons",
        addons: [
          "Raw footage",
          "Lifestyle & product photography",
          "Extra hooks/CTA variations",
          "Whitelisting / dark posting",
          "Full usage rights in perpetuity",
          "Rush delivery (1-3 days)",
          "Monthly retainers",
        ],
      },
      {
        emoji: "📸",
        title: "Influencer Partnership",
        subtitle: "Your brand on my feed. 32k+ engaged Worldwide audience.",
        packageName: "Organic + Ad-Ready Package",
        items: [
          "1 IG Reel (organic post)",
          "Story set (3-5 slides)",
          "7 days link in bio",
          "Organic reposting rights",
          "30-day boosting rights",
          "Crossposting to TikTok & Threads",
        ],
      },
      {
        emoji: "🖼️",
        title: "Brand Photography",
        subtitle: "Editorial photography for your campaigns.",
        items: [
          "Street-style & lifestyle shoots (Brussels & Europe)",
          "Product-in-context photography",
          "Editorial series for campaigns",
          "Licensing options",
        ],
      },
    ],
  },
  fr: {
    title: "TRAVAILLER AVEC MOI",
    letsTalk: "Let's talk",
    talkMail: TALK_MAIL,
    offers: [
      {
        emoji: "🎬",
        title: "Création de contenu UGC",
        subtitle: "Du contenu pour les canaux de ta marque. Je crée, tu publies.",
        packageName: "Starter Package",
        items: [
          "1 vidéo UGC (format Reel)",
          "2 variations de hook (3 vidéos au total)",
          "Concept et scénario",
          "Tournage et montage rétention",
          "Filmé sur Luna Ultra (photo : Ricoh GR III), rendu cinématique et éditorial",
          "Droits d'usage organique",
          "Droits d'usage publicitaire 30 jours",
        ],
        addonsLabel: "Options",
        addons: [
          "Rushes bruts",
          "Photographie lifestyle et produit",
          "Variations de hooks/CTA supplémentaires",
          "Whitelisting / dark posting",
          "Droits d'usage complets à perpétuité",
          "Livraison express (1-3 jours)",
          "Forfaits mensuels",
        ],
      },
      {
        emoji: "📸",
        title: "Partenariat influence",
        subtitle: "Ta marque sur mon feed. 32k+ d'audience engagée dans le monde.",
        packageName: "Organic + Ad-Ready Package",
        items: [
          "1 Reel IG (post organique)",
          "Série de Stories (3-5 slides)",
          "Lien en bio pendant 7 jours",
          "Droits de repartage organique",
          "Droits de boost 30 jours",
          "Crosspost sur TikTok et Threads",
        ],
      },
      {
        emoji: "🖼️",
        title: "Photographie de marque",
        subtitle: "Photographie éditoriale pour tes campagnes.",
        items: [
          "Shootings street-style et lifestyle (Bruxelles et Europe)",
          "Photographie de produit en contexte",
          "Séries éditoriales pour campagnes",
          "Options de licence",
        ],
      },
    ],
  },
};

const content = {
  fr: {
    bio: [
      "Sandrine Ceuppens est photographe et vidéaste documentaire, basée à Bruxelles.",
      "Elle capture les rues, la lumière et les instants silencieux. Ces fragments du réel qu'on remarque à peine mais qui racontent tout. Son travail évolue à la frontière du documentaire et de l'esthétique mode, avec une approche épurée et un post-traitement minimal.",
      "À travers la photo comme la vidéo, elle construit des récits visuels sensibles et éditoriaux, centrés sur l'authenticité, l'atmosphère et la narration du quotidien.",
      "Elle collabore avec des marques pour créer du contenu visuel sincère et intentionnel, pensé comme des fragments de vie plutôt que comme des campagnes classiques.",
    ],
    workingWith: "ILS ME FONT CONFIANCE",
    igLabel: "Instagram",
    followers: "abonnés",
    reelViews: "vues de reel",
    avgReach: "comptes touchés",
    recentProjects: "PROJETS RÉCENTS",
    skills: "COMPÉTENCES",
    based: "BASÉE À BRUXELLES · DISPONIBLE POUR VOYAGER",
    cta: "On travaille ensemble ?",
    contact: "CONTACT",
    socials: "RÉSEAUX",
  },
  en: {
    bio: [
      "Sandrine Ceuppens is a documentary photographer and filmmaker based in Brussels.",
      "She captures streets, light and quiet moments. Fragments of reality that barely register but tell everything. Her work evolves at the border of documentary and fashion aesthetics, with a clean approach and minimal post-processing.",
      "Through both photography and film, she builds sensitive, editorial visual narratives centred on authenticity, atmosphere and the storytelling of everyday life.",
      "She collaborates with brands to create sincere and intentional visual content: moments and fragments of life, not advertising campaigns.",
    ],
    workingWith: "ALREADY WORKING WITH",
    igLabel: "Instagram",
    followers: "followers",
    reelViews: "reel views",
    avgReach: "accounts reached",
    recentProjects: "RECENT PROJECTS",
    skills: "SKILLS",
    based: "BASED IN BRUSSELS · AVAILABLE TO TRAVEL",
    cta: "Want to work together?",
    contact: "CONTACT",
    socials: "SOCIALS",
  },
};


const RECENT_PROJECTS = {
  fr: [
    { year: "2026", month: "Mars - Mai", client: "Pentax Europe", desc: "Production vidéo UGC", secondary: "" },
    { year: "2026", month: "Mars", client: "The Girl with a Camera", desc: "Mission photographique en Sicile", secondary: "Série personnelle en vue de tirages et édition" },
    { year: "2026", month: "Février", client: "Pentax Europe", desc: "Production vidéo UGC", secondary: "" },
    { year: "2026", month: "Janvier", client: "Pentax Europe (via Ricoh Imaging Europe)", desc: "Début de collaboration", secondary: "Développement des concepts" },
    { year: "2025", month: "Novembre", client: "Ricoh Imaging Europe", desc: "Production vidéo UGC", secondary: "" },
    { year: "2025", month: "Octobre - Novembre", client: "The Girl with a Camera", desc: "Mission photo et vidéo au Japon", secondary: "Série personnelle en vue de tirages et édition" },
    { year: "2025", month: "Juillet - Octobre", client: "Ricoh Imaging Europe", desc: "Production vidéo UGC", secondary: "" },
    { year: "2025", month: "Juin", client: "Ricoh Imaging Europe", desc: "Début de collaboration", secondary: "Développement des concepts créatifs" },
  ],
  en: [
    { year: "2026", month: "March - May", client: "Pentax Europe", desc: "UGC video production", secondary: "" },
    { year: "2026", month: "March", client: "The Girl with a Camera", desc: "Photography mission in Sicily", secondary: "Personal series for prints and publication" },
    { year: "2026", month: "February", client: "Pentax Europe", desc: "UGC video production", secondary: "" },
    { year: "2026", month: "January", client: "Pentax Europe (via Ricoh Imaging Europe)", desc: "Collaboration start", secondary: "Creative concept development" },
    { year: "2025", month: "November", client: "Ricoh Imaging Europe", desc: "UGC video production", secondary: "" },
    { year: "2025", month: "October - November", client: "The Girl with a Camera", desc: "Photography and video mission in Japan", secondary: "Personal series for prints and publication" },
    { year: "2025", month: "July - October", client: "Ricoh Imaging Europe", desc: "UGC video production", secondary: "" },
    { year: "2025", month: "June", client: "Ricoh Imaging Europe", desc: "Collaboration start", secondary: "Creative concept development" },
  ],
};

const SKILLS = {
  en: [
    "DIGITAL & FILM PHOTOGRAPHY",
    "VIDEO EDITING",
    "CREATIVE DIRECTION",
    "BRAND CONTENT CREATION",
    "SOCIAL MEDIA",
  ],
  fr: [
    "PHOTOGRAPHIE NUMÉRIQUE & ARGENTIQUE",
    "MONTAGE VIDÉO",
    "DIRECTION CRÉATIVE",
    "CRÉATION DE CONTENU DE MARQUE",
    "RÉSEAUX SOCIAUX",
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
    label: "Threads",
    handle: "@sandrinecppns",
    href: "https://www.threads.net/@sandrinecppns",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.473 12.01v-.017c.027-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.018 5.101.806 6.997 2.34 1.801 1.47 2.904 3.512 3.026 5.644l-2.773.163c-.089-1.417-.714-2.672-1.815-3.584-1.086-.9-2.603-1.402-4.455-1.414-2.65.018-4.648.812-5.938 2.36C5.987 6.81 5.376 9.02 5.354 12c.022 2.978.633 5.187 1.882 6.491 1.29 1.549 3.288 2.343 5.941 2.36 2.203-.015 3.768-.526 4.784-1.563.876-.896 1.328-2.176 1.385-3.907H12.22v-2.57h9.561v1.32c0 3.199-.871 5.676-2.588 7.364C17.563 23.26 15.148 24 12.186 24z"/>
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
    <main style={{ paddingTop: "60px", paddingBottom: "80px", background: "#ffffff" }}>
      <style>{`
        .info-bio {
          font-size: 13px;
          line-height: 2;
          letter-spacing: 0.06em;
          color: #0a0a0a;
          text-align: center;
          max-width: 780px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .info-section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #0a0a0a;
          text-align: center;
          margin: 0;
        }
        .info-item {
          font-size: 12px;
          letter-spacing: 0.12em;
          color: #0a0a0a;
          text-align: center;
          line-height: 2.6;
        }
        .projects-container {
          max-width: 500px;
          margin: 28px auto 0;
          padding: 0 40px;
          text-align: center;
        }
        .project-item {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #0a0a0a;
          line-height: 1.8;
          text-align: center;
          margin: 0;
        }
        .project-month {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #0a0a0a;
          margin: 20px 0 4px 0;
          font-weight: 500;
        }
        .project-details {
          font-size: 10px;
          letter-spacing: 0.08em;
          color: #666666;
          margin: 0 0 16px 0;
        }
        .project-year {
          font-size: 11px;
          letter-spacing: 0.16em;
          color: #0a0a0a;
          text-transform: uppercase;
          margin-top: 32px;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .info-based {
          font-size: 11px;
          letter-spacing: 0.18em;
          color: #666666;
          text-align: center;
        }
        .info-hr {
          height: 1px;
          background: #ebebeb;
          max-width: 280px;
          margin: 52px auto;
          border: none;
        }
        .skills-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0;
        }
        .skills-row span {
          font-size: 11px;
          letter-spacing: 0.14em;
          color: #666666;
          padding: 4px 14px;
        }
        .social-row {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .social-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #0a0a0a;
        }
        .social-handle {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #666666;
        }
        .email-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .email-link {
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .email-link:hover { border-bottom-color: #0a0a0a; }

        /* Clients */
        .trust-label { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; color: #999999; text-align: center; margin: 4px 0 14px; }
        .brands-strip { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 14px 26px; max-width: 720px; margin: 0 auto; padding: 0 24px; }
        .brand-chip { font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #0a0a0a; }
        .brand-logo { height: 22px; width: auto; max-width: 120px; object-fit: contain; }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 80px;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 40px;
          align-items: center;
        }
        .stat-block { text-align: center; }
        .stat-platform { font-size: 9px; letter-spacing: 0.22em; color: #666666; margin-bottom: 16px; }
        .stat-number {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 36px;
          font-style: italic;
          color: #0a0a0a;
          line-height: 1;
        }
        .stat-sub { font-size: 11px; letter-spacing: 0.14em; color: #666666; margin-top: 4px; }

        /* Work with me : offres */
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
        .offers-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #0a0a0a;
          text-align: center;
          margin: 0 0 24px;
        }

        @media (max-width: 767px) {
          .info-bio { font-size: 12px; padding: 0 24px; }
          .social-row { gap: 28px; }
          .skills-row { flex-direction: column; gap: 8px; align-items: center; }
          .skills-row > span { padding: 0; display: block; }
          .skills-row > span > span { display: none; }
          .projects-container { padding: 0 24px; }
          .project-month { font-size: 10px; margin: 16px 0 3px 0; }
          .project-details { font-size: 9px; margin: 0 0 12px 0; }
          .brand-chip { font-size: 11px; letter-spacing: 0.1em; }
          .brand-logo { height: 18px; max-width: 90px; }
          .stats-grid { gap: 14px; padding: 0 24px; }
          .stat-platform { font-size: 8px; margin-bottom: 6px; }
          .stat-number { font-size: 20px; }
          .stat-sub { font-size: 9px; margin-top: 2px; }
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
        }
      `}</style>

      {/* Bio */}
      {t.bio.map((para, i) => (
        <p key={i} className="info-bio" style={{ marginBottom: i < t.bio.length - 1 ? "1.6em" : 0 }}>{para}</p>
      ))}

      <hr className="info-hr" />

      {/* Clients */}
      <p className="trust-label">{t.workingWith}</p>
      <div className="brands-strip">
        {BRANDS.map((b) =>
          b.logo ? (
            <img key={b.name} src={b.logo} alt={b.name} className="brand-logo" />
          ) : (
            <span key={b.name} className="brand-chip">{b.name}</span>
          )
        )}
      </div>

      <hr className="info-hr" />

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-block">
          <p className="stat-platform">{t.igLabel}</p>
          <p className="stat-number">{STATS.instagram.followers}</p>
          <p className="stat-sub">{t.followers}</p>
        </div>
        <div className="stat-block">
          <p className="stat-platform">{t.igLabel}</p>
          <p className="stat-number">{STATS.instagram.reelViews}</p>
          <p className="stat-sub">{t.reelViews}</p>
        </div>
        <div className="stat-block">
          <p className="stat-platform">{t.igLabel}</p>
          <p className="stat-number">{STATS.instagram.reach}</p>
          <p className="stat-sub">{t.avgReach}</p>
        </div>
      </div>

      <hr className="info-hr" />

      {/* Skills */}
      <p className="info-section-title">{t.skills}</p>
      <div className="skills-row" style={{ marginTop: "24px" }}>
        {SKILLS[lang].map((s, i) => (
          <span key={s}>
            {s}{i < SKILLS[lang].length - 1 && <span style={{ color: "#999999" }}> · </span>}
          </span>
        ))}
      </div>

      <hr className="info-hr" />

      {/* Work with me : offres */}
      <p className="offers-title">{work.title}</p>
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

      <hr className="info-hr" />

      {/* Recent Projects */}
      <p className="info-section-title">{t.recentProjects}</p>
      <div className="projects-container" style={{ whiteSpace: "pre-wrap", textAlign: "center", fontSize: "11px", lineHeight: "1.8", letterSpacing: "0.08em", color: "#0a0a0a", marginTop: "28px" }}>
        {lang === "fr" ? (
          <>
            <strong style={{ fontSize: "11px" }}>2026</strong>
            {`

Mars - Mai

Pentax Europe · Production vidéo UGC

Mars

The Girl with a Camera · Mission photographique en Sicile
Série personnelle en vue de tirages et édition

Février

Pentax Europe · Production vidéo UGC

Janvier

Pentax Europe (via Ricoh Imaging Europe) · Début de collaboration
Développement des concepts

`}
            <strong style={{ fontSize: "11px" }}>2025</strong>
            {`

Novembre

Ricoh Imaging Europe · Production vidéo UGC

Octobre - Novembre
The Girl with a Camera · Mission photo et vidéo au Japon
Série personnelle en vue de tirages et édition

Juillet - Octobre

Ricoh Imaging Europe · Production vidéo UGC

Juin

Ricoh Imaging Europe · Début de collaboration
Développement des concepts créatifs`}
          </>
        ) : (
          <>
            <strong style={{ fontSize: "11px" }}>2026</strong>
            {`

March - May

Pentax Europe · UGC video production

March

The Girl with a Camera · Photography mission in Sicily
Personal series for prints and publication

February

Pentax Europe · UGC video production

January

Pentax Europe (via Ricoh Imaging Europe) · Collaboration start
Creative concept development

`}
            <strong style={{ fontSize: "11px" }}>2025</strong>
            {`

November

Ricoh Imaging Europe · UGC video production

October - November
The Girl with a Camera · Photography and video mission in Japan
Personal series for prints and publication

July - October

Ricoh Imaging Europe · UGC video production

June

Ricoh Imaging Europe · Collaboration start
Creative concept development`}
          </>
        )}
      </div>

      <hr className="info-hr" />

      {/* Based */}
      <p className="info-based">{t.based}</p>

      <hr className="info-hr" />

      {/* Socials */}
      <div className="social-row">
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-item">
            {s.icon}
            <span className="social-handle">{s.handle}</span>
          </a>
        ))}
      </div>

      {/* CTA */}
      <p style={{ textAlign: "center", fontSize: "13px", color: "#666666", letterSpacing: "0.04em", marginTop: "52px", marginBottom: "16px" }}>{t.cta}</p>

      {/* Emails */}
      <div className="email-row">
        <a href="mailto:hello@thegirlwithacamera.com" className="email-link">
          hello@thegirlwithacamera.com
        </a>
        <a href="mailto:press@thegirlwithacamera.com" className="email-link">
          press@thegirlwithacamera.com
        </a>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: lang === "fr" ? "À propos" : "About",
        description: t.bio.join(" "),
        mainEntity: {
          "@type": "Person",
          name: "Sandrine Ceuppens",
          jobTitle: lang === "fr" ? "Photographe & Créatrice de contenu" : "Photographer & Content Creator",
          url: "https://thegirlwithacamera.com",
          image: "https://thegirlwithacamera.com/og-image.jpg",
          sameAs: ["https://www.instagram.com/sandrinecppns/", "https://www.threads.net/@sandrinecppns", "https://www.tiktok.com/@sandrinecppns"],
          address: { "@type": "PostalAddress", addressLocality: "Brussels", addressCountry: "Belgium" },
          knowsAbout: ["DIGITAL & FILM PHOTOGRAPHY", "VIDEO EDITING", "CREATIVE DIRECTION", "BRAND CONTENT CREATION", "SOCIAL MEDIA"]
        }
      })}} />
    </main>
  );
}
