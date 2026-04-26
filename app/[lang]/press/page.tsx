import type { Metadata } from "next";
import { site } from "@/lib/site";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: "Press",
    description: isFr
      ? "Mentions presse, ressources médias et contact pour Sandrine Ceuppens."
      : "Press mentions, media kit and contact for Sandrine Ceuppens.",
    alternates: { canonical: `/${lang}/press`, languages: { fr: "/fr/press", en: "/en/press" } },
  };
}

// Edit this list as press coverage comes in.
const mentions: Array<{ outlet: string; title: string; url?: string; date: string }> = [
  // Example shape — replace with real entries:
  // { outlet: "Magazine X", title: "Interview — Behind Doors", url: "https://...", date: "2026-03" },
];

const bio = {
  fr: {
    short:
      "Sandrine Ceuppens (b. 1996) est une photographe et créatrice de contenu basée à Bruxelles. Son travail, à la croisée du documentaire et de la mode, explore les gestes du quotidien et la lumière dans la rue. Elle collabore avec Ricoh et Pentax Europe.",
    long:
      "Sandrine Ceuppens vit et travaille à Bruxelles. Elle photographie depuis l'enfance et reprend une pratique sérieuse en 2024 après plusieurs années de pause. Son travail mêle street, documentaire et mode, avec un post-traitement minimal — une attention au geste, à la lumière, à ce qui se passe quand personne ne regarde. Elle développe en parallèle une pratique vidéo (scripting, tournage, montage) pour les marques. Collabore avec Ricoh et Pentax Europe.",
  },
  en: {
    short:
      "Sandrine Ceuppens (b. 1996) is a Brussels-based photographer and content creator. Her work, at the intersection of documentary and fashion, explores everyday gestures and street light. She collaborates with Ricoh and Pentax Europe.",
    long:
      "Sandrine Ceuppens lives and works in Brussels. She has been photographing since childhood and returned to a serious practice in 2024 after a long pause. Her work blends street, documentary and fashion, with minimal post-processing — an attention to gesture, light, and what happens when no one is watching. In parallel she develops a video practice (scripting, shooting, editing) for brands. Collaborates with Ricoh and Pentax Europe.",
  },
} as const;

export default async function PressPage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";
  const b = bio[lang];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20 border-b border-[#e5e5e5] pb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#737373] mb-6">Press</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none">
            {isFr ? "Presse & médias" : "Press & media"}
          </h1>
        </div>

        {/* Bio */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">{isFr ? "Bio courte" : "Short bio"}</h2>
            <p className="text-[#525252] leading-relaxed">{b.short}</p>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-serif text-2xl font-bold mb-6">{isFr ? "Bio longue" : "Long bio"}</h2>
            <p className="text-[#525252] leading-relaxed">{b.long}</p>
          </div>
        </section>

        {/* Press mentions */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl font-bold mb-8">{isFr ? "Mentions" : "Mentions"}</h2>
          {mentions.length === 0 ? (
            <p className="text-sm text-[#737373] italic">
              {isFr ? "Premières publications à venir." : "First features coming soon."}
            </p>
          ) : (
            <ul className="divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
              {mentions.map((m, i) => (
                <li key={i} className="py-5 grid grid-cols-1 md:grid-cols-[140px_1fr_120px] gap-4 items-baseline">
                  <span className="text-xs tracking-[0.2em] uppercase text-[#737373]">{m.outlet}</span>
                  <span className="font-serif text-lg">
                    {m.url ? (
                      <a href={m.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{m.title}</a>
                    ) : m.title}
                  </span>
                  <span className="text-xs text-[#a3a3a3] md:text-right">{m.date}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Contact + assets */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-[#e5e5e5] pt-12">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-4">{isFr ? "Contact presse" : "Press contact"}</h2>
            <p className="text-[#525252] leading-relaxed mb-2">
              <a className="underline hover:no-underline" href={`mailto:${site.pressEmail}`}>{site.pressEmail}</a>
            </p>
            <p className="text-sm text-[#737373]">
              {isFr ? "Réponse sous 48h ouvrées." : "Reply within 48 working hours."}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold mb-4">{isFr ? "Ressources" : "Assets"}</h2>
            <p className="text-sm text-[#737373] italic">
              {isFr
                ? "Media kit (logo, portrait HD, biographies) sur demande à l'adresse ci-contre."
                : "Media kit (logo, HD portrait, biographies) available on request from the email opposite."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
