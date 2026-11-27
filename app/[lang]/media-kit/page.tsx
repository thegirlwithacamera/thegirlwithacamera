import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import TrustLogos from "../components/TrustLogos";
import PrintButton from "./PrintButton";
import s from "./media-kit.module.css";

// Media kit : page cachee (absente du menu, du sitemap et de Google), dont on
// donne le lien aux marques. Les chiffres Instagram viennent du releve fait
// deux fois par jour sur le Mac de Sandrine (voie officielle Meta), publie
// en extrait par workers/links (/kit.json). La page se refait toute seule
// au plus une fois par heure. Pas de tarifs : "Rates on request" (choix de
// Sandrine, 27/11/2026). Public montre : ages et genres seulement.

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export const metadata: Metadata = {
  title: "Media kit · Sandrine Ceuppens",
  description: "Sandrine Ceuppens, travel photographer and filmmaker. Audience, reach and work.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const KIT_URL = "https://tgwac-links.thegirlwithacamera.workers.dev/kit.json";

interface Kit {
  releve: string;
  abonnes: number;
  croissance_28j: number | null;
  vues_28j: number | null;
  portee_28j: number | null;
  interactions_28j: number | null;
  enregistrements_28j: number | null;
  partages_28j: number | null;
  visites_profil_28j: number | null;
  vues_moyennes_reel_30j: number | null;
  ages: [string, number][];
  genres: [string, number][];
  meilleurs_reels: { texte: string; vues: number; lien: string; date: string }[];
}

async function getKit(): Promise<Kit | null> {
  try {
    const r = await fetch(KIT_URL, { next: { revalidate: 3600 } });
    if (!r.ok) return null;
    return (await r.json()) as Kit;
  } catch {
    return null;
  }
}

const nf = new Intl.NumberFormat("en-GB");
const n = (v: number | null | undefined) => (v === null || v === undefined ? "–" : nf.format(v));
const compact = (v: number) => new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 1 }).format(v);

const GENRES: Record<string, string> = { F: "Women", M: "Men", U: "Not specified" };

// Photos deja choisies par Sandrine pour son site, montrees entieres (2:3).
const WORK = [
  { src: "/images/portfolio/hospitality/hotel-rathaus-wien/1.jpg", label: "Hotel Rathaus Wein & Design, Vienna", href: "/en/photographer/hospitality/hotel-rathaus-wien" },
  { src: "/images/portfolio/hospitality/nishimuraya/1.jpg", label: "Nishimuraya Hotel Shogetsutei, Japan", href: "/en/photographer/hospitality/nishimuraya" },
  { src: "/images/portfolio/hospitality/naturel-dorf-schonleitn/1.jpg", label: "Naturel Hoteldorf Schönleitn, Austria", href: "/en/photographer/hospitality/naturel-dorf-schonleitn" },
  { src: "/images/portfolio/hospitality/mizuya/1.jpg", label: "Mizuya, Japan", href: "/en/photographer/hospitality/mizuya" },
  { src: "/images/portfolio/travel/graz/1.jpg", label: "Graz, for Graz Tourismus", href: "/en/photographer/travel/graz" },
  { src: "/images/portfolio/travel/tokyo/1.jpg", label: "Tokyo", href: "/en/photographer/travel/tokyo" },
];

const SERVICES = [
  { title: "Hotels & houses", text: "Photographs and a film made on the same visit, in natural light, with nothing staged." },
  { title: "Destinations", text: "Cities and regions at the hour they feel like themselves, for tourism boards and travel brands." },
  { title: "Brands & social", text: "Vertical films and photographs, posted on my channels or delivered to run on yours." },
];

