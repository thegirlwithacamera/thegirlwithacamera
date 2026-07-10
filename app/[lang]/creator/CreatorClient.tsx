"use client";

import Link from "next/link";
import { SECTIONS, type Clip, type Section } from "./constants";
import {
  Carousel,
  FocusOverlay,
  SHOWCASE_CSS,
  useVideoSound,
  type Sound,
} from "../components/VideoShowcase";

export type { Clip, Section };

type Data = {
  gear: Clip[];
  lifestyle: Clip[];
  unboxing: Clip[];
  talk: Clip[];
};

const STATS = {
  instagram: { followers: "32,4K", reelViews: "381K", reach: "174K" },
};

// Clients, dans l'ordre d'importance. Ricoh, Pentax et Insta360 en tete.
// Clients : logo reel si dispo (public/images/brands/), sinon nom en texte.
// Bao Liege : identite a confirmer (logo "dao" recu, lien avec Bao Liege
// pas encore confirme par Sandrine) -> reste en texte pour l'instant.
type Brand = { name: string; logo?: string };
const BRANDS: Brand[] = [
  { name: "RICOH EUROPE", logo: "/images/brands/ricoh.svg" },
  { name: "PENTAX EUROPE", logo: "/images/brands/pentax.svg" },
  { name: "INSTA360", logo: "/images/brands/insta360-wordmark.svg" },
  { name: "EDIFIER", logo: "/images/brands/edifier.png" },
  { name: "TELESIN", logo: "/images/brands/telesin.png" },
  { name: "L'ORÉAL", logo: "/images/brands/loreal.svg" },
  { name: "COLOC HOUSING", logo: "/images/brands/coloc-housing.png" },
  { name: "VAN DER VALK SELYS", logo: "/images/brands/van-der-valk-selys.png" },
  { name: "BAO LIÈGE" },
  { name: "CÉ-PAGES", logo: "/images/brands/ce-pages.png" },
];

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
    bio: "CONTENU VISUEL AUTHENTIQUE POUR LES MARQUES QUI VEULENT EXISTER SUR LES RÉSEAUX SANS RESSEMBLER À UNE PUBLICITÉ.",
    reach: "AUDIENCE",
    reachSub: "sur les 30 derniers jours",
    workingWith: "ILS ME FONT CONFIANCE",
    cta: "On travaille ensemble ?",
    ctaLink: "hello@thegirlwithacamera.com",
    igLabel: "Instagram",
    followers: "abonnés",
    reelViews: "vues de reel",
    avgReach: "comptes touchés",
    gear: "GEAR",
    lifestyle: "LIFESTYLE",
    unboxing: "UNBOXING",
    talk: "TALK",
  },
  en: {
    bio: "AUTHENTIC VISUAL CONTENT FOR BRANDS THAT WANT TO EXIST ON SOCIAL MEDIA WITHOUT LOOKING LIKE AN AD.",
    reach: "AUDIENCE",
    reachSub: "over the last 30 days",
    workingWith: "ALREADY WORKING WITH",
    cta: "Want to work together?",
    ctaLink: "hello@thegirlwithacamera.com",
    igLabel: "Instagram",
    followers: "followers",
    reelViews: "reel views",
    avgReach: "accounts reached",
    gear: "GEAR",
    lifestyle: "LIFESTYLE",
    unboxing: "UNBOXING",
    talk: "TALK",
  },
};

// Barre de navigation des sections creator. Pas de vue "tout" : on navigue
// uniquement par categorie, chacune avec sa propre URL partageable.
function CreatorNav({ lang, active, labels }: { lang: "fr" | "en"; active: Section; labels: Record<Section, string> }) {
  const base = `/${lang}/creator`;
  return (
    <nav className="creator-nav" aria-label="Creator sections">
      {SECTIONS.map((s) => (
        <Link
          key={s}
          href={`${base}/${s}`}
          className={`creator-nav-link${active === s ? " creator-nav-link--active" : ""}`}
        >
          {labels[s]}
        </Link>
      ))}
    </nav>
  );
}

function PhoneTier({ title, clips, prefix, sound }: { title: string; clips: Clip[]; prefix: string; sound: Sound }) {
  if (clips.length === 0) return null;
  return (
    <>
      <section className="tier">
        <div className="tier-head">
          <h2 className="tier-title">{title}</h2>
        </div>
        <Carousel clips={clips} kind="phone" prefix={prefix} sound={sound} />
      </section>
      <hr className="creator-hr" />
    </>
  );
}

// Work with me : 3 offres en colonnes (desktop) / carrousel swipe (mobile).
function WorkWithMe({ work }: { work: Work }) {
  return (
    <section className="tier">
      <div className="tier-head">
        <h2 className="tier-title">{work.title}</h2>
      </div>
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
    </section>
  );
}

