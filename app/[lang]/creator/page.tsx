"use client";

import { use, useRef, useState, useEffect } from "react";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

// Tes stats sociales, mets a jour les chiffres quand tu veux
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

// ═════════════════════════════════════════════════════════════
//  VIDEOS PAR BLOC  —  OU AJOUTER TON NOUVEAU CONTENU
// ═════════════════════════════════════════════════════════════
//  Pour ajouter une video, ajoute une ligne { src, label, poster? }
//  dans le tableau du bloc concerne ci-dessous.
//
//  DEUX CAS :
//  1) GEAR / EXPERIENCES / UNBOXING / TALK (format vertical, telephones)
//     Depose ton fichier .mp4 dans  public/videos/creator/
//     puis pointe src sur "/videos/creator/mon-fichier.mp4".
//     Ces fichiers sont dans le repo et se deploient tout seuls.
//
//  2) CINEMATIQUE (format horizontal 16:9, tablettes, video diaries)
//     Ces clips sont plus lourds et heberges sur Vercel Blob.
//     Envoie-moi le fichier et je l'ajoute au Blob, OU depose une
//     version compressee dans public/videos/creator/ et pointe src
//     dessus comme au cas 1.
// ═════════════════════════════════════════════════════════════
const FILM_BASE = "https://3cwvdrhaucmdleep.public.blob.vercel-storage.com/film";

type Clip = { src: string; label: string; poster?: string };

// ── Blocs verticaux (telephones) ─────────────────────────────
// Bloc 1 — Gear (materiel, produit en main, resultats)
const GEAR: Clip[] = [
  { src: "/videos/creator/product-in-use.mp4",     label: "Product in Use" },
  { src: "/videos/creator/product-vs-results.mp4", label: "Product vs Results" },
  // AJOUTE TES REELS GEAR ICI
];

// Bloc 2 — Experiences (coiffeur, tatouage, head spa, lifestyle)
const EXPERIENCES: Clip[] = [
  { src: "/videos/creator/lifestyle.mp4", label: "Lifestyle" },
  // AJOUTE TES REELS EXPERIENCES ICI
];

// Bloc 3 — Unboxing
const UNBOXING: Clip[] = [
  { src: "/videos/creator/unboxing.mp4",   label: "Unboxing" },
  { src: "/videos/creator/unboxing-2.mp4", label: "Unboxing" },
  // AJOUTE TES REELS UNBOXING ICI
];

// Bloc 4 — Talk (face cam, prise de parole)
const TALK: Clip[] = [
  { src: "/videos/creator/unboxing-face-cam.mp4", label: "Face cam" },
  // AJOUTE TES REELS TALK ICI
];

// ── Bloc horizontal premium (tablettes) ──────────────────────
// Bloc 5 — Cinematique : video diaries contemplatifs (city / travel)
const CINEMATIC: Clip[] = [
  { src: `${FILM_BASE}/citydiary-01-tokyo.mp4`,   label: "Tokyo",       poster: "/videos/city-diary/01-tokyo-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-02-osaka.mp4`,   label: "Osaka",       poster: "/videos/city-diary/02-osaka-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-03-tokyo.mp4`,   label: "Tokyo Night", poster: "/videos/city-diary/03-tokyo-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-04-nara.mp4`,    label: "Nara",        poster: "/videos/city-diary/04-nara-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-05-kyoto.mp4`,   label: "Kyoto",       poster: "/videos/city-diary/05-kyoto-poster.jpg" },
  { src: `${FILM_BASE}/citydiary-06-cefalu.mp4`,  label: "Cefalu" },
  { src: `${FILM_BASE}/citydiary-07-palermo.mp4`, label: "Palermo" },
  // AJOUTE TES NOUVEAUX VIDEO DIARIES ICI (voir cas 2 plus haut)
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
      gear:        { title: "GEAR",        desc: "" },
      experiences: { title: "EXPÉRIENCES", desc: "" },
      unboxing:    { title: "UNBOXING",    desc: "" },
      talk:        { title: "TALK",        desc: "" },
      cinematic:   { title: "CINÉMATIQUE", desc: "Mes video diaries. Des séquences contemplatives et cinématiques." },
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
      gear:        { title: "GEAR",        desc: "" },
      experiences: { title: "EXPERIENCES", desc: "" },
      unboxing:    { title: "UNBOXING",    desc: "" },
      talk:        { title: "TALK",        desc: "" },
      cinematic:   { title: "CINEMATIC",   desc: "My video diaries. Contemplative, cinematic sequences." },
    },
  },
};

