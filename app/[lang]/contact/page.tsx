import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import Image from "next/image";
import { Display } from "../components/editorial";
import ContactForm from "./ContactForm";
import s from "./page.module.css";
import "./form.css";

interface Props {
  params: Promise<{ lang: "en" }>;
}

export function generateStaticParams() {
  return (["en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    lang: "en",
    path: "/contact",
    title: "Contact",
    description:
      "Work with Sandrine Ceuppens, travel photographer and content creator. Hotels, destinations and brands. Based in Brussels, travelling worldwide.",
  });
}

// ─────────────────────────────────────────────────────────────
// Contact, créée le 16/09. Elle remplace la page Services.
//
// Décision de Sandrine : pas de liste de formules sur le site, ça ne sert à
// rien de détailler tout ce qui est possible. Le client voit le travail,
// écrit, et le reste se règle dans le devis. Même logique que
// adriana-maria.com : un formulaire, puis une courte FAQ.
//
// Toujours aucun prix. Les formules, la remise par combinaison et les
// droits vivent dans la grille et les devis, pas ici.
// ─────────────────────────────────────────────────────────────

// Photos de la page, choisies par Sandrine le 16/09 : la mer en bande, et
// l'enfilade du salon rouge d'Altstadt Vienna par dessus. Changer les chemins
// suffit.
const BAND = "/images/about/path/2024-sea.jpg";
const TALL = "/images/portfolio/hospitality/altstadt-vienna/02-red-salon/1.jpg";

const FAQ = [
  {
    q: "What do you do?",
    a: "I photograph and film hotels, destinations and brands, for their channels and for mine. Photos of the place, short films, and content for social media, with or without me on screen. Tell me what you have in mind, and I come back with a proposal and a quote.",
  },
  {
    q: "Do you travel?",
    a: "Yes, anywhere. I am based in Brussels, and travel within two hours by train is included. Further away, it is added to the quote, and I am happy to combine several places on one trip.",
  },
  {
    q: "Je peux vous écrire en français ?",
    a: "Oui, bien sûr. Le site est en anglais, mais vous pouvez m'écrire en français.",
  },
];

export default async function ContactPage({ params }: Props) {
  await params;

  return (
    <main className={s.main}>
      {/* Mise en page reprise de la page Contact d'adriana-maria.com (16/09) :
          une bande photo horizontale en haut, une grande photo verticale à
          gauche qui la chevauche, le titre posé sur la bande à droite, puis
          le texte et le formulaire sur une colonne. */}
      <section className={s.stage} id="form">
        <div className={s.band}>
          <Image src={BAND} alt="" fill priority sizes="100vw" quality={75} />
          <span className={s.bandVeil} aria-hidden="true" />
        </div>
        <div className={s.stageInner}>
          <div className={s.tall}>
            <Image src={TALL} alt="A doorway into the red salon at Altstadt Vienna" width={1200} height={1800} sizes="(max-width: 900px) 0px, 560px" quality={78} />
          </div>
          <div className={s.side}>
            <h1 className={s.title}>Get in touch</h1>
            <div className={s.words}>
              <p>Hotels, tourism boards and brands: write me a few lines about the place, the dates and what you want people to feel. I answer within a few days.</p>
              <p lang="fr" className={s.fr}>Je parle aussi français.</p>
              <p className={s.mails}>
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <br />
                Brussels, travelling worldwide
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className={s.block} id="faq">
        <Display size="m" as="h2" className={s.blockHead}>Questions</Display>
        <div className={s.faq}>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${site.url}/en/contact#faq`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }) }} />
    </main>
  );
}
