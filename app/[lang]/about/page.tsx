import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Info",
    alternates: { canonical: `/${lang}/about`, languages: { fr: "/fr/about", en: "/en/about" } },
  };
}

const content = {
  fr: {
    bio: "SANDRINE CEUPPENS EST PHOTOGRAPHE ET VIDÉASTE DOCUMENTAIRE, BASÉE À BRUXELLES. ELLE CAPTURE LES RUES, LA LUMIÈRE ET LES INSTANTS SILENCIEUX — CES FRAGMENTS DU RÉEL QU'ON REMARQUE À PEINE MAIS QUI RACONTENT TOUT. SON TRAVAIL ÉVOLUE À LA FRONTIÈRE DU DOCUMENTAIRE ET DE L'ESTHÉTIQUE MODE, AVEC UNE APPROCHE ÉPURÉE ET UN POST-TRAITEMENT MINIMAL. ELLE CONSTRUIT DES RÉCITS VISUELS SENSIBLES ET ÉDITORIAUX, CENTRÉS SUR L'AUTHENTICITÉ, L'ATMOSPHÈRE ET LA NARRATION DU QUOTIDIEN.",
    workingWith: "ALREADY WORKING WITH",
    skills: "OUTILS & COMPÉTENCES",
    based: "BASÉE À BRUXELLES · DISPONIBLE POUR VOYAGER",
    contact: "CONTACT",
    socials: "RÉSEAUX",
  },
  en: {
    bio: "SANDRINE CEUPPENS IS A DOCUMENTARY PHOTOGRAPHER AND FILMMAKER BASED IN BRUSSELS. SHE CAPTURES STREETS, LIGHT AND QUIET MOMENTS — FRAGMENTS OF REALITY THAT BARELY REGISTER BUT TELL EVERYTHING. HER WORK EVOLVES AT THE BORDER OF DOCUMENTARY AND FASHION AESTHETICS, WITH A CLEAN APPROACH AND MINIMAL POST-PROCESSING. SHE BUILDS SENSITIVE, EDITORIAL VISUAL NARRATIVES CENTRED ON AUTHENTICITY, ATMOSPHERE AND THE STORYTELLING OF EVERYDAY LIFE.",
    workingWith: "ALREADY WORKING WITH",
    skills: "TOOLS & SKILLS",
    based: "BASED IN BRUSSELS · AVAILABLE TO TRAVEL",
    contact: "CONTACT",
    socials: "SOCIALS",
  },
};

const BRANDS = ["RICOH EUROPE", "PENTAX EUROPE", "INSTA360"];

const SKILLS = [
  "ADOBE LIGHTROOM",
  "ADOBE PREMIERE PRO",
  "CANVA",
  "CAPCUT",
  "CLAUDE AI",
];

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

  return (
    <main style={{ paddingTop: "60px", paddingBottom: "80px", background: "#ffffff" }}>
      <style>{`
        .info-bio {
          font-size: 11px;
          line-height: 2;
          letter-spacing: 0.06em;
          color: #0a0a0a;
          text-align: center;
          max-width: 780px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .info-section-title {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #0a0a0a;
          text-align: center;
          margin: 0;
        }
        .info-item {
          font-size: 10px;
          letter-spacing: 0.12em;
          color: #0a0a0a;
          text-align: center;
          line-height: 2.6;
        }
        .info-based {
          font-size: 9px;
          letter-spacing: 0.18em;
          color: #aaaaaa;
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
          font-size: 9px;
          letter-spacing: 0.14em;
          color: #888;
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
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #888;
        }
        .email-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .email-link {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .email-link:hover { border-bottom-color: #0a0a0a; }
        @media (max-width: 767px) {
          .info-bio { font-size: 10px; padding: 0 24px; }
          .social-row { gap: 28px; }
        }
      `}</style>

      {/* Bio */}
      <p className="info-bio">{t.bio}</p>

      <hr className="info-hr" />

      {/* Already working with */}
      <p className="info-section-title">{t.workingWith}</p>
      <div style={{ marginTop: "28px" }}>
        {BRANDS.map((name) => (
          <p key={name} className="info-item">{name}</p>
        ))}
      </div>

      <hr className="info-hr" />

      {/* Skills */}
      <p className="info-section-title">{t.skills}</p>
      <div className="skills-row" style={{ marginTop: "24px" }}>
        {SKILLS.map((s, i) => (
          <span key={s}>
            {s}{i < SKILLS.length - 1 && <span style={{ color: "#d0d0d0" }}> · </span>}
          </span>
        ))}
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

      {/* Emails */}
      <div className="email-row" style={{ marginTop: "36px" }}>
        <a href="mailto:hello@thegirlwithacamera.com" className="email-link">
          hello@thegirlwithacamera.com
        </a>
        <a href="mailto:press@thegirlwithacamera.com" className="email-link">
          press@thegirlwithacamera.com
        </a>
      </div>

    </main>
  );
}
