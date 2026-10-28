import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import Cover from "../components/Cover";
import HashScroll from "../components/HashScroll";
import TrustLogos from "../components/TrustLogos";
import TestimonialCarousel from "../components/TestimonialCarousel";
import { allTestimonials } from "../photographer/constants";
import ContactForm from "./ContactForm";
import s from "./page.module.css";
import "./form.css";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta({
    lang,
    path: "/about",
    type: "profile",
    title: "About & contact",
    description: "Sandrine Ceuppens, travel photographer, filmmaker and content creator based in Brussels. Hotels, destinations and brands. Write to work together.",
    image: PORTRAIT,
    imageAlt: "Sandrine Ceuppens",
  });
}

// ─────────────────────────────────────────────────────────────
// About & contact (28/10, décisions de Sandrine) : la couverture avec ses
// deux portraits, un court texte de présentation, les logos et les mots des
// clients, puis le formulaire. Plus de parcours ni de questions sur cette
// page, et plus d'adresse presse. L'ancienne page Contact renvoie ici (#contact).
// ─────────────────────────────────────────────────────────────

const PORTRAIT = "/images/about/portrait-beach.jpg";

const SOCIALS = [
  "https://www.instagram.com/sandrinecppns/",
  "https://www.youtube.com/@sandrinecppns",
  "https://www.tiktok.com/@sandrineceuppens",
  "https://www.pinterest.com/sandrineceuppens/",
  "https://www.threads.net/@sandrinecppns",
];

export default async function AboutPage({ params }: Props) {
  await params;

  return (
    <main className={s.main}>
      <HashScroll />

      <Cover
        images={[PORTRAIT, "/images/about/hero.jpg"]}
        label="Sandrine Ceuppens"
        title="Sandrine Ceuppens"
        tr={<p>Photographer &amp; filmmaker</p>}
        br={
          <>
            <Link href="/en/journal">Journal</Link>
            <a href="#contact">Contact</a>
          </>
        }
      />

      <section className={s.intro}>
        <p>
          I photograph and film hotels, destinations and brands, in natural light, with nothing staged. I arrive before everyone else, often at five in the morning, to catch the moment a room or a street feels like itself. Stills and film are made on the same visit, so the place reads as a whole: the walls tell one part of the story, the people who work there tell the rest. Based in Brussels, I travel wherever the work takes me.
        </p>
        <p className={s.shown}>
          My work has been exhibited at Les Rencontres d&apos;Arles, at the Salon de la Photo at La Villette in Paris, and at the GR Community Space in Paris.
        </p>
      </section>

      <section className={s.clients}>
        <p className={s.clientsLabel}>They trusted me</p>
        <TrustLogos lang="en" hideLabel marquee />
        <div className={s.quotes}>
          <TestimonialCarousel
            lang="en"
            items={allTestimonials().map((x) => ({ t: x.t, href: x.href, label: x.label.en }))}
          />
        </div>
      </section>

      <section className={s.contact} id="contact">
        <h2 className={s.contactTitle}>Get in <em>touch</em></h2>
        <div className={s.words}>
          <p>Hotels, tourism boards and brands: write me a few lines about the place, the dates and what you want people to feel. I answer within a few days.</p>
          <p lang="fr" className={s.fr}>Je parle aussi français.</p>
          <p className={s.mails}><a href="mailto:hello@thegirlwithacamera.com">hello@thegirlwithacamera.com</a></p>
        </div>
        <ContactForm />
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "About & contact",
        description: "Sandrine Ceuppens, travel photographer, filmmaker and content creator based in Brussels.",
        mainEntity: {
          "@type": "Person",
          name: "Sandrine Ceuppens",
          jobTitle: "Travel photographer, filmmaker & content creator",
          url: "https://www.thegirlwithacamera.com",
          sameAs: SOCIALS,
        },
      }) }} />
    </main>
  );
}
