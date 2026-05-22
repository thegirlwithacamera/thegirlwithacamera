"use client";

import { use } from "react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

// Tes stats sociales — mets à jour les chiffres quand tu veux
const STATS = {
  instagram: { followers: "—", reach: "—" },
  tiktok: { followers: "—", views: "—" },
};

const BRANDS = ["RICOH EUROPE", "PENTAX EUROPE", "INSTA360"];

// Tes formats de contenu — ajouter des thumbnails quand tu as du contenu
// { type: "Reviews & Unboxing", thumb: "/images/creator/01.jpg" }
const CONTENT_TYPES = [
  { label: "REVIEWS & UNBOXING" },
  { label: "LIFESTYLE & DAY IN THE LIFE" },
  { label: "BRAND STORYTELLING" },
  { label: "REELS & SHORT-FORM" },
  { label: "TUTORIALS & HOW-TO" },
];

const content = {
  fr: {
    bio: "CONTENU VISUEL AUTHENTIQUE POUR LES MARQUES QUI VEULENT EXISTER SUR LES RÉSEAUX SANS RESSEMBLER À UNE PUBLICITÉ.",
    formats: "FORMATS",
    reach: "AUDIENCE",
    workingWith: "ALREADY WORKING WITH",
    cta: "Tu veux travailler ensemble ?",
    ctaLink: "hello@thegirlwithacamera.com",
    igLabel: "Instagram",
    ttLabel: "TikTok",
    followers: "abonnés",
    avgReach: "reach moyen",
    avgViews: "vues moy.",
  },
  en: {
    bio: "AUTHENTIC VISUAL CONTENT FOR BRANDS THAT WANT TO EXIST ON SOCIAL MEDIA WITHOUT LOOKING LIKE AN AD.",
    formats: "FORMATS",
    reach: "AUDIENCE",
    workingWith: "ALREADY WORKING WITH",
    cta: "Want to work together?",
    ctaLink: "hello@thegirlwithacamera.com",
    igLabel: "Instagram",
    ttLabel: "TikTok",
    followers: "followers",
    avgReach: "avg reach",
    avgViews: "avg views",
  },
};

