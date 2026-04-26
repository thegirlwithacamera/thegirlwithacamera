import type { Metadata } from "next";
import { site } from "@/lib/site";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Mentions légales" : "Legal notice",
    alternates: { canonical: `/${lang}/legal/mentions`, languages: { fr: "/fr/legal/mentions", en: "/en/legal/mentions" } },
    robots: { index: true, follow: false },
  };
}

export default async function MentionsPage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";

  return (
    <article className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-[#737373] mb-6">Legal</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-10">
          {isFr ? "Mentions légales" : "Legal notice"}
        </h1>

        <div className="space-y-6 text-[#525252] leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">{isFr ? "Éditeur" : "Publisher"}</h2>
            <p>Sandrine Ceuppens<br />Bruxelles, Belgique<br /><a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
            <p className="text-sm text-[#737373] mt-3 italic">
              {isFr
                ? "Numéro d'entreprise (BCE) à compléter."
                : "Company number (BCE) to be added."}
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">{isFr ? "Hébergeur" : "Host"}</h2>
            <p>Vercel Inc.<br />340 S Lemon Ave #4133, Walnut, CA 91789, USA<br /><a className="underline" href="https://vercel.com" target="_blank" rel="noreferrer">vercel.com</a></p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">{isFr ? "Propriété intellectuelle" : "Intellectual property"}</h2>
            <p>
              {isFr
                ? "L'ensemble des photographies, vidéos et textes présents sur ce site est la propriété exclusive de Sandrine Ceuppens. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable."
                : "All photographs, videos and texts on this site are the exclusive property of Sandrine Ceuppens. Any reproduction, even partial, is forbidden without prior written authorisation."}
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
