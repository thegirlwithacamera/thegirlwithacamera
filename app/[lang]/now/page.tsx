import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Now",
    description: lang === "fr"
      ? "Ce sur quoi je travaille en ce moment : projets en cours, lectures, voyages."
      : "What I'm working on right now : current projects, readings, travels.",
    alternates: { canonical: `/${lang}/now`, languages: { fr: "/fr/now", en: "/en/now" } },
  };
}

// Update this date and content whenever you update the page.
const lastUpdated = "2026-04";

const content = {
  fr: {
    intro: "Une page inspirée de la /now page de Derek Sivers. Ce sur quoi je travaille en ce moment : pour vous, pour moi.",
    sections: [
      {
        title: "En cours",
        items: [
          "Édition de la série Mercato (Sicile, été 2025)",
          "Tournage en cours d'un format vidéo mensuel pour Ricoh Europe",
          "Préparation d'une nouvelle série sur Bruxelles, sortie prévue automne 2026",
        ],
      },
      {
        title: "Je lis",
        items: [
          "On Photography, Susan Sontag (relecture)",
          "The Americans, Robert Frank",
        ],
      },
      {
        title: "Disponibilité",
        items: [
          "Projets brand content de mai à août 2026",
          "Une fenêtre éditoriale en septembre 2026",
        ],
      },
    ],
  },
  en: {
    intro: "A page inspired by Derek Sivers's /now. What I'm working on right now : for you, for me.",
    sections: [
      {
        title: "Working on",
        items: [
          "Editing the Mercato series (Sicily, summer 2025)",
          "Producing a monthly video format with Ricoh Europe",
          "Preparing a new series on Brussels, due autumn 2026",
        ],
      },
      {
        title: "Reading",
        items: [
          "On Photography, Susan Sontag (re-read)",
          "The Americans, Robert Frank",
        ],
      },
      {
        title: "Availability",
        items: [
          "Brand content projects May–August 2026",
          "One editorial window in September 2026",
        ],
      },
    ],
  },
} as const;

export default async function NowPage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";
  const c = content[lang];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-[#737373] mb-6">Now</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none mb-6">
            {isFr ? "Maintenant" : "Right now"}
          </h1>
          <p className="text-sm text-[#737373]">
            {isFr ? "Mise à jour : " : "Last updated: "}{lastUpdated}
          </p>
        </div>

        <p className="text-lg text-[#525252] leading-relaxed mb-16">{c.intro}</p>

        <div className="space-y-12">
          {c.sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-serif text-2xl font-bold mb-5 border-b border-[#e5e5e5] pb-3">{s.title}</h2>
              <ul className="space-y-3">
                {s.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[#525252]">
                    <span className="text-[#a3a3a3] mt-1">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
