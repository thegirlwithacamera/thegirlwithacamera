"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export type Clip = { src: string; label: string; poster?: string };
export type Diary = { life: Clip[]; photographer: Clip[]; city: Clip[]; fashion: Clip[] };

type Data = {
  gear: Clip[];
  experiences: Clip[];
  unboxing: Clip[];
  talk: Clip[];
  diary: Diary;
};

type Sound = {
  unmutedKey: string | null;
  toggleSound: (key: string) => void;
  registerRef: (key: string, el: HTMLVideoElement | null) => void;
};

const DIARY_CATS = ["life", "photographer", "city", "fashion"] as const;
type DiaryCat = (typeof DIARY_CATS)[number];

const STATS = {
  instagram: { followers: "32,4K", reelViews: "381K", reach: "174K" },
};

// Clients, dans l'ordre d'importance. Ricoh, Pentax et Insta360 en tete.
const BRANDS = ["RICOH EUROPE", "PENTAX EUROPE", "INSTA360", "EDIFIER", "TELESIN"];

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
    experiences: "EXPÉRIENCES",
    unboxing: "UNBOXING",
    talk: "TALK",
    diaryTitle: "DIARY",
    diaryDesc: "Mes video diaries. Des séquences contemplatives et cinématiques.",
    cat: { life: "LIFE", photographer: "PHOTOGRAPHER", city: "CITY", fashion: "FASHION" },
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
    experiences: "EXPERIENCES",
    unboxing: "UNBOXING",
    talk: "TALK",
    diaryTitle: "DIARY",
    diaryDesc: "My video diaries. Contemplative, cinematic sequences.",
    cat: { life: "LIFE", photographer: "PHOTOGRAPHER", city: "CITY", fashion: "FASHION" },
  },
};

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

function Mock({ clip, cardKey, kind, sound }: { clip: Clip; cardKey: string; kind: "phone" | "tablet"; sound: Sound }) {
  const video = (
    <video
      ref={(el) => sound.registerRef(cardKey, el)}
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
  );
  const btn = <SoundBtn on={sound.unmutedKey === cardKey} onClick={() => sound.toggleSound(cardKey)} />;

  return (
    <div className="slide">
      {kind === "tablet" ? (
        <div className="tablet">
          <div className="tablet-screen">
            {video}
            {btn}
          </div>
        </div>
      ) : (
        <div className="phone">
          {video}
          {btn}
        </div>
      )}
      <span className="vid-label">{clip.label}</span>
    </div>
  );
}

