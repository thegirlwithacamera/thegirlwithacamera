"use client";

import Link from "next/link";
import { SECTIONS, type Clip, type Section } from "./constants";
import {
  Carousel,
  FocusOverlay,
  SHOWCASE_CSS,
  useVideoSound,
} from "../components/VideoShowcase";

export type { Clip, Section };

type Data = {
  gear: Clip[];
  lifestyle: Clip[];
  unboxing: Clip[];
  talk: Clip[];
};

const content = {
  fr: {
    cta: "On travaille ensemble ?",
    ctaLink: "hello@thegirlwithacamera.com",
    gear: "GEAR",
    lifestyle: "LIFESTYLE",
    unboxing: "UNBOXING",
    talk: "TALK",
  },
  en: {
    cta: "Want to work together?",
    ctaLink: "hello@thegirlwithacamera.com",
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
  const { sound, focused, closeFocus } = useVideoSound();
  const clips = data[section];

  return (
    <main style={{ paddingTop: "20px", paddingBottom: "80px", background: "#ffffff" }}>
      <style>{`
        .creator-hr { height: 1px; background: #ebebeb; max-width: 280px; margin: 40px auto; border: none; }

        /* Tiers */
        .tier { max-width: 1260px; margin: 0 auto; padding: 0 40px; }
        .tier-head { text-align: center; margin-bottom: 24px; }
        .tier-title { font-size: 13px; font-weight: 700; letter-spacing: 0.22em; color: #0a0a0a; margin: 0 0 12px; }

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

        ${SHOWCASE_CSS}

        @media (max-width: 767px) {
          .creator-hr { margin: 28px auto; max-width: 200px; }
          .tier { padding: 0 12px; }
        }
      `}</style>

      {/* Navigation par categorie : Gear, Lifestyle, Unboxing, Talk */}
      <CreatorNav
        lang={lang}
        active={section}
        labels={{ gear: t.gear, lifestyle: t.lifestyle, unboxing: t.unboxing, talk: t.talk }}
      />

      {/* La categorie active : carrousel seul, comme Filmmaker */}
      <section className="tier">
        <div className="tier-head">
          <h1 className="tier-title">{t[section]}</h1>
        </div>
        <Carousel clips={clips} kind="phone" prefix={section} sound={sound} />
      </section>

      <hr className="creator-hr" />

      {/* CTA */}
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