export default function CreatorPage({ params }: Props) {
  const { lang } = use(params);
  const t = content[lang];

  return (
    <main style={{ paddingTop: "60px", paddingBottom: "80px", background: "#ffffff" }}>
      <style>{`
        .creator-bio {
          font-size: 11px;
          line-height: 2;
          letter-spacing: 0.06em;
          color: #0a0a0a;
          text-align: center;
          max-width: 680px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .creator-hr {
          height: 1px;
          background: #ebebeb;
          max-width: 280px;
          margin: 52px auto;
          border: none;
        }
        .section-title {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #0a0a0a;
          text-align: center;
          margin: 0 0 36px;
        }
        /* Phone mockups */
        .phones-row {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 20px;
          flex-wrap: wrap;
          padding: 0 40px;
        }
        .phone-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .phone {
          width: 158px;
          height: 310px;
          border: 2px solid #0a0a0a;
          border-radius: 30px;
          overflow: hidden;
          position: relative;
          background: #1a1a1a;
          flex-shrink: 0;
        }
        .phone.phone--tall {
          height: 360px;
        }
        .phone::before {
          content: '';
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 48px;
          height: 4px;
          background: #333;
          border-radius: 2px;
          z-index: 2;
        }
        .phone-screen {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .phone-label {
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #aaa;
          text-align: center;
        }
        /* Stats */
        .stats-grid {
          display: flex;
          justify-content: center;
          gap: 60px;
          flex-wrap: wrap;
          padding: 0 40px;
        }
        .stat-block {
          text-align: center;
        }
        .stat-platform {
          font-size: 8px;
          letter-spacing: 0.22em;
          font-weight: 700;
          color: #b0b0b0;
          margin-bottom: 16px;
        }
        .stat-number {
          font-family: "'EB Garamond', serif";
          font-size: 36px;
          font-weight: 400;
          font-style: italic;
          color: #0a0a0a;
          line-height: 1;
        }
        .stat-sub {
          font-size: 8px;
          letter-spacing: 0.14em;
          color: #c0c0c0;
          margin-top: 4px;
        }
        /* Formats */
        .formats-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .format-item {
          font-size: 10px;
          letter-spacing: 0.14em;
          color: #0a0a0a;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
          width: 100%;
          max-width: 340px;
          text-align: center;
        }
        /* Brands */
        .brand-item {
          font-size: 10px;
          letter-spacing: 0.12em;
          color: #0a0a0a;
          text-align: center;
          line-height: 2.6;
        }
        /* CTA */
        .creator-cta {
          text-align: center;
        }
        .creator-cta p {
          font-size: 12px;
          color: #9a9a9a;
          letter-spacing: 0.04em;
          margin-bottom: 16px;
        }
        .creator-cta a {
          font-size: 10px;
          letter-spacing: 0.14em;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 1px solid #0a0a0a;
          padding-bottom: 2px;
        }
        @media (max-width: 767px) {
          .creator-bio { font-size: 10px; padding: 0 24px; }
          .phones-row { gap: 12px; }
          .phone { width: 130px; height: 260px; }
          .phone.phone--tall { height: 300px; }
          .stats-grid { gap: 36px; }
        }
      `}</style>

      {/* Bio */}
      <p className="creator-bio">{t.bio}</p>

      <hr className="creator-hr" />

      {/* Phone mockups */}
      <p className="section-title">{t.formats}</p>
      <div className="phones-row">
        <div className="phone-wrap">
          <div className="phone">
            <div className="phone-screen">
              {/* Gradient placeholder — remplacer par <img src="..." /> */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #2a2a2a 0%, #111 100%)" }} />
            </div>
          </div>
          <span className="phone-label">Review &<br />Unboxing</span>
        </div>

        <div className="phone-wrap">
          <div className="phone phone--tall">
            <div className="phone-screen">
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #1e1e1e 0%, #0a0a0a 100%)" }} />
            </div>
          </div>
          <span className="phone-label">Day in<br />the Life</span>
        </div>

        <div className="phone-wrap">
          <div className="phone">
            <div className="phone-screen">
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #252525 0%, #141414 100%)" }} />
            </div>
          </div>
          <span className="phone-label">Brand<br />Storytelling</span>
        </div>
      </div>

      <hr className="creator-hr" />

      {/* Stats */}
      <p className="section-title">{t.reach}</p>
      <div className="stats-grid">
        <div className="stat-block">
          <p className="stat-platform">{t.igLabel}</p>
          <p className="stat-number">{STATS.instagram.followers}</p>
          <p className="stat-sub">{t.followers}</p>
          <p className="stat-number" style={{ marginTop: "16px", fontSize: "28px" }}>{STATS.instagram.reach}</p>
          <p className="stat-sub">{t.avgReach}</p>
        </div>
        <div className="stat-block">
          <p className="stat-platform">{t.ttLabel}</p>
          <p className="stat-number">{STATS.tiktok.followers}</p>
          <p className="stat-sub">{t.followers}</p>
          <p className="stat-number" style={{ marginTop: "16px", fontSize: "28px" }}>{STATS.tiktok.views}</p>
          <p className="stat-sub">{t.avgViews}</p>
        </div>
      </div>

      <hr className="creator-hr" />

      {/* Already working with */}
      <p className="section-title">{t.workingWith}</p>
      <div>
        {BRANDS.map((b) => (
          <p key={b} className="brand-item">{b}</p>
        ))}
      </div>

      <hr className="creator-hr" />

      {/* CTA */}
      <div className="creator-cta">
        <p>{t.cta}</p>
        <a href={`mailto:${t.ctaLink}`}>{t.ctaLink}</a>
      </div>
    </main>
  );
}
