import Image from "next/image";
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

// Photo du hero. A remplacer par le nouveau portrait (Mont Fuji / vending
// machine Tokyo) des qu'il est depose dans public/images/about/ — pour
// l'instant fichier pas encore recupere (image collee dans le chat, pas
// sauvegardee sur le Bureau).
const HERO_PHOTO = "/images/portfolio/portrait/1.jpg";

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
  instagram: { followers: "32,4K" },
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
    name: "SANDRINE CEUPPENS",
    role: "Photographe & Vidéaste documentaire · Bruxelles",
    workingWith: "ILS ME FONT CONFIANCE",
    followersLabel: "ABONNÉS INSTAGRAM",
    skills: "COMPÉTENCES",
    projectsPdf: "Projets récents (PDF)",
    based: "Bruxelles · disponible pour voyager",
    cta: "On travaille ensemble ?",
    letsTalk: "Écrire un mail",
  },
  en: {
    name: "SANDRINE CEUPPENS",
    role: "Documentary Photographer & Filmmaker · Brussels",
    workingWith: "ALREADY WORKING WITH",
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
    "Digital & Film Photography",
    "Video Editing",
    "Creative Direction",
    "Brand Content Creation",
    "Social Media",
  ],
  fr: [
    "Photographie numérique & argentique",
    "Montage vidéo",
    "Direction créative",
    "Création de contenu de marque",
    "Réseaux sociaux",
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
    <main style={{ paddingBottom: "80px", background: "#ffffff" }}>
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
        .hero-stats { margin-bottom: 30px; }
        .hero-stat-label {
          font-size: 10px;
          letter-spacing: 0.18em;
          color: #999999;
          text-transform: uppercase;
          margin: 0 0 8px;
        }
        .hero-stat-num {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 48px;
          font-style: italic;
          color: #0a0a0a;
          line-height: 1;
        }
        .hero-cta-row { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .hero-cta {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ffffff;
          background: #0a0a0a;
          text-decoration: none;
          padding: 13px 26px;
          transition: opacity 0.2s;
        }
        .hero-cta:hover { opacity: 0.8; }
        .hero-socials { display: flex; gap: 16px; }
        .hero-social-link { color: #666666; transition: color 0.2s; }
        .hero-social-link:hover { color: #0a0a0a; }

        /* ── Sections generales ── */
        .info-hr { height: 1px; background: #ebebeb; max-width: 960px; margin: 48px auto; border: none; }
        .info-section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #0a0a0a;
          text-align: center;
          margin: 0 0 28px;
        }

        /* Clients */
        .trust-label { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; color: #999999; text-align: center; margin: 0 0 20px; }
        .brands-strip { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 18px 32px; max-width: 860px; margin: 0 auto; padding: 0 24px; }
        .brand-chip { font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #0a0a0a; }
        .brand-logo { height: 24px; width: auto; max-width: 130px; object-fit: contain; opacity: 0.88; transition: opacity 0.2s; }
        .brand-logo:hover { opacity: 1; }

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
          .hero-photo { max-width: 340px; margin: 0 auto; }
          .hero-name { font-size: 30px; text-align: center; }
          .hero-role { text-align: center; }
          .hero-stats { text-align: center; }
          .hero-cta-row { justify-content: center; }
        }
        @media (max-width: 767px) {
          .brand-chip { font-size: 11px; letter-spacing: 0.1em; }
          .brand-logo { height: 19px; max-width: 96px; }
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

      {/* Hero : photo, nom, role, stat, contact — droit au but */}
      <section className="hero">
        <div className="hero-photo">
          <Image src={HERO_PHOTO} alt="Sandrine Ceuppens" fill sizes="(max-width: 900px) 340px, 420px" priority quality={82} />
        </div>
        <div>
          <h1 className="hero-name">{t.name}</h1>
          <p className="hero-role">{t.role}</p>
          <div className="hero-stats">
            <p className="hero-stat-label">{t.followersLabel}</p>
            <p className="hero-stat-num">{STATS.instagram.followers}</p>
          </div>
          <div className="hero-cta-row">
            <a className="hero-cta" href="mailto:hello@thegirlwithacamera.com">{t.letsTalk}</a>
            <div className="hero-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hero-social-link" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

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

      {/* Skills */}
      <p className="info-section-title">{t.skills}</p>
      <div className="skills-row">
        {SKILLS[lang].map((s) => (
          <span key={s} className="skill-pill">{s}</span>
        ))}
      </div>

      <hr className="info-hr" />

      {/* Work with me : offres */}
      <p className="info-section-title">{work.title}</p>
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

      {/* Projets recents : PDF telechargeable, pas de bloc sur la page */}
      <div className="pdf-link-wrap">
        <a className="pdf-link" href={`/documents/recent-projects-${lang}.pdf`} target="_blank" rel="noopener noreferrer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v13m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
          {t.projectsPdf}
        </a>
      </div>

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

      <p style={{ textAlign: "center", fontSize: "13px", color: "#666666", letterSpacing: "0.04em", marginTop: "52px", marginBottom: "16px" }}>{t.cta}</p>

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
        description: lang === "fr"
          ? "Sandrine Ceuppens, photographe et vidéaste documentaire basée à Bruxelles."
          : "Sandrine Ceuppens, documentary photographer and filmmaker based in Brussels.",
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
