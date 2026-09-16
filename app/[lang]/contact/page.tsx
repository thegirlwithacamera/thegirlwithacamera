import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { Display, PageHead } from "../components/editorial";
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
      <PageHead
        eyebrow="Contact"
        title="Let's make something *together*."
        lede="Hotels, tourism boards and brands: write me a few lines about the place, the dates and what you want people to feel."
        split
      />

      <section className={s.dark} id="form">
        <div className={s.darkInner}>
          <div>
            <Display size="m" as="h2" className={s.darkTitle}>Have a project in mind?</Display>
            <p className={s.note}>I answer within a few days.</p>
            <p className={s.note} lang="fr">Je parle aussi français.</p>
            <ul className={s.mails}>
              <li><span>Projects</span><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><span>Press</span><a href={`mailto:${site.pressEmail}`}>{site.pressEmail}</a></li>
            </ul>
          </div>
          <ContactForm />
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
