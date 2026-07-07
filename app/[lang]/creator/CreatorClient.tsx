"use client";

import { useRef, useState, useEffect } from "react";

export type Clip = { src: string; label: string; poster?: string };

type Data = {
  gear: Clip[];
  experiences: Clip[];
  unboxing: Clip[];
  talk: Clip[];
  cinematic: Clip[];
};

const STATS = {
  instagram: { followers: "32,4K", reelViews: "381K", reach: "174K" },
};

const BRANDS = [
  { name: "EDIFIER", position: "left" },
  { name: "TELESIN", position: "left" },
  { name: "RICOH EUROPE", position: "center" },
  { name: "PENTAX EUROPE", position: "center" },
  { name: "INSTA360", position: "center" },
  { name: "KIEHL'S", position: "right" },
  { name: "LA ROCHE POSAY", position: "right" },
];

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
    tiers: {
      gear: "GEAR",
      experiences: "EXPÉRIENCES",
      unboxing: "UNBOXING",
      talk: "TALK",
      cinematic: "CINÉMATIQUE",
      cinematicDesc: "Mes video diaries. Des séquences contemplatives et cinématiques.",
    },
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
    tiers: {
      gear: "GEAR",
      experiences: "EXPERIENCES",
      unboxing: "UNBOXING",
      talk: "TALK",
      cinematic: "CINEMATIC",
      cinematicDesc: "My video diaries. Contemplative, cinematic sequences.",
    },
  },
};