function Carousel({ clips, kind, prefix, sound }: { clips: Clip[]; kind: "phone" | "tablet"; prefix: string; sound: Sound }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const check = () => setOverflow(el.scrollWidth > el.clientWidth + 4);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [clips.length]);

  function scroll(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector(".slide") as HTMLElement | null;
    const step = first ? first.offsetWidth + 16 : 280;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className={`carousel carousel--${kind}`}>
      {overflow && (
        <button className="carousel-arrow carousel-arrow--prev" onClick={() => scroll(-1)} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      )}
      <div className={`carousel-track${overflow ? "" : " carousel-track--center"}`} ref={trackRef}>
        {clips.map((clip, i) => (
          <Mock key={`${prefix}-${i}`} clip={clip} cardKey={`${prefix}-${i}`} kind={kind} sound={sound} />
        ))}
      </div>
      {overflow && (
        <button className="carousel-arrow carousel-arrow--next" onClick={() => scroll(1)} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      )}
    </div>
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

function DiaryBlock({
  diary,
  title,
  desc,
  catLabels,
  sound,
}: {
  diary: Diary;
  title: string;
  desc: string;
  catLabels: Record<DiaryCat, string>;
  sound: Sound;
}) {
  const cats = DIARY_CATS.filter((c) => diary[c].length > 0);
  const [active, setActive] = useState<DiaryCat>(cats[0] ?? "city");
  if (cats.length === 0) return null;

  const current = cats.includes(active) ? active : cats[0];

  return (
    <section className="tier">
      <div className="tier-head">
        <h2 className="tier-title">{title}</h2>
        <p className="tier-desc">{desc}</p>
      </div>
      {cats.length > 1 && (
        <div className="diary-tabs">
          {cats.map((c) => (
            <button
              key={c}
              className={`diary-tab${c === current ? " diary-tab--active" : ""}`}
              onClick={() => setActive(c)}
            >
              {catLabels[c]}
            </button>
          ))}
        </div>
      )}
      <Carousel clips={diary[current]} kind="tablet" prefix={`diary-${current}`} sound={sound} />
    </section>
  );
}

export default function CreatorClient({ lang, data }: { lang: "fr" | "en"; data: Data }) {
  const t = content[lang];

  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [unmutedKey, setUnmutedKey] = useState<string | null>(null);

  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) v.play().catch(() => {});
    });
  }, []);

  const registerRef = useCallback((key: string, el: HTMLVideoElement | null) => {
    if (el) videoRefs.current.set(key, el);
    else videoRefs.current.delete(key);
  }, []);

  const toggleSound = useCallback((key: string) => {
    setUnmutedKey((prev) => {
      const next = prev === key ? null : key;
      videoRefs.current.forEach((v, k) => {
        if (v) v.muted = next === null || k !== next;
      });
      return next;
    });
  }, []);

  const sound: Sound = { unmutedKey, toggleSound, registerRef };

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

        /* Diary tabs */
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
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 8px 16px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999999;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          margin-bottom: -1px;
        }
        .diary-tab:hover { color: #555; }
        .diary-tab--active { color: #0a0a0a; border-bottom-color: #0a0a0a; }

        /* Carrousel commun */
        .carousel { position: relative; max-width: 1100px; margin: 0 auto; padding: 0 8px; }
        .carousel-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4px 4px 8px;
        }
        .carousel-track::-webkit-scrollbar { display: none; }
        .carousel-track--center { justify-content: center; }
        .slide {
          flex: 0 0 auto;
          scroll-snap-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .carousel--phone .slide { width: 160px; }
        .carousel--tablet .slide { width: 300px; }

        .carousel-arrow {
          position: absolute;
          top: 45%;
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

        /* Telephone 9:16 */
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

        /* Tablette 16:9 */
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

        .vid-label { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #666666; text-align: center; }

        /* Bouton son */
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
        .trust-label { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; color: #999999; text-align: center; margin: 4px 0 14px; }
        .brands-strip { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px 16px; max-width: 640px; margin: 0 auto; padding: 0 24px; }
        .brand-chip { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #0a0a0a; }

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
          .tier { padding: 0 12px; }
          .carousel { padding: 0; }
          .carousel--phone .slide { width: 132px; }
          .carousel--tablet .slide { width: 240px; }
          .carousel-arrow { width: 30px; height: 30px; }
          .carousel-arrow--prev { left: 0; }
          .carousel-arrow--next { right: 0; }
          .phone { border-width: 1.5px; }
          .phone::before { width: 26px; height: 3px; }
          .diary-tab { padding: 8px 11px; font-size: 9px; letter-spacing: 0.16em; }
          .brand-chip { font-size: 9px; letter-spacing: 0.1em; }
        }
      `}</style>

      {/* Ils me font confiance, tout en haut (gras noir) */}
      <p className="trust-label">{t.workingWith}</p>
      <div className="brands-strip" style={{ marginBottom: "40px" }}>
        {BRANDS.map((b) => (
          <span key={b} className="brand-chip">{b}</span>
        ))}
      </div>

      {/* Gear en premier : les telephones sautent aux yeux */}
      <PhoneTier title={t.gear} clips={data.gear} prefix="gear" sound={sound} />

      {/* Stats, sous Gear */}
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

      {/* Phrase contenu visuel, entre les telephones */}
      <p className="creator-bio">{t.bio}</p>

      {/* Suite des blocs telephone */}
      <PhoneTier title={t.experiences} clips={data.experiences} prefix="experiences" sound={sound} />
      <PhoneTier title={t.unboxing}    clips={data.unboxing}    prefix="unboxing"    sound={sound} />
      <PhoneTier title={t.talk}        clips={data.talk}        prefix="talk"        sound={sound} />

      {/* Diary (video diaries) en carrousel de tablettes, par categorie */}
      <DiaryBlock
        diary={data.diary}
        title={t.diaryTitle}
        desc={t.diaryDesc}
        catLabels={t.cat}
        sound={sound}
      />

      <hr className="creator-hr" />

      {/* CTA */}
      <div className="creator-cta">
        <p>{t.cta}</p>
        <a href={`mailto:${t.ctaLink}`}>{t.ctaLink}</a>
      </div>
    </main>
  );
}
