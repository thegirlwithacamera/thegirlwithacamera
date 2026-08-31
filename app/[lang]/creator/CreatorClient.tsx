"use client";

import Link from "next/link";
import { SECTIONS, type Clip, type Section } from "./constants";
import TrustLogos from "../components/TrustLogos";
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
    framing: "Ces formats se produisent aussi pour les marques, avec ou sans publication sur mes propres canaux.",
    deliverables: "Vidéo verticale · Photos éditées · Concept, tournage et montage · Droits d'usage chiffrés séparément",
  },
  en: {
    gear: "GEAR",
    lifestyle: "LIFESTYLE",
    unboxing: "UNBOXING",
    talk: "TALK",
    framing: "These formats are also produced for brands, with or without posting on my own channels.",
    deliverables: "Vertical video · Edited stills · Concept, shooting and editing · Usage rights quoted separately",
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

        /* Bloc offre : cadrage + livrables, puis bande clients.
           Meme direction artistique, texte sobre facon legende. */
        .creator-pitch { max-width: 720px; margin: 52px auto 0; padding: 0 24px; text-align: center; }
        .creator-pitch-line { font-size: 12px; line-height: 1.7; color: #666666; margin: 0 0 14px; }
        .creator-pitch-deliverables { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #999999; margin: 0; }
        .creator-hr { height: 1px; background: #ebebeb; max-width: 280px; margin: 40px auto; border: none; }

        @media (max-width: 767px) {
          .tier { padding: 0 12px; }
          .creator-pitch { margin-top: 40px; }
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

      {/* Ce qui est vendu : cadrage + livrables (sur les 4 onglets) */}
      <div className="creator-pitch">
        <p className="creator-pitch-line">{t.framing}</p>
        <p className="creator-pitch-deliverables">{t.deliverables}</p>
      </div>

      <hr className="creator-hr" />

      {/* Bande clients, meme composant que sur About, mais limitee aux
          marques : cette page vend des formats de creation, les hotels n'y
          disent rien au visiteur qui la lit. */}
      <TrustLogos lang={lang} cats={["brand"]} />

      {/* Mise en avant au clic */}
      {focused && (
        <FocusOverlay clip={focused.clip} kind={focused.kind} onClose={closeFocus} />
      )}
    </main>
  );
}
