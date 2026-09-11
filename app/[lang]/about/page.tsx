import Image from "next/image";
import type { Metadata } from "next";
// Une seule phrase reprise des offres : la meme partout, jamais recopiee.
import Link from "next/link";
import { Display, Eyebrow, Lede, Section } from "../components/editorial";
import s from "./page.module.css";
import TrustLogos from "../components/TrustLogos";
import HashScroll from "../components/HashScroll";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta({
    lang,
    path: "/about",
    type: "profile",
    title: "About",
    description: lang === "fr"
      ? "À propos de Sandrine Ceuppens. Photographe documentaire et créatrice de contenu basée à Bruxelles. Collaborations avec Ricoh Europe, Pentax Europe et Insta360."
      : "About Sandrine Ceuppens. Documentary photographer and content creator based in Brussels. Collaborations with Ricoh Europe, Pentax Europe and Insta360.",
    image: "/images/about/hero.jpg",
    imageAlt: "Sandrine Ceuppens",
  });
}

// Photo du hero (Mont Fuji, IMG_8304).
const HERO_PHOTO = "/images/about/hero.jpg";

// Clients (bande "Ils me font confiance") : donnees dans lib/brands.ts,
// rendu via le composant partage TrustLogos (reutilise aussi sur /creator).

const content = {
  fr: {
    role: "Sandrine Ceuppens, *photographe et vidéaste* à Bruxelles.",
    approachTitle: "La *façon de regarder*",
    approach: [
      "Je travaille en lumière naturelle, pendant que la maison vit. Rien n'est déplacé, rien n'est ajouté : une chambre libre le matin suffit, et le personnel peut rester dans le cadre, c'est souvent ce qui fait l'image.",
      "Photo et film sur la même visite, pour que le lieu se lise en entier. Les murs disent une partie, les gestes disent le reste.",
    ],
    clients: "Ils m'ont fait confiance",
    contact: "Contact",
    // Presentation ecrite a partir du texte Substack de Sandrine (31/08).
    // La phrase de fin, "il y a deux ans je n'imaginais rien de tout ca", reste
    // sur Substack : juste et touchante, mais sur une page qui vend une
    // prestation elle dit qu'on debute.
    bio: "Je photographie les villes à cinq heures du matin et les marchés avant la foule. C'est la même façon de regarder que j'emmène dans les maisons et les hôtels : la lumière du lieu, les gestes de ceux qui y travaillent, rien de posé. Un livre est en cours.",
    based: "Bruxelles · disponible partout dans le monde",
    cta: "On travaille ensemble ?",
  },
  en: {
    role: "Sandrine Ceuppens, *photographer and filmmaker* in Brussels.",
    approachTitle: "A *way of looking*",
    approach: [
      "I work in natural light, while the house is alive. Nothing is moved, nothing is added: one room free in the morning is enough, and your team can stay in the frame, that is often what makes the picture.",
      "Stills and film on the same visit, so the place reads as a whole. The walls say one part of it, the gestures say the rest.",
    ],
    clients: "They trusted me",
    contact: "Contact",
    bio: "I photograph cities at five in the morning and markets before the crowds. It is the same way of looking that I bring into houses and hotels: the light of the place, the gestures of the people who work there, nothing staged. A book is in progress.",
    based: "Brussels · available worldwide",
    cta: "Want to work together?",
  },
};

