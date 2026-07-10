"use client";

import Link from "next/link";
import { DIARY_CATS, type Diary, type DiaryCat } from "./constants";
import {
  Carousel,
  FocusOverlay,
  SHOWCASE_CSS,
  useVideoSound,
} from "../components/VideoShowcase";

const content = {
  fr: {
    title: "FILMMAKER",
    desc: "Des séquences contemplatives et cinématiques.",
    cat: { fashion: "FASHION", lifestyle: "LIFESTYLE", places: "PLACES", travel: "TRAVEL", work: "WORK" },
    cta: "On travaille ensemble ?",
    ctaLink: "hello@thegirlwithacamera.com",
  },
  en: {
    title: "FILMMAKER",
    desc: "Contemplative, cinematic sequences.",
    cat: { fashion: "FASHION", lifestyle: "LIFESTYLE", places: "PLACES", travel: "TRAVEL", work: "WORK" },
    cta: "Want to work together?",
    ctaLink: "hello@thegirlwithacamera.com",
  },
};

export default function FilmmakerClient({
  lang,
  diary,
  activeCat,
}: {
  lang: "fr" | "en";
  diary: Diary;
  activeCat?: DiaryCat; // categorie active sur /filmmaker/[categorie]
}) {
  const t = content[lang];
  const { sound, focused, closeFocus } = useVideoSound();

  const cats = DIARY_CATS.filter((c) => diary[c].length > 0);
  const current = activeCat && cats.includes(activeCat) ? activeCat : cats[0];

  return (
    <main style={{ paddingTop: "20px", paddingBottom: "80px", background: "#ffffff" }}>
      <style>{`
        .creator-hr { height: 1px; background: #ebebeb; max-width: 280px; margin: 40px auto; border: none; }

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

        /* Onglets categories (liens : chaque categorie a son URL) */
        .diary-tabs {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 4px;
          margin: 0 auto 24px;
          border-bottom: 1px solid #ebebeb;
          max-width: 560px;
        }
        .diary-tab {
          display: inline-block;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 8px 16px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999999;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          margin-bottom: -1px;
        }
        .diary-tab:hover { color: #555; }
        .diary-tab--active { color: #0a0a0a; border-bottom-color: #0a0a0a; }

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
          .diary-tab { padding: 8px 11px; font-size: 9px; letter-spacing: 0.16em; }
        }
      `}</style>

      <section className="tier">
        <div className="tier-head">
          <h1 className="tier-title">{t.title}</h1>
          <p className="tier-desc">{t.desc}</p>
        </div>
        {cats.length > 1 && (
          <div className="diary-tabs">
            {cats.map((c) => (
              <Link
                key={c}
                href={`/${lang}/filmmaker/${c}`}
                className={`diary-tab${c === current ? " diary-tab--active" : ""}`}
              >
                {t.cat[c]}
              </Link>
            ))}
          </div>
        )}
        {current && (
          <Carousel clips={diary[current]} kind="tablet" prefix={`diary-${current}`} sound={sound} />
        )}
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