export default function CreatorClient({ lang, data }: { lang: "fr" | "en"; data: Data }) {
  const t = content[lang];

  // Un seul son actif a la fois, sur toute la page.
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [unmutedKey, setUnmutedKey] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) v.play().catch(() => {});
    });
  }, []);

  function toggleSound(key: string) {
    const next = unmutedKey === key ? null : key;
    setUnmutedKey(next);
    videoRefs.current.forEach((v, k) => {
      if (v) v.muted = next === null || k !== next;
    });
  }

  function registerRef(key: string, el: HTMLVideoElement | null) {
    if (el) videoRefs.current.set(key, el);
    else videoRefs.current.delete(key);
  }

  function scrollCarousel(dir: 1 | -1) {
    const track = carouselRef.current;
    if (!track) return;
    const first = track.querySelector(".tablet-wrap") as HTMLElement | null;
    const step = first ? first.offsetWidth + 18 : 320;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  function SoundBtn({ on, onClick }: { on: boolean; onClick: () => void }) {
    return (
      <button className="vid-sound" onClick={onClick} aria-label={on ? "Mute video" : "Unmute video"}>
        {on ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        )}
      </button>
    );
  }

  // Bloc vertical (telephones). Masque si aucun clip.
  function PhoneTier({ title, clips, prefix }: { title: string; clips: Clip[]; prefix: string }) {
    if (clips.length === 0) return null;
    return (
      <>
        <section className="tier">
          <div className="tier-head">
            <h2 className="tier-title">{title}</h2>
          </div>
          <div className="phones-row">
            {clips.map((clip, i) => {
              const key = `${prefix}-${i}`;
              return (
                <div key={key} className="phone-wrap">
                  <div className="phone">
                    <video
                      ref={(el) => registerRef(key, el)}
                      src={clip.src}
                      poster={clip.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      controlsList="nodownload nofullscreen"
                      onContextMenu={(e) => e.preventDefault()}
                      title={`Creator content: ${clip.label}`}
                    />
                    <SoundBtn on={unmutedKey === key} onClick={() => toggleSound(key)} />
                  </div>
                  <span className="vid-label">{clip.label}</span>
                </div>
              );
            })}
          </div>
        </section>
        <hr className="creator-hr" />
      </>
    );
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
          margin: 40px auto;
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
        .tier-head { text-align: center; margin-bottom: 28px; }
        .tier-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #0a0a0a;
          margin: 0 0 12px;
        }
        .tier-desc {
          font-size: 11px;
          line-height: 1.9;
          letter-spacing: 0.05em;
          color: #999999;
          max-width: 560px;
          margin: 0 auto;
          font-style: italic;
        }

        /* Telephones verticaux 9:16 */
        .phones-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 18px;
          max-width: 900px;
          margin: 0 auto;
        }
        .phone-wrap { width: 180px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
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
        .phone video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Carrousel de tablettes horizontales 16:9 (Cinematique) */
        .carousel { position: relative; max-width: 1100px; margin: 0 auto; padding: 0 8px; }
        .carousel-track {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4px 4px 8px;
        }
        .carousel-track::-webkit-scrollbar { display: none; }
        .tablet-wrap {
          flex: 0 0 auto;
          width: 300px;
          scroll-snap-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .tablet {
          width: 100%;
          border: 2px solid #0a0a0a;
          border-radius: 16px;
          padding: 8px 12px;
          background: #1a1a1a;
          position: relative;
        }
        .tablet::before {
          content: '';
          position: absolute;
          left: 4px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #333;
          z-index: 2;
        }
        .tablet-screen { aspect-ratio: 16 / 9; border-radius: 6px; overflow: hidden; background: #000; position: relative; }
        .tablet-screen video { width: 100%; height: 100%; object-fit: cover; display: block; }

        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 5;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #e5e5e5;
          background: #ffffff;
          color: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 1px 6px rgba(0,0,0,0.08);
          transition: background 0.2s, border-color 0.2s;
        }
        .carousel-arrow:hover { background: #0a0a0a; color: #ffffff; border-color: #0a0a0a; }
        .carousel-arrow--prev { left: -6px; }
        .carousel-arrow--next { right: -6px; }

        .vid-label { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #666666; text-align: center; }

        /* Bouton son commun */
        .vid-sound {
          position: absolute;
          bottom: 10px;
          right: 10px;
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
        .vid-sound:hover { background: rgba(0,0,0,0.7); }

        /* Brands */
        .brand-item { font-size: 12px; letter-spacing: 0.12em; color: #0a0a0a; text-align: center; line-height: 2.6; }

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

        @media (max-width: 767px) {
          .creator-bio { font-size: 12px; padding: 0 24px; }
          .stats-grid { gap: 14px; padding: 0 24px; }
          .stat-platform { font-size: 8px; margin-bottom: 6px; }
          .stat-number { font-size: 20px; }
          .stat-sub { font-size: 9px; margin-top: 2px; }
          .section-title { margin: 0 0 16px; font-size: 10px; }
          .creator-hr { margin: 28px auto; max-width: 200px; }
          .tier { padding: 0 20px; }
          .phone-wrap { width: 132px; }
          .phone { border-width: 1.5px; }
          .phone::before { width: 26px; height: 3px; }
          .carousel { padding: 0; }
          .tablet-wrap { width: 230px; }
          .carousel-arrow { width: 32px; height: 32px; }
          .carousel-arrow--prev { left: 0; }
          .carousel-arrow--next { right: 0; }
          .brands-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>

      {/* Bio */}
      <p className="creator-bio">{t.bio}</p>

      <hr className="creator-hr" />

      {/* Stats */}
      <p className="section-title" style={{ marginBottom: "8px" }}>{t.reach}</p>
      <p style={{ textAlign: "center", fontSize: "10px", letterSpacing: "0.16em", color: "#999999", marginBottom: "36px" }}>
        {t.reachSub}
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

      {/* Blocs verticaux (telephones) */}
      <PhoneTier title={t.tiers.gear}        clips={data.gear}        prefix="gear" />
      <PhoneTier title={t.tiers.experiences} clips={data.experiences} prefix="experiences" />
      <PhoneTier title={t.tiers.unboxing}    clips={data.unboxing}    prefix="unboxing" />
      <PhoneTier title={t.tiers.talk}        clips={data.talk}        prefix="talk" />

      {/* Bloc horizontal premium (carrousel de tablettes) */}
      <section className="tier">
        <div className="tier-head">
          <h2 className="tier-title">{t.tiers.cinematic}</h2>
          <p className="tier-desc">{t.tiers.cinematicDesc}</p>
        </div>
        <div className="carousel">
          <button className="carousel-arrow carousel-arrow--prev" onClick={() => scrollCarousel(-1)} aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="carousel-track" ref={carouselRef}>
            {data.cinematic.map((clip, i) => {
              const key = `cinematic-${i}`;
              return (
                <div key={key} className="tablet-wrap">
                  <div className="tablet">
                    <div className="tablet-screen">
                      <video
                        ref={(el) => registerRef(key, el)}
                        src={clip.src}
                        poster={clip.poster}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        controlsList="nodownload nofullscreen"
                        onContextMenu={(e) => e.preventDefault()}
                        title={`Cinematic content: ${clip.label}`}
                      />
                      <SoundBtn on={unmutedKey === key} onClick={() => toggleSound(key)} />
                    </div>
                  </div>
                  <span className="vid-label">{clip.label}</span>
                </div>
              );
            })}
          </div>
          <button className="carousel-arrow carousel-arrow--next" onClick={() => scrollCarousel(1)} aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </section>

      <hr className="creator-hr" />

      {/* Ils me font confiance */}
      <p className="section-title">{t.workingWith}</p>
      <div className="brands-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px", maxWidth: "800px", margin: "0 auto", padding: "0 40px" }}>
        {["left", "center", "right"].map((pos) => (
          <div key={pos} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            {BRANDS.filter((b) => b.position === pos).map((b) => (
              <p key={b.name} className="brand-item">{b.name}</p>
            ))}
          </div>
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
