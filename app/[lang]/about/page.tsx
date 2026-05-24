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

const content = {
  fr: {
    bio: [
      "Sandrine Ceuppens est photographe et vidéaste documentaire, basée à Bruxelles.",
      "Elle capture les rues, la lumière et les instants silencieux. Ces fragments du réel qu'on remarque à peine mais qui racontent tout. Son travail évolue à la frontière du documentaire et de l'esthétique mode, avec une approche épurée et un post-traitement minimal.",
      "À travers la photo comme la vidéo, elle construit des récits visuels sensibles et éditoriaux, centrés sur l'authenticité, l'atmosphère et la narration du quotidien.",
      "Elle collabore avec des marques européennes pour créer du contenu visuel sincère et intentionnel, pensé comme des fragments de vie plutôt que comme des campagnes classiques.",
    ],
    workingWith: "ILS ME FONT CONFIANCE",
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
      "She collaborates with European brands to create sincere and intentional visual content: moments and fragments of life, not advertising campaigns.",
    ],
    workingWith: "ALREADY WORKING WITH",
    recentProjects: "RECENT PROJECTS",
    skills: "SKILLS",
    based: "BASED IN BRUSSELS · AVAILABLE TO TRAVEL",
    cta: "Want to work together?",
    contact: "CONTACT",
    socials: "SOCIALS",
  },
};

const BRANDS = ["RICOH EUROPE", "PENTAX EUROPE", "INSTA360"];

const RECENT_PROJECTS = {
  fr: [
    { year: "2026", month: "Mars - Mai", client: "Pentax Europe (via Ricoh Imaging Europe)", desc: "Production vidéo UGC", secondary: "" },
    { year: "2026", month: "Mars", client: "The Girl with a Camera", desc: "Mission photographique en Sicile", secondary: "Série personnelle en vue de tirages et édition" },
    { year: "2026", month: "Février", client: "Pentax Europe (via Ricoh Imaging Europe)", desc: "Début de collaboration • Développement des concepts", secondary: "" },
    { year: "2025", month: "Novembre", client: "Ricoh Imaging Europe", desc: "Production vidéo UGC", secondary: "" },
    { year: "2025", month: "Octobre - Novembre", client: "The Girl with a Camera", desc: "Mission photo et vidéo au Japon", secondary: "Série personnelle en vue de tirages et édition" },
    { year: "2025", month: "Juillet - Octobre", client: "Ricoh Imaging Europe", desc: "Production vidéo UGC", secondary: "" },
    { year: "2025", month: "Juin", client: "Ricoh Imaging Europe", desc: "Début de collaboration • Développement des concepts créatifs", secondary: "" },
  ],
  en: [
    { year: "2026", month: "March - May", client: "Pentax Europe (via Ricoh Imaging Europe)", desc: "UGC video production", secondary: "" },
    { year: "2026", month: "March", client: "The Girl with a Camera", desc: "Photography mission in Sicily", secondary: "Personal series for prints and publication" },
    { year: "2026", month: "February", client: "Pentax Europe (via Ricoh Imaging Europe)", desc: "Collaboration start • Creative concept development", secondary: "" },
    { year: "2025", month: "November", client: "Ricoh Imaging Europe", desc: "UGC video production", secondary: "" },
    { year: "2025", month: "October - November", client: "The Girl with a Camera", desc: "Photography and video mission in Japan", secondary: "Personal series for prints and publication" },
    { year: "2025", month: "July - October", client: "Ricoh Imaging Europe", desc: "UGC video production", secondary: "" },
    { year: "2025", month: "June", client: "Ricoh Imaging Europe", desc: "Collaboration start • Creative concept development", secondary: "" },
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
        @media (max-width: 767px) {
          .info-bio { font-size: 12px; padding: 0 24px; }
          .social-row { gap: 28px; }
          .skills-row { flex-direction: column; gap: 8px; align-items: center; }
          .skills-row > span { padding: 0; display: block; }
          .skills-row > span > span { display: none; }
          .projects-container { padding: 0 24px; }
          .project-month { font-size: 10px; margin: 16px 0 3px 0; }
          .project-details { font-size: 9px; margin: 0 0 12px 0; }
        }
      `}</style>

      {/* Bio */}
      {t.bio.map((para, i) => (
        <p key={i} className="info-bio" style={{ marginBottom: i < t.bio.length - 1 ? "1.6em" : 0 }}>{para}</p>
      ))}

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

      {/* Already working with */}
      <p className="info-section-title">{t.workingWith}</p>
      <div style={{ marginTop: "28px" }}>
        {BRANDS.map((name) => (
          <p key={name} className="info-item">{name}</p>
        ))}
      </div>

      <hr className="info-hr" />

      {/* Recent Projects */}
      <p className="info-section-title">{t.recentProjects}</p>
      <div className="projects-container">
        {(() => {
          const projects = RECENT_PROJECTS[lang];
          const grouped: Record<string, typeof projects> = {};
          projects.forEach(p => {
            if (!grouped[p.year]) grouped[p.year] = [];
            grouped[p.year].push(p);
          });
          const years = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));
          return years.map(year => (
            <div key={year}>
              <p className="project-year">{year}</p>
              {grouped[year].map((p, i) => (
                <div key={i}>
                  <p className="project-month">{p.month}</p>
                  <p className="project-details">{p.client} · {p.desc}</p>
                  {p.secondary && <p className="project-details">{p.secondary}</p>}
                </div>
              ))}
            </div>
          ));
        })()}
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
