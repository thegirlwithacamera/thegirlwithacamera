import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import FaqAccordion from "./FaqAccordion";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Services" : "Services",
    description: isFr
      ? "Brand content vidéo et photo, tirages limités. Travailler avec Sandrine Ceuppens, photographe et créatrice de contenu à Bruxelles."
      : "Video and photo brand content, limited prints. Working with Sandrine Ceuppens, Brussels-based photographer and content creator.",
    alternates: { canonical: `/${lang}/services`, languages: { fr: "/fr/services", en: "/en/services" } },
  };
}

const offers = {
  fr: [
    {
      tag: "01",
      title: "Brand content",
      sub: "Vidéo et photo pour réseaux sociaux et campagnes digitales.",
      for: "Marques lifestyle, mode, voyage, design. Marques avec un lien fort à la photographie ou au matériel image.",
      includes: [
        "Concept et moodboard",
        "Tournage 1 ou 2 jours selon scope",
        "Montage Reels / TikTok au format vertical",
        "Photos retouchées en complément",
        "Cession de droits adaptée à l'usage",
      ],
      from: "De 600 € à 5 000 € et +",
      formats: "1 vidéo seule · Pack mensuel · One shot · Campagne complète",
    },
    {
      tag: "02",
      title: "Tirages",
      sub: "Tirages limités, signés, numérotés.",
      for: "Collectionneurs, amateurs d'images, intérieurs qui aiment vivre avec une photo qui dure.",
      includes: [
        "Papier mat fine art, encres pigmentaires",
        "Édition limitée à 10 exemplaires par image",
        "Numérotés et signés à la main",
        "Plusieurs formats disponibles",
        "Expédition soignée",
      ],
      from: "À partir de 180 €",
      formats: "Format A4 · A3 · A2 · sur demande pour les grands formats",
    },
  ],
  en: [
    {
      tag: "01",
      title: "Brand content",
      sub: "Video and stills for social and digital campaigns.",
      for: "Lifestyle, fashion, travel and design brands. Brands with a strong tie to photography or image-making gear.",
      includes: [
        "Concept and moodboard",
        "1 or 2 shoot days depending on scope",
        "Vertical Reels / TikTok edit",
        "Companion retouched stills",
        "Usage rights tailored to your needs",
      ],
      from: "From €600 to €5,000+",
      formats: "Single video · Monthly pack · One-shot · Full campaign",
    },
    {
      tag: "02",
      title: "Prints",
      sub: "Limited, signed and numbered prints.",
      for: "Collectors, image lovers, interiors that want to live with a photograph that lasts.",
      includes: [
        "Fine-art matte paper, pigment inks",
        "Edition limited to 10 per image",
        "Hand-numbered and signed",
        "Several sizes available",
        "Careful packaging and shipping",
      ],
      from: "From €180",
      formats: "A4 · A3 · A2 · large formats on request",
    },
  ],
} as const;

const process = {
  fr: [
    { step: "01", title: "Brief", desc: "Vous racontez le projet, l'usage, les contraintes. Réponse sous 48h ouvrées." },
    { step: "02", title: "Devis et moodboard", desc: "Une proposition chiffrée et un parti pris visuel sous une semaine." },
    { step: "03", title: "Tournage", desc: "Production sur 1 à 2 jours selon scope. Léger, mobile, autonome." },
    { step: "04", title: "Livraison", desc: "Sélection présentée sous 10 jours ouvrés. Deux rounds de retouches inclus." },
  ],
  en: [
    { step: "01", title: "Brief", desc: "You share the project, the use, the constraints. Reply within 48 working hours." },
    { step: "02", title: "Quote and moodboard", desc: "A quoted proposal and visual direction within a week." },
    { step: "03", title: "Shoot", desc: "1 to 2 day production depending on scope. Light, mobile, self-sufficient." },
    { step: "04", title: "Delivery", desc: "Selection presented within 10 working days. Two rounds of revisions included." },
  ],
} as const;

