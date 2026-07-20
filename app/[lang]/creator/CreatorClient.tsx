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
    gear: "GEAR",
    lifestyle: "LIFESTYLE",
    unboxing: "UNBOXING",
    talk: "TALK",
  },
  en: {
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
    <main style={{ paddingTop: "20px", paddingBottom: "24px", background: "#ffffff" }}>
      <style>{`

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

        ${SHOWCASE_CSS}

        @media (max-width: 767px) {
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


      {/* Mise en avant au clic */}
      {focused && (
        <FocusOverlay clip={focused.clip} kind={focused.kind} onClose={closeFocus} />
      )}
    </main>
  );
}
