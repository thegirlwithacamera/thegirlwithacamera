import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "@/lib/creations";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Création" : "Creation",
    description: isFr
      ? "Vidéo verticale, brand content, formats courts. Le travail vidéo de Sandrine Ceuppens."
      : "Vertical video, brand content, short formats. The video work of Sandrine Ceuppens.",
    alternates: { canonical: `/${lang}/creation`, languages: { fr: "/fr/creation", en: "/en/creation" } },
  };
}

export default async function CreationPage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";

  return (
    <div className="pt-32 pb-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 border-b border-[#e5e5e5] pb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#737373] mb-6">
            {isFr ? "Vidéo et contenu" : "Video and content"}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none mb-8">
            {isFr ? "Création" : "Creation"}
          </h1>
          <p className="max-w-2xl text-[#525252] leading-relaxed">
            {isFr
              ? "Vidéo verticale, scripting, montage. Des formats courts qui montrent le réel : produits, villes, instants. Pour les marques qui veulent du contenu vivant, pas de la pub déguisée."
              : "Vertical video, scripting, editing. Short formats that show what's real : products, cities, moments. For brands that want living content, not disguised ads."}
          </p>
          <div className="mt-8">
            <Link
              href={`/${lang}/services`}
              className="inline-block text-xs tracking-widest uppercase border-b-2 border-black pb-1 hover:opacity-70"
            >
              {isFr ? "Voir les offres brand content" : "See brand content offers"} →
            </Link>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-24">
          {projects.map((p) => (
            <section key={p.slug}>
              <div className="flex items-baseline justify-between mb-3 border-b border-[#e5e5e5] pb-4">
                <h2 className="font-serif text-3xl md:text-4xl font-bold">{p.title}</h2>
                <p className="text-xs text-[#737373] tracking-widest uppercase">
                  {p.subtitle[lang]}
                </p>
              </div>
              <p className="text-[#525252] text-sm md:text-base mb-10 max-w-2xl leading-relaxed">
                {p.description[lang]}
              </p>

              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {p.items.map((item) => (
                  <li key={item.id} className="flex flex-col">
                    {/* Media */}
                    <div className="bg-[#0a0a0a] aspect-[9/16] overflow-hidden flex items-center justify-center relative">
                      {item.videoUrl ? (
                        <video
                          src={item.videoUrl}
                          poster={item.poster}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      ) : item.poster ? (
                        <Image src={item.poster} alt={item.title[lang]} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      ) : (
                        // Clean placeholder while videos are being uploaded.
                        <div className="text-center text-white/60 px-6">
                          <p className="text-[10px] tracking-[0.3em] uppercase mb-3">{isFr ? "Vidéo bientôt en ligne" : "Video coming online soon"}</p>
                          <p className="font-serif text-sm">{item.title[lang]}</p>
                        </div>
                      )}
                    </div>
                    {/* Caption */}
                    <div className="mt-4">
                      <h3 className="font-serif text-lg font-bold">{item.title[lang]}</h3>
                      <p className="text-xs tracking-[0.2em] uppercase text-[#737373] mt-1">
                        {item.client ? `${item.client} · ` : ""}{item.role[lang]} · {item.year}
                      </p>
                      {item.description[lang] && (
                        <p className="text-sm text-[#525252] mt-2 leading-relaxed">{item.description[lang]}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 border-t border-[#e5e5e5] pt-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            {isFr ? "Un format court à produire ?" : "Need short-form video?"}
          </h2>
          <p className="text-[#737373] mb-8 max-w-md mx-auto">
            {isFr ? "Je conçois, je tourne, je monte. Réponse sous 48h." : "I conceive, shoot and edit. Reply within 48 hours."}
          </p>
          <Link
            href={`/${lang}/contact?subject=${encodeURIComponent("Brand content")}`}
            className="inline-block px-10 py-4 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-[#333] transition-colors"
          >
            {isFr ? "Discuter d'un projet" : "Discuss a project"}
          </Link>
        </div>
      </div>
    </div>
  );
}
