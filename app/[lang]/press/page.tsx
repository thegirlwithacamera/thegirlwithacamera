import Image from "next/image";
import Link from "next/link";
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
      ? "Mentions presse, bio, ressources médias et contact pour Sandrine Ceuppens, photographe à Bruxelles."
      : "Press features, bio, media assets and contact for Sandrine Ceuppens, photographer in Brussels.",
    alternates: { canonical: `/${lang}/press`, languages: { fr: "/fr/press", en: "/en/press" } },
  };
}

// Edit this list as press coverage comes in.
const mentions: Array<{
  outlet: string;
  title: { fr: string; en: string };
  url?: string;
  date: string; // YYYY-MM
  upcoming?: boolean;
}> = [
  {
    outlet: "Figgi Magazine",
    title: {
      fr: "Publication à venir",
      en: "Upcoming feature",
    },
    date: "2026-05",
    upcoming: true,
  },
];

const bio = {
  fr: {
    short:
      "Photographe et créatrice de contenu basée à Bruxelles. J'ai eu un appareil photo entre les mains depuis l'enfance, je l'ai posé, je l'ai repris en 2024. Mon travail se situe à la croisée du documentaire et de la mode, avec un post-traitement minimal. Je collabore avec Ricoh et Pentax Europe.",
    long:
      "Je m'appelle Sandrine Ceuppens. Je vis et travaille à Bruxelles. J'ai eu un appareil photo entre les mains depuis l'enfance, puis la vie a pris le dessus et je l'ai posé. En 2024 je l'ai repris. Ce qui est revenu n'était pas juste une passion, c'était une façon de voir.\n\nJe photographie les rues, la lumière, les moments silencieux. Ceux qu'on ne remarque pas. Mon travail se situe à la croisée du documentaire et de la mode, avec un post-traitement minimal — je touche à peine l'image. Ce qui est là, tel que c'était.\n\nAu-delà de la photo, je crée du contenu vidéo : scripting, tournage, montage. Je collabore avec Ricoh et Pentax Europe, et je construis un corpus de séries personnelles que j'aimerais voir publié.",
  },
  en: {
    short:
      "Photographer and content creator based in Brussels. I had a camera in my hands as a child, put it down, picked it up again in 2024. My work sits at the intersection of documentary and fashion, with minimal post-processing. I collaborate with Ricoh and Pentax Europe.",
    long:
      "My name is Sandrine Ceuppens. I live and work in Brussels. I had a camera in my hands as a child, then life took over and I put it down. In 2024 I picked it up again. What came back wasn't just a hobby, it was a way of seeing.\n\nI photograph streets, light, quiet moments. The kind that go unnoticed. My work sits at the intersection of documentary and fashion, with minimal post-processing — I barely touch the image. Just what's there, as it was.\n\nBeyond stills, I create video content : scripting, filming, editing. I collaborate with Ricoh and Pentax Europe, and I'm building a body of personal series I'd love to see in print.",
  },
} as const;