export default async function MediaKitPage() {
  const k = await getKit();
  const maj = k ? new Date(k.releve).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <main className={s.page}>
      <header className={s.head}>
        <p className={s.eyebrow}>Media kit · The Girl With A Camera</p>
        <h1 className={s.name}>Sandrine Ceuppens</h1>
        <p className={s.role}>Travel photographer &amp; filmmaker. Based in Brussels, working worldwide.</p>
      </header>

      <section className={s.intro}>
        <div className={s.portrait}>
          <Image src="/images/about/hero.jpg" alt="Sandrine Ceuppens by Lake Kawaguchi, Mount Fuji behind her" width={1259} height={1800} sizes="(max-width: 767px) 100vw, 340px" priority />
        </div>
        <div className={s.introText}>
          <p>
            I photograph and film hotels, destinations and brands, in natural light, with nothing staged. I arrive before everyone else, often at five in the morning, to catch the moment a room or a street feels like itself.
          </p>
          <p className={s.shown}>
            Exhibited at Les Rencontres d&apos;Arles, the Salon de la Photo at La Villette in Paris, and the GR Community Space in Paris.
          </p>
        </div>
      </section>

      <section className={s.block}>
        <h2 className={s.label}>Instagram · {site.social.instagramHandle}</h2>
        {k ? (
          <>
            <div className={s.big}>
              <b>{n(k.abonnes)}</b>
              <span>followers{k.croissance_28j !== null && k.croissance_28j > 0 ? `, +${n(k.croissance_28j)} in the last 28 days` : ""}</span>
            </div>
            <div className={s.grid}>
              <div><b>{compact(k.vues_28j ?? 0)}</b><span>views, last 28 days</span></div>
              <div><b>{compact(k.portee_28j ?? 0)}</b><span>accounts reached, last 28 days</span></div>
              <div><b>{n(k.vues_moyennes_reel_30j)}</b><span>average views per reel, last 30 days</span></div>
              <div><b>{n(k.interactions_28j)}</b><span>interactions, last 28 days</span></div>
              <div><b>{n(k.enregistrements_28j)}</b><span>saves, last 28 days</span></div>
              <div><b>{n(k.partages_28j)}</b><span>shares, last 28 days</span></div>
            </div>
          </>
        ) : (
          <p className={s.note}>Figures are being refreshed. Write to me and I will send them today.</p>
        )}
      </section>

      {k && (k.ages.length > 0 || k.genres.length > 0) && (
        <section className={`${s.block} ${s.audience}`}>
          <div>
            <h2 className={s.label}>Audience by age</h2>
            {k.ages.filter(([, v]) => v >= 1).map(([a, v]) => (
              <div key={a} className={s.bar}>
                <span className={s.barName}>{a}</span>
                <span className={s.barTrack}><span style={{ width: `${Math.min(100, v * 2)}%` }} /></span>
                <span className={s.barValue}>{Math.round(v)}%</span>
              </div>
            ))}
          </div>
          <div>
            <h2 className={s.label}>Audience by gender</h2>
            {k.genres.map(([g, v]) => (
              <div key={g} className={s.bar}>
                <span className={s.barName}>{GENRES[g] ?? g}</span>
                <span className={s.barTrack}><span style={{ width: `${Math.min(100, v * 2)}%` }} /></span>
                <span className={s.barValue}>{Math.round(v)}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {k && k.meilleurs_reels.length > 0 && (
        <section className={s.block}>
          <h2 className={s.label}>Top reels, last 90 days</h2>
          <ol className={s.reels}>
            {k.meilleurs_reels.map((r) => (
              <li key={r.lien}>
                <a href={r.lien} target="_blank" rel="noopener noreferrer">
                  <span className={s.reelText}>{r.texte.split("\n")[0]}</span>
                  <span className={s.reelViews}>{n(r.vues)} views</span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className={s.block}>
        <h2 className={s.label}>Selected work</h2>
        <div className={s.work}>
          {WORK.map((w) => (
            <Link key={w.src} href={w.href} className={s.workItem}>
              <Image src={w.src} alt={w.label} width={1200} height={1800} sizes="(max-width: 767px) 50vw, 240px" />
              <span>{w.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={s.block}>
        <h2 className={s.label}>They trusted me</h2>
        <TrustLogos lang="en" hideLabel />
      </section>

      <section className={s.block}>
        <h2 className={s.label}>What I do</h2>
        <div className={s.services}>
          {SERVICES.map((x) => (
            <div key={x.title}>
              <h3>{x.title}</h3>
              <p>{x.text}</p>
            </div>
          ))}
        </div>
        <p className={s.rates}>Rates on request.</p>
      </section>

      <section className={`${s.block} ${s.contact}`}>
        <h2 className={s.contactTitle}>Let&apos;s work <em>together</em></h2>
        <p>Write me a few lines about the place, the dates and what you want people to feel. I answer within a few days.</p>
        <p className={s.mail}><a href={`mailto:${site.email}`}>{site.email}</a></p>
        <p className={s.fr} lang="fr">Je parle aussi français.</p>
      </section>

      <footer className={s.foot}>
        {maj && <p>Instagram figures from Meta, updated automatically. Last update: {maj}.</p>}
        <PrintButton />
      </footer>
    </main>
  );
}
