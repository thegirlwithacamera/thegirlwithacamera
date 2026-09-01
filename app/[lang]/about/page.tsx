import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
// Une seule phrase reprise des offres : la meme partout, jamais recopiee.
import { WORK } from "@/lib/offers";
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

const content = {
  fr: {
    name: "SANDRINE CEUPPENS",
    role: "Photographe et vidéaste documentaire · Hôtels, tables et maisons · Bruxelles",
    // Presentation ecrite a partir du texte Substack de Sandrine (31/08).
    // La phrase de fin, "il y a deux ans je n'imaginais rien de tout ca", reste
    // sur Substack : juste et touchante, mais sur une page qui vend une
    // prestation elle dit qu'on debute.
    bio: "Je photographie les villes à cinq heures du matin et les marchés avant la foule. C'est la même façon de regarder que j'emmène dans les maisons et les hôtels : la lumière du lieu, les gestes de ceux qui y travaillent, rien de posé. Un livre est en cours.",
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
    bio: "I photograph cities at five in the morning and markets before the crowds. It is the same way of looking that I bring into houses and hotels: the light of the place, the gestures of the people who work there, nothing staged. A book is in progress.",
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

// L'intro des offres reste ici, elle presente le travail en une phrase.
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
          margin: 0 0 20px;
        }
        .hero-bio {
          font-size: 13px;
          line-height: 1.9;
          color: #555555;
          max-width: 460px;
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
        .offer-proof {
          display: inline-block;
          margin-top: 14px;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8a8175;
          text-decoration: none;
          border-bottom: 1px solid #e2ddd4;
          padding-bottom: 3px;
          transition: color 0.2s, border-color 0.2s;
        }
        .offer-proof:hover { color: #0a0a0a; border-color: #0a0a0a; }
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
          .hero-bio { text-align: center; margin-left: auto; margin-right: auto; }
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

      {/* Les offres sont parties sur /services le 01/09. Elles y vivaient en
          double, avec deux textes differents pour la meme prestation. Cette
          page ne parle plus que de Sandrine ; la source des offres est
          lib/offers.ts. */}
      <p className="info-section-title about-first" id="travailler-avec-moi">{t.cta}</p>
      <p className="offers-intro">{work.intro}</p>
      <p style={{ textAlign: "center", margin: "0 0 8px" }}>
        <Link href={`/${lang}/services`} className="offer-cta">
          {lang === "fr" ? "Voir les formules" : "See the packages"}
        </Link>
      </p>

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
          <p className="hero-bio">{t.bio}</p>
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