export default function CreatorClient({
  lang,
  data,
  section = "gear", // /creator sans section = Gear, la premiere categorie
}: {
  lang: "fr" | "en";
  data: Data;
  section?: Section;
}) {
  const t = content[lang];

  // Desktop : autoplay via l'attribut sur chaque video.
  // Mobile : la pile 3D ne joue que la carte active (voir MobileStack).
  const { sound, focused, closeFocus } = useVideoSound();

  return (
    <main style={{ paddingTop: "20px", paddingBottom: "80px", background: "#ffffff" }}>
      <style>{`
        .creator-bio {
          font-size: 11px;
          line-height: 2;
          letter-spacing: 0.06em;
          color: #0a0a0a;
          text-align: center;
          max-width: 680px;
          margin: 0 auto 24px;
          padding: 0 40px;
        }
        .creator-hr { height: 1px; background: #ebebeb; max-width: 280px; margin: 40px auto; border: none; }
        .section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #0a0a0a;
          text-align: center;
          margin: 0 0 36px;
        }

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

        /* Tiers */
        .tier { max-width: 1260px; margin: 0 auto; padding: 0 40px; }
        .tier-head { text-align: center; margin-bottom: 24px; }
        .tier-title { font-size: 13px; font-weight: 700; letter-spacing: 0.22em; color: #0a0a0a; margin: 0 0 12px; }
        .tier-desc {
          font-size: 11px;
          line-height: 1.9;
          letter-spacing: 0.05em;
          color: #999999;
          max-width: 560px;
          margin: 0 auto;
          font-style: italic;
        }

        /* Navigation des sections creator */
        .creator-nav {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 6px 22px;
          margin: 0 auto 36px;
          padding: 0 16px;
        }
        .creator-nav-link {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999999;
          text-decoration: none;
          padding: 4px 0;
          transition: color 0.2s;
        }
        .creator-nav-link:hover { color: #0a0a0a; }
        .creator-nav-link--active {
          color: #0a0a0a;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        /* Brands */
        .trust-label { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; color: #999999; text-align: center; margin: 4px 0 14px; }
        .brands-strip { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 14px 26px; max-width: 720px; margin: 0 auto; padding: 0 24px; }
        .brand-chip { font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #0a0a0a; }
        .brand-logo { height: 22px; width: auto; max-width: 120px; object-fit: contain; }

        /* CTA */
        .creator-cta { text-align: center; }
        .creator-cta p { font-size: 13px; color: #666666; letter-spacing: 0.04em; margin-bottom: 16px; }
        .creator-cta a {
          font-size: 12px;
          letter-spacing: 0.14em;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 1px solid #0a0a0a;
          padding-bottom: 2px;
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

        ${SHOWCASE_CSS}

        @media (max-width: 767px) {
          .creator-bio { font-size: 12px; padding: 0 24px; }
          .stats-grid { gap: 14px; padding: 0 24px; }
          .stat-platform { font-size: 8px; margin-bottom: 6px; }
          .stat-number { font-size: 20px; }
          .stat-sub { font-size: 9px; margin-top: 2px; }
          .section-title { margin: 0 0 16px; font-size: 10px; }
          .creator-hr { margin: 28px auto; max-width: 200px; }
          .tier { padding: 0 12px; }
          .brand-chip { font-size: 11px; letter-spacing: 0.1em; }
          .brand-logo { height: 18px; max-width: 90px; }
          /* Offres : carrousel swipe, une carte a la fois */
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

      {/* Navigation par categorie : Gear, Lifestyle, Unboxing, Talk */}
      <CreatorNav
        lang={lang}
        active={section}
        labels={{ gear: t.gear, lifestyle: t.lifestyle, unboxing: t.unboxing, talk: t.talk }}
      />

      {/* 1. La categorie active */}
      <PhoneTier title={t[section]} clips={data[section]} prefix={section} sound={sound} />

      {/* Clients + stats + bio + offres : un seul bloc, affiche uniquement
          sur la page d'entree (Gear), pas repete sur chaque categorie. */}
      {section === "gear" && (
        <>
          {/* 2. Clients */}
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

          <hr className="creator-hr" />

          {/* 3. Stats */}
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

          <hr className="creator-hr" />

          {/* 4. Phrase contenu visuel */}
          <p className="creator-bio">{t.bio}</p>

          <hr className="creator-hr" />

          {/* 5. Work with me : offres */}
          <WorkWithMe work={WORK[lang]} />

          <hr className="creator-hr" />
        </>
      )}

      {/* CTA : reste present sur chaque page */}
      <div className="creator-cta">
        <p>{t.cta}</p>
        <a href={`mailto:${t.ctaLink}`}>{t.ctaLink}</a>
      </div>

      {/* Mise en avant au clic */}
      {focused && (
        <FocusOverlay clip={focused.clip} kind={focused.kind} onClose={closeFocus} />
      )}
    </main>
  );
}