export default function CreatorPage({ params }: Props) {
  const { lang } = use(params);
  const t = content[lang];

  // Un seul son actif a la fois, sur toute la page.
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [unmutedKey, setUnmutedKey] = useState<string | null>(null);

  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) {
        v.play().catch(() => {
          // Autoplay peut etre bloque, ce n'est pas grave
        });
      }
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

  const phoneProps = { unmutedKey, toggleSound, registerRef, SoundBtn };

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
        .stat-platform {
          font-size: 9px;
          letter-spacing: 0.22em;
          color: #666666;
          margin-bottom: 16px;
        }
        .stat-number {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 36px;
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

        /* Tiers */
        .tier { max-width: 1260px; margin: 0 auto; padding: 0 40px; }
        .tier-head { text-align: center; margin-bottom: 28px; }
        .tier-tag {
          font-size: 9px;
          letter-spacing: 0.28em;
          color: #b8a98a;
          margin: 0 0 8px;
        }
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
        .phone-wrap {
          width: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
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
        .phone video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Tablettes horizontales 16:9 (Cinematique) */
        .tablets-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          max-width: 1080px;
          margin: 0 auto;
        }
        .tablet-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .tablet {
          width: 100%;
          border: 2px solid #0a0a0a;
          border-radius: 18px;
          padding: 10px 14px;
          background: #1a1a1a;
          position: relative;
        }
        .tablet::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #333;
          z-index: 2;
        }
        .tablet-screen {
          aspect-ratio: 16 / 9;
          border-radius: 8px;
          overflow: hidden;
          background: #000;
          position: relative;
        }
        .tablet-screen video { width: 100%; height: 100%; object-fit: cover; display: block; }

        .vid-label {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #666666;
          text-align: center;
        }

        /* Bouton son commun */
        .vid-sound {
          position: absolute;
          bottom: 12px;
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
        .vid-sound:hover { background: rgba(0,0,0,0.7); }

        /* Brands */
        .brand-item {
          font-size: 12px;
          letter-spacing: 0.12em;
          color: #0a0a0a;
          text-align: center;
          line-height: 2.6;
        }

        /* CTA */
        .creator-cta { text-align: center; }
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
          .tablets-grid { grid-template-columns: 1fr; gap: 14px; }
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
      <TierPhones tier={t.tiers.gear}        clips={GEAR}        prefix="gear"        {...phoneProps} />
      <hr className="creator-hr" />
      <TierPhones tier={t.tiers.experiences} clips={EXPERIENCES} prefix="experiences" {...phoneProps} />
      <hr className="creator-hr" />
      <TierPhones tier={t.tiers.unboxing}    clips={UNBOXING}    prefix="unboxing"    {...phoneProps} />
      <hr className="creator-hr" />
      <TierPhones tier={t.tiers.talk}        clips={TALK}        prefix="talk"        {...phoneProps} />

      <hr className="creator-hr" />

      {/* Bloc horizontal premium (tablettes) */}
      <section className="tier">
        <div className="tier-head">
          <h2 className="tier-title">{t.tiers.cinematic.title}</h2>
          {t.tiers.cinematic.desc && <p className="tier-desc">{t.tiers.cinematic.desc}</p>}
        </div>
        <div className="tablets-grid">
          {CINEMATIC.map((clip, i) => {
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

// Bloc vertical reutilisable (telephones 9:16)
function TierPhones({
  tier,
  clips,
  prefix,
  unmutedKey,
  toggleSound,
  registerRef,
  SoundBtn,
}: {
  tier: { title: string; desc: string };
  clips: Clip[];
  prefix: string;
  unmutedKey: string | null;
  toggleSound: (key: string) => void;
  registerRef: (key: string, el: HTMLVideoElement | null) => void;
  SoundBtn: (props: { on: boolean; onClick: () => void }) => React.JSX.Element;
}) {
  return (
    <section className="tier">
      <div className="tier-head">
        <h2 className="tier-title">{tier.title}</h2>
        {tier.desc && <p className="tier-desc">{tier.desc}</p>}
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
  );
}