export default async function PressPage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";
  const b = bio[lang];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16 border-b border-[#e5e5e5] pb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#737373] mb-6">Press</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none">
            {isFr ? "Presse et médias" : "Press and media"}
          </h1>
          <p className="mt-8 max-w-2xl text-[#525252] leading-relaxed">
            {isFr
              ? "Pour les journalistes, rédactions, festivals et galeries. Tout ce qu'il faut pour parler de mon travail."
              : "For journalists, editors, festivals and galleries. Everything you need to write about my work."}
          </p>
        </div>

        {/* Mentions */}
        <section className="mb-20">
          <p className="text-xs tracking-[0.25em] uppercase text-[#737373] mb-3">
            {isFr ? "Publications" : "Features"}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10">
            {isFr ? "Où on m'a vue" : "Where I've been featured"}
          </h2>

          <ul className="divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
            {mentions.map((m, i) => (
              <li key={i} className="py-6 grid grid-cols-1 md:grid-cols-[180px_1fr_140px] gap-4 items-baseline">
                <span className="font-serif text-lg">{m.outlet}</span>
                <span className="text-[#525252]">
                  {m.url ? (
                    <a href={m.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{m.title[lang]}</a>
                  ) : m.title[lang]}
                  {m.upcoming && (
                    <span className="ml-3 inline-block text-[10px] tracking-[0.2em] uppercase border border-[#525252] text-[#525252] px-2 py-0.5">
                      {isFr ? "À venir" : "Upcoming"}
                    </span>
                  )}
                </span>
                <span className="text-xs tracking-[0.2em] uppercase text-[#737373] md:text-right">
                  {formatYearMonth(m.date, lang)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Bio */}
        <section className="mb-20 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12 items-start">
          <div className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden">
            <Image
              src="/images/about.jpg"
              alt={isFr ? "Portrait de Sandrine Ceuppens" : "Portrait of Sandrine Ceuppens"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 260px"
            />
          </div>
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#737373] mb-3">Bio</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8">
              {isFr ? "Sandrine Ceuppens" : "Sandrine Ceuppens"}
            </h2>

            <h3 className="text-xs tracking-[0.2em] uppercase text-[#737373] mb-3">
              {isFr ? "Bio courte" : "Short bio"}
            </h3>
            <p className="text-[#1a1a1a] leading-relaxed mb-10">{b.short}</p>

            <h3 className="text-xs tracking-[0.2em] uppercase text-[#737373] mb-3">
              {isFr ? "Bio longue" : "Long bio"}
            </h3>
            <div className="text-[#1a1a1a] leading-relaxed space-y-4 whitespace-pre-line">
              {b.long}
            </div>
          </div>
        </section>

        {/* Press kit */}
        <section className="mb-20 border-t border-[#e5e5e5] pt-12">
          <p className="text-xs tracking-[0.25em] uppercase text-[#737373] mb-3">
            {isFr ? "Ressources" : "Assets"}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10">
            {isFr ? "Press kit" : "Press kit"}
          </h2>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li>
              <a
                href="/press/sandrine-ceuppens-bio-fr.txt"
                download
                className="flex items-baseline justify-between border border-[#e5e5e5] hover:border-black transition-colors p-5"
              >
                <span>
                  <span className="block font-serif text-lg">{isFr ? "Bio (FR)" : "Bio (FR)"}</span>
                  <span className="block text-xs tracking-[0.2em] uppercase text-[#737373] mt-1">.txt</span>
                </span>
                <span className="text-xs tracking-[0.2em] uppercase text-[#737373]">
                  {isFr ? "Télécharger" : "Download"} ↓
                </span>
              </a>
            </li>
            <li>
              <a
                href="/press/sandrine-ceuppens-bio-en.txt"
                download
                className="flex items-baseline justify-between border border-[#e5e5e5] hover:border-black transition-colors p-5"
              >
                <span>
                  <span className="block font-serif text-lg">{isFr ? "Bio (EN)" : "Bio (EN)"}</span>
                  <span className="block text-xs tracking-[0.2em] uppercase text-[#737373] mt-1">.txt</span>
                </span>
                <span className="text-xs tracking-[0.2em] uppercase text-[#737373]">
                  {isFr ? "Télécharger" : "Download"} ↓
                </span>
              </a>
            </li>
            <li>
              <a
                href="/press/sandrine-ceuppens-portrait.jpg"
                download
                className="flex items-baseline justify-between border border-[#e5e5e5] hover:border-black transition-colors p-5"
              >
                <span>
                  <span className="block font-serif text-lg">{isFr ? "Portrait HD" : "HD portrait"}</span>
                  <span className="block text-xs tracking-[0.2em] uppercase text-[#737373] mt-1">.jpg</span>
                </span>
                <span className="text-xs tracking-[0.2em] uppercase text-[#737373]">
                  {isFr ? "Télécharger" : "Download"} ↓
                </span>
              </a>
            </li>
            <li>
              <a
                href="/press/the-girl-with-a-camera-logo.svg"
                download
                className="flex items-baseline justify-between border border-[#e5e5e5] hover:border-black transition-colors p-5"
              >
                <span>
                  <span className="block font-serif text-lg">Logo / wordmark</span>
                  <span className="block text-xs tracking-[0.2em] uppercase text-[#737373] mt-1">.svg</span>
                </span>
                <span className="text-xs tracking-[0.2em] uppercase text-[#737373]">
                  {isFr ? "Télécharger" : "Download"} ↓
                </span>
              </a>
            </li>
          </ul>

          <p className="mt-6 text-sm text-[#737373]">
            {isFr ? "Pour des images de mes séries en haute résolution, " : "For high-resolution images from my series, "}
            <a href={`mailto:${site.pressEmail}?subject=${encodeURIComponent("Press · image request")}`} className="underline hover:no-underline">
              {isFr ? "écrivez-moi" : "drop me a line"}
            </a>.
          </p>
        </section>

        {/* Contact */}
        <section className="border-t border-[#e5e5e5] pt-12">
          <p className="text-xs tracking-[0.25em] uppercase text-[#737373] mb-3">Contact</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            {isFr ? "Me joindre" : "Get in touch"}
          </h2>
          <p className="text-[#525252] leading-relaxed mb-2">
            <a className="underline hover:no-underline" href={`mailto:${site.pressEmail}`}>{site.pressEmail}</a>
          </p>
          <p className="text-sm text-[#737373]">
            {isFr ? "Réponse sous 48h ouvrées." : "Reply within 48 working hours."}
          </p>
          <div className="mt-6">
            <Link
              href={`/${lang}/gallery`}
              className="inline-block text-xs tracking-widest uppercase border-b-2 border-black pb-1 hover:opacity-70 mr-6"
            >
              {isFr ? "Voir le travail" : "See the work"} →
            </Link>
            <Link
              href={`/${lang}/about`}
              className="inline-block text-xs tracking-widest uppercase border-b border-[#a3a3a3] pb-1 hover:border-black hover:text-black text-[#525252]"
            >
              {isFr ? "En savoir plus" : "About"} →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function formatYearMonth(ym: string, lang: "fr" | "en"): string {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return ym;
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { month: "long", year: "numeric" });
}
