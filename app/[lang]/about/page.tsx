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
    name: "Sandrine Ceuppens",
    role: "Sandrine Ceuppens, *photographe et vidéaste* à Bruxelles.",
    approachTitle: "La *façon de regarder*",
    approach: [
      "Je photographie les villes à cinq heures du matin et les marchés avant la foule. C'est la même façon de regarder que j'emmène dans les maisons et les hôtels : la lumière du lieu, les gestes de ceux qui y travaillent, rien de posé.",
      "Je travaille pendant que la maison vit, en lumière naturelle. Une chambre libre le matin suffit, et le personnel peut rester dans le cadre, c'est souvent ce qui fait l'image. Photo et film sur la même visite, pour que le lieu se lise en entier.",
    ],
    clients: "Ils m'ont fait confiance",
    contact: "Contact",
    // Presentation ecrite a partir du texte Substack de Sandrine (31/08).
    // La phrase de fin, "il y a deux ans je n'imaginais rien de tout ca", reste
    // sur Substack : juste et touchante, mais sur une page qui vend une
    // prestation elle dit qu'on debute.
    bio: "Je photographie les villes à cinq heures du matin et les marchés avant la foule. C'est la même façon de regarder que j'emmène dans les maisons et les hôtels : la lumière du lieu, les gestes de ceux qui y travaillent, rien de posé. Un livre est en cours.",
    followersLabel: "ABONNÉS INSTAGRAM",
    skills: "COMPÉTENCES",
    projectsPdf: "Projets récents (PDF)",
    based: "Bruxelles · disponible pour voyager",
    cta: "On travaille ensemble ?",
    letsTalk: "Écrire un mail",
  },
  en: {
    name: "Sandrine Ceuppens",
    role: "Sandrine Ceuppens, *photographer and filmmaker* in Brussels.",
    approachTitle: "A *way of looking*",
    approach: [
      "I photograph cities at five in the morning and markets before the crowds. It is the same way of looking that I bring into houses and hotels: the light of the place, the gestures of the people who work there, nothing staged.",
      "I work while the house is alive, in natural light. One room free in the morning is enough, and the team can stay in the frame, that is often what makes the picture. Stills and film on the same visit, so the place reads as a whole.",
    ],
    clients: "They trusted me",
    contact: "Contact",
    bio: "I photograph cities at five in the morning and markets before the crowds. It is the same way of looking that I bring into houses and hotels: the light of the place, the gestures of the people who work there, nothing staged. A book is in progress.",
    followersLabel: "INSTAGRAM FOLLOWERS",
    skills: "SKILLS",
    projectsPdf: "Recent projects (PDF)",
    based: "Brussels · available to travel",
    cta: "Want to work together?",
    letsTalk: "Send an email",
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
          <ul className={s.links}>
            <li><Link href={`/${lang}/services`} className={s.brick}>{lang === "fr" ? "Travaillons ensemble →" : "Work with me →"}</Link></li>
            <li><a href="https://thegirlwithacamera.substack.com/" target="_blank" rel="noopener noreferrer" className={s.brick}>{lang === "fr" ? "Le journal →" : "The journal →"}</a></li>
            {SOCIALS.map((so) => (
              <li key={so.label}><a href={so.href} target="_blank" rel="noopener noreferrer">{so.label}</a></li>
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
          name: "Sandrine Ceuppens",
          jobTitle: lang === "fr" ? "Photographe et vidéaste documentaire" : "Documentary photographer and filmmaker",
          url: "https://thegirlwithacamera.com",
          sameAs: SOCIALS.map((so) => so.href),
        },
      })}} />
    </main>
  );
}