const faq = {
  fr: [
    { q: "Vous voyagez ?", a: "Oui, basée à Bruxelles, je voyage régulièrement en Europe et plus loin selon le projet. Frais de déplacement chiffrés à part." },
    { q: "Quels droits sont cédés ?", a: "La cession de droits est adaptée à chaque projet (durée, territoire, supports). C'est précisé dans chaque devis." },
    { q: "Travaillez-vous avec des petites marques ?", a: "Oui, à condition que le projet ait du sens éditorialement. J'ai des formats adaptés aux budgets émergents." },
    { q: "Combien de temps avant le tournage ?", a: "Idéalement 3 à 4 semaines. Pour un urgent, écrivez-moi, on s'arrange." },
  ],
  en: [
    { q: "Do you travel?", a: "Yes. Brussels-based, I travel regularly across Europe and further depending on the project. Travel costs are quoted separately." },
    { q: "What usage rights are included?", a: "Rights are tailored per project (duration, territory, channels) and detailed in every quote." },
    { q: "Do you work with smaller brands?", a: "Yes, as long as the project makes editorial sense. I have formats designed for emerging budgets." },
    { q: "How far in advance to book?", a: "Ideally 3 to 4 weeks. For urgent work, drop me a line and we'll figure it out." },
  ],
} as const;

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";
  const t = offers[lang];
  const p = process[lang];
  const f = faq[lang];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20 border-b border-[#ebebeb] pb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#9a9a9a] mb-6">
            {isFr ? "Services" : "Services"}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none mb-8">
            {isFr ? "Travailler ensemble" : "Working together"}
          </h1>
          <p className="max-w-2xl text-lg text-[#6a6a6a] leading-relaxed">
            {isFr
              ? "Deux façons de collaborer : créer du contenu pour votre marque, ou repartir avec un tirage. Toujours la même approche : peu d'artifice, beaucoup d'attention au réel."
              : "Two ways to collaborate : create content for your brand, or take home a print. Same approach throughout : little artifice, much attention to the real."}
          </p>
        </div>

        {/* Offers */}
        <div className="space-y-px bg-[#e5e5e5] border border-[#ebebeb] mb-24">
          {t.map((o) => (
            <article key={o.tag} className="bg-white p-8 md:p-12 grid grid-cols-1 md:grid-cols-[80px_1fr_auto] gap-8 items-start">
              <p className="font-serif text-3xl text-[#a3a3a3]">{o.tag}</p>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">{o.title}</h2>
                <p className="text-[#6a6a6a] mb-6 max-w-2xl">{o.sub}</p>
                <p className="text-xs tracking-[0.2em] uppercase text-[#9a9a9a] mb-2">
                  {isFr ? "Pour qui" : "For whom"}
                </p>
                <p className="text-sm text-[#6a6a6a] mb-6 max-w-2xl">{o.for}</p>
                <p className="text-xs tracking-[0.2em] uppercase text-[#9a9a9a] mb-3">
                  {isFr ? "Inclus" : "Includes"}
                </p>
                <ul className="space-y-2 text-sm text-[#6a6a6a] max-w-2xl">
                  {o.includes.map((i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-[#a3a3a3] mt-1">·</span>
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs tracking-[0.2em] uppercase text-[#9a9a9a] mt-6 mb-2">
                  {isFr ? "Formats" : "Formats"}
                </p>
                <p className="text-sm text-[#6a6a6a]">{o.formats}</p>
              </div>
              <div className="text-right md:text-left md:min-w-[180px]">
                <p className="text-xs tracking-[0.2em] uppercase text-[#9a9a9a] mb-2">
                  {isFr ? "Tarif" : "Rate"}
                </p>
                <p className="font-serif text-2xl font-bold mb-6">{o.from}</p>
                <Link
                  href={`/${lang}/contact?subject=${encodeURIComponent(o.title)}`}
                  className="inline-block px-6 py-3 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-[#333] transition-colors"
                >
                  {isFr ? "Discuter" : "Get in touch"}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Process (only for brand content) */}
        <section className="mb-24">
          <p className="text-xs tracking-[0.25em] uppercase text-[#9a9a9a] mb-3">{isFr ? "Méthode" : "Process"}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-12">
            {isFr ? "Comment ça se passe" : "How it goes"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {p.map((s) => (
              <div key={s.step} className="border-t-2 border-black pt-6">
                <p className="font-serif text-2xl text-[#a3a3a3] mb-3">{s.step}</p>
                <h3 className="font-serif text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-sm text-[#6a6a6a] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-24">
          <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "#b0b0b0" }}>FAQ</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-12">
            {isFr ? "Questions fréquentes" : "Frequently asked"}
          </h2>
          <FaqAccordion items={f} />
        </section>

        {/* Final CTA — style éditorial, pas noir massif */}
        <div style={{ borderTop: "1px solid #ebebeb", paddingTop: "64px", textAlign: "center" }}>
          <p style={{ fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#b0b0b0", marginBottom: "20px", fontWeight: 600 }}>
            {isFr ? "Démarrer" : "Get started"}
          </p>
          <h2 className="font-serif" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#0a0a0a", marginBottom: "16px", letterSpacing: "-0.02em" }}>
            {isFr ? "Un projet en tête ?" : "Have a project in mind?"}
          </h2>
          <p style={{ color: "#9a9a9a", marginBottom: "36px", maxWidth: "360px", margin: "0 auto 36px", fontSize: "14px", lineHeight: 1.6 }}>
            {isFr ? "Réponse sous 48h ouvrées." : "Reply within 48 working hours."}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", alignItems: "center" }}>
            <Link
              href={`/${lang}/contact`}
              style={{
                display: "inline-block",
                padding: "13px 32px",
                background: "#0a0a0a",
                color: "#fff",
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              {isFr ? "Démarrer une conversation" : "Start a conversation"}
            </Link>
            <a
              href={`mailto:${site.email}`}
              style={{ fontSize: "12px", color: "#9a9a9a", textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