const SOCIALS = [
  {
    label: "Instagram",
    handle: "@sandrinecppns",
    href: "https://www.instagram.com/sandrinecppns/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    handle: "@sandrineceuppens",
    href: "https://www.youtube.com/@sandrineceuppens",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    handle: "@sandrinecppns",
    href: "https://www.tiktok.com/@sandrinecppns",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.84 1.56V6.81a4.85 4.85 0 01-1.07-.12z"/>
      </svg>
    ),
  },
  {
    label: "Threads",
    handle: "@sandrinecppns",
    href: "https://www.threads.net/@sandrinecppns",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.2 11.2c-.1 0-.2-.1-.3-.1-.2-3.2-1.9-5-4.8-5h-.1c-1.7 0-3.2.8-4 2.1l1.6 1.1c.6-1 1.6-1.2 2.4-1.2h.1c1 0 1.8.3 2.2.9.3.4.6 1 .7 1.7-.8-.1-1.7-.2-2.6-.1-2.6.1-4.3 1.7-4.2 3.8.1 1.1.6 2 1.5 2.6.7.5 1.7.8 2.7.7 1.3-.1 2.3-.6 3-1.5.5-.7.9-1.6 1-2.7.6.4 1 .8 1.3 1.4.4.9.5 2.3-.7 3.5-1 1-2.3 1.5-4.2 1.5-2.1 0-3.7-.7-4.7-2-1-1.3-1.5-3.1-1.5-5.4s.5-4.1 1.5-5.4c1-1.3 2.6-2 4.7-2 2.2 0 3.8.7 4.8 2.1.5.7.9 1.5 1.1 2.5l1.9-.5c-.3-1.3-.8-2.4-1.5-3.3-1.4-1.8-3.4-2.7-6.2-2.7-2.7 0-4.8.9-6.2 2.7C4.7 7.1 4 9.3 4 12s.7 4.9 2.1 6.7c1.4 1.8 3.5 2.7 6.2 2.7 2.4 0 4.1-.6 5.5-2 1.8-1.8 1.8-4.1 1.2-5.5-.5-1.1-1.4-1.9-2.8-2.7zm-4.4 4.9c-1.1.1-2.2-.4-2.3-1.5-.1-.8.5-1.7 2.4-1.8h.5c.7 0 1.3.1 1.9.2-.2 2.7-1.5 3.1-2.5 3.1z"/>
      </svg>
    ),
  },
];

// L'intro des offres reste ici, elle presente le travail en une phrase.
export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <main className={s.main}>
      <HashScroll />

      <section className={s.hero}>
        <div className={s.photo}>
          <Image src={HERO_PHOTO} alt="Sandrine Ceuppens" fill sizes="(max-width: 900px) 420px, 560px" priority quality={82} />
        </div>
        <div>
          <Eyebrow tone="brick" className={s.eyebrow}>{lang === "fr" ? "À propos" : "About"}</Eyebrow>
          <Display size="l" as="h1">{t.role}</Display>
          <Lede className={s.bio} align="left">{t.bio}</Lede>
          {/* Deux rangees. En haut les deux portes, en mots. En dessous les
              reseaux, en logos : cinq noms ecrits en capitales espacees
              pesaient autant que les deux liens qui comptent et les noyaient.
              Le nom reste dans aria-label et title pour la lecture d'ecran
              et le survol. */}
          <ul className={s.links}>
            <li><Link href={`/${lang}/services`} className={s.brick}>{lang === "fr" ? "Travaillons ensemble →" : "Work with me →"}</Link></li>
            <li><a href="https://thegirlwithacamera.substack.com/" target="_blank" rel="noopener noreferrer" className={s.brick}>{lang === "fr" ? "Le journal →" : "The journal →"}</a></li>
          </ul>
          <ul className={s.socials}>
            {SOCIALS.map((so) => (
              <li key={so.label}>
                <a href={so.href} target="_blank" rel="noopener noreferrer" aria-label={so.label} title={so.label}>
                  {so.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section>
        <div className={s.approach}>
          <Display size="m" as="h2">{t.approachTitle}</Display>
          <div>{t.approach.map((p) => <p key={p}>{p}</p>)}</div>
        </div>
      </Section>

      <Section>
        <div className={s.clients}>
          <Eyebrow tone="brick" className={s.eyebrow}>{t.clients}</Eyebrow>
          <TrustLogos lang={lang} hideLabel />
        </div>
      </Section>

      <Section>
        <div className={s.clients}>
          <Eyebrow tone="brick" className={s.eyebrow}>{t.contact}</Eyebrow>
          <Eyebrow>{t.based}</Eyebrow>
          <ul className={s.mails}>
            <li><a href="mailto:hello@thegirlwithacamera.com" className={s.mail}><span>{lang === "fr" ? "Projets" : "Projects"}</span>hello@thegirlwithacamera.com</a></li>
            <li><a href="mailto:press@thegirlwithacamera.com" className={s.mail}><span>{lang === "fr" ? "Presse" : "Press"}</span>press@thegirlwithacamera.com</a></li>
          </ul>
        </div>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: lang === "fr" ? "À propos" : "About",
        description: lang === "fr"
          ? "Sandrine Ceuppens, photographe et vidéaste documentaire basée à Bruxelles."
          : "Sandrine Ceuppens, documentary photographer and filmmaker based in Brussels.",
        mainEntity: {
          "@type": "Person",
          jobTitle: lang === "fr" ? "Photographe et vidéaste documentaire" : "Documentary photographer and filmmaker",
          url: "https://thegirlwithacamera.com",
          sameAs: SOCIALS.map((so) => so.href),
        },
      })}} />
    </main>
  );
}
