"use client";

import { use, useRef, useState, useEffect } from "react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

// Tes stats sociales — mets à jour les chiffres quand tu veux
const STATS = {
  instagram: { followers: "31K", reelViews: "302K", reach: "217K" },
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
    workingWith: "ILS ME FONT CONFIANCE",
    cta: "On travaille ensemble ?",
    ctaLink: "hello@thegirlwithacamera.com",
    igLabel: "Instagram",
    followers: "abonnés",
    reelViews: "vues de reel",
    avgReach: "comptes touchés",
  },
  en: {
    bio: "AUTHENTIC VISUAL CONTENT FOR BRANDS THAT WANT TO EXIST ON SOCIAL MEDIA WITHOUT LOOKING LIKE AN AD.",
    formats: "FORMATS",
    reach: "AUDIENCE",
    workingWith: "ALREADY WORKING WITH",
    cta: "Want to work together?",
    ctaLink: "hello@thegirlwithacamera.com",
    igLabel: "Instagram",
    followers: "followers",
    reelViews: "reel views",
    avgReach: "accounts reached",
  },
};

export default function CreatorPage({ params }: Props) {
  const { lang } = use(params);
  const t = content[lang];
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [unmutedIndex, setUnmutedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);

  const videos = [
    { src: "/videos/creator/unboxing.mp4",           label: "Unboxing" },
    { src: "/videos/creator/product-in-use.mp4",    label: "Product\nin Use" },
    { src: "/videos/creator/unboxing-face-cam.mp4", label: "Unboxing\nFace Cam" },
    { src: "/videos/creator/lifestyle.mp4",         label: "Lifestyle" },
    { src: "/videos/creator/unboxing-2.mp4",        label: "Unboxing" },
    { src: "/videos/creator/product-vs-results.mp4",label: "Product vs\nResults" },
  ];

  function toggleSound(i: number) {
    const next = unmutedIndex === i ? null : i;
    setUnmutedIndex(next);
    videoRefs.current.forEach((v, idx) => {
      if (v) v.muted = (next === null || idx !== next);
    });
  }

  function handleSwipe(e: React.TouchEvent) {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setActiveIndex((activeIndex + 1) % videos.length);
        setUnmutedIndex(null);
      } else if (diff < 0) {
        setActiveIndex((activeIndex - 1 + videos.length) % videos.length);
        setUnmutedIndex(null);
      }
    }
  }

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
        .creator-hr {
          height: 1px;
          background: #ebebeb;
          max-width: 280px;
          margin: 24px auto;
          border: none;
        }
        .section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #0a0a0a;
          text-align: center;
          margin: 0 0 36px;
        }
        /* Phone mockups */
        .phones-row {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 40px;
          align-items: flex-end;
        }
        .phone-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .phone {
          width: 100%;
          aspect-ratio: 9 / 16;
          border: 2px solid #0a0a0a;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          background: #1a1a1a;
        }
        .phone::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 4px;
          background: #333;
          border-radius: 2px;
          z-index: 2;
        }
        .phone-screen {
          position: absolute;
          inset: 0;
        }
        .phone-screen video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .phone-label {
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #666666;
          text-align: center;
        }
        .phone-sound {
          position: absolute;
          bottom: 16px;
          right: 12px;
          z-index: 3;
          background: rgba(0,0,0,0.45);
          border: none;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          backdrop-filter: blur(4px);
          transition: background 0.2s;
        }
        .phone-sound:hover { background: rgba(0,0,0,0.7); }
        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          max-width: 480px;
          margin: 0 auto;
          padding: 0 40px;
          align-items: center;
        }
        .stat-block {
          text-align: center;
        }
        .stat-platform {
          font-size: 9px;
          letter-spacing: 0.22em;
          font-weight: 400;
          color: #666666;
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
          font-size: 11px;
          letter-spacing: 0.14em;
          color: #666666;
          margin-top: 4px;
        }
        /* Stack carousel for videos on mobile */
        .phones-carousel {
          display: none;
          position: relative;
          width: 100%;
          max-width: 520px;
          height: 320px;
          margin: 80px auto;
          perspective: 1200px;
          cursor: grab;
          overflow: visible;
          padding: 0 20px;
          touch-action: none;
        }
        .carousel-phone-wrap {
          position: absolute;
          width: 160px;
          height: 320px;
          left: 50%;
          top: 0;
          transform-origin: center center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 10;
          margin-left: -80px;
        }
        .carousel-phone-wrap.active {
          transform: translateX(0) scale(1) rotateY(0deg);
          z-index: 20;
        }
        .carousel-phone-wrap.next {
          transform: translateX(130px) scale(0.88) rotateY(-8deg);
          z-index: 9;
          opacity: 0.6;
        }
        .carousel-phone-wrap.next-2 {
          transform: translateX(200px) scale(0.8) rotateY(-12deg);
          z-index: 8;
          opacity: 0;
          pointer-events: none;
        }
        .carousel-phone-wrap.prev {
          transform: translateX(-130px) scale(0.88) rotateY(8deg);
          z-index: 11;
          opacity: 0.6;
        }
        .carousel-phone-wrap.hidden {
          transform: translateX(-200px) scale(0.8) rotateY(12deg);
          z-index: 0;
          opacity: 0;
          pointer-events: none;
        }
        /* Formats */
        .formats-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .format-item {
          font-size: 12px;
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
          font-size: 12px;
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
          font-size: 13px;
          color: #666666;
          letter-spacing: 0.04em;
          margin-bottom: 16px;
        }
        .creator-cta a {
          font-size: 12px;
          letter-spacing: 0.14em;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 1px solid #0a0a0a;
          padding-bottom: 2px;
        }
        @media (max-width: 1023px) {
          .phones-row { grid-template-columns: repeat(3, 1fr); gap: 12px; }
        }
        @media (max-width: 767px) {
          .creator-bio { font-size: 12px; padding: 0 24px; }
          .stats-grid { max-width: 100%; gap: 20px; }
          .phones-row { display: none; }
          .phones-carousel {
            display: block;
            max-width: 480px;
            height: 280px;
            margin: 60px auto;
            padding: 0 20px;
          }
          .carousel-phone-wrap {
            width: 140px;
            height: 280px;
            margin-left: -70px;
          }
          .carousel-phone-wrap.next {
            transform: translateX(110px) scale(0.88) rotateY(-8deg);
          }
          .carousel-phone-wrap.next-2 {
            transform: translateX(170px) scale(0.8) rotateY(-12deg);
            opacity: 0;
          }
          .carousel-phone-wrap.prev {
            transform: translateX(-110px) scale(0.88) rotateY(8deg);
          }
          .carousel-phone-wrap.hidden {
            transform: translateX(-170px) scale(0.8) rotateY(12deg);
          }
          .phone {
            border-width: 1.5px;
          }
          .phone::before {
            width: 26px;
            height: 3px;
          }
          .phone-sound {
            width: 22px;
            height: 22px;
            bottom: 12px;
            right: 10px;
          }
          .phone-label {
            font-size: 8px;
            line-height: 1.2;
          }
          .stat-platform { font-size: 8px; margin-bottom: 6px; }
          .stat-number { font-size: 20px; }
          .stat-sub { font-size: 9px; margin-top: 2px; }
          .stats-grid { gap: 14px; padding: 0 24px; }
          .section-title { margin: 0 0 16px; font-size: 10px; }
          .creator-hr { margin: 14px auto; max-width: 200px; }
        }
      `}</style>

      {/* Bio */}
      <p className="creator-bio">{t.bio}</p>

      <hr className="creator-hr" />

      {/* Stats */}
      <p className="section-title">{t.reach}</p>
      <p style={{ textAlign: "center", fontSize: "10px", letterSpacing: "0.16em", color: "#999999", marginBottom: "36px" }}>
        {lang === "fr" ? "sur les 30 derniers jours" : "over the last 30 days"}
      </p>
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

      {/* Phone mockups - Desktop grid */}
      <div className="phones-row">
        {[
          { src: "/videos/creator/unboxing.mp4",           label: "Unboxing" },
          { src: "/videos/creator/product-in-use.mp4",    label: "Product\nin Use" },
          { src: "/videos/creator/unboxing-face-cam.mp4", label: "Unboxing\nFace Cam" },
          { src: "/videos/creator/lifestyle.mp4",         label: "Lifestyle" },
          { src: "/videos/creator/unboxing-2.mp4",        label: "Unboxing" },
          { src: "/videos/creator/product-vs-results.mp4",label: "Product vs\nResults" },
        ].map((phone, i) => (
          <div key={i} className="phone-wrap">
            <div className="phone">
              <div className="phone-screen">
                <video
                  ref={el => { videoRefs.current[i] = el; }}
                  src={phone.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controlsList="nodownload nofullscreen"
                  onContextMenu={(e) => e.preventDefault()}
                  title={`Creator content: ${phone.label}`}
                />
              </div>
              <button className="phone-sound" onClick={() => toggleSound(i)} aria-label="toggle sound">
                {unmutedIndex === i ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                )}
              </button>
            </div>
            <span className="phone-label" style={{ whiteSpace: "pre-line" }}>{phone.label}</span>
          </div>
        ))}
      </div>

      {/* Phone mockups - Mobile stack carousel */}
      <div
        className="phones-carousel"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={handleSwipe}
      >
        {videos.map((phone, i) => {
          let cardClass = "carousel-phone-wrap";
          const nextIdx = (activeIndex + 1) % videos.length;
          const next2Idx = (activeIndex + 2) % videos.length;
          const prevIdx = (activeIndex - 1 + videos.length) % videos.length;

          if (i === activeIndex) {
            cardClass += " active";
          } else if (i === nextIdx) {
            cardClass += " next";
          } else if (i === next2Idx) {
            cardClass += " next-2";
          } else if (i === prevIdx) {
            cardClass += " prev";
          } else {
            cardClass += " hidden";
          }

          return (
            <div key={i} className={cardClass}>
              <div className="phone">
                <div className="phone-screen">
                  <video
                    ref={el => { videoRefs.current[i] = el; }}
                    src={phone.src}
                    autoPlay={i === activeIndex}
                    muted={unmutedIndex !== i}
                    loop
                    playsInline
                    controlsList="nodownload nofullscreen"
                    onContextMenu={(e) => e.preventDefault()}
                    title={`Creator content: ${phone.label}`}
                  />
                </div>
                <button className="phone-sound" onClick={() => toggleSound(i)} aria-label="toggle sound">
                  {unmutedIndex === i ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  )}
                </button>
              </div>
              <span className="phone-label" style={{ whiteSpace: "pre-line" }}>{phone.label}</span>
            </div>
          );
        })}
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
