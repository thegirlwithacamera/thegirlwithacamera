import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { series } from "@/lib/series";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Séries" : "Series",
    description: isFr
      ? "Séries photographiques de Sandrine Ceuppens — street, documentaire, mode, voyage. Bruxelles, Sicile, Japon."
      : "Photographic series by Sandrine Ceuppens — street, documentary, fashion, travel. Brussels, Sicily, Japan.",
    alternates: { canonical: `/${lang}/gallery`, languages: { fr: "/fr/gallery", en: "/en/gallery" } },
    openGraph: {
      title: isFr ? "Séries — Sandrine Ceuppens" : "Series — Sandrine Ceuppens",
      images: series.slice(0, 1).map((s) => s.cover),
    },
  };
}

export default async function GalleryPage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-20 border-b border-[#e5e5e5] pb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-[#737373] mb-6">
            {isFr ? "Travail photographique" : "Photographic work"}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none">
            {isFr ? "Séries" : "Series"}
          </h1>
          <p className="mt-8 max-w-2xl text-[#525252] leading-relaxed">
            {isFr
              ? "Des corpus de travail construits sur la durée. Chaque série est un sujet : un lieu, une obsession, une question. Pas d'illustration, pas de retouche lourde — ce qui est là, tel que c'était."
              : "Bodies of work built over time. Each series is a subject: a place, an obsession, a question. No illustration, no heavy retouching — what's there, as it was."}
          </p>
        </div>

        {/* Series grid */}
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {series.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/${lang}/gallery/${s.slug}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                <div className="border border-[#d4d4d4] p-3 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-shadow duration-400">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                    <Image
                      src={s.cover}
                      alt={`${s.title} — ${s.description[lang].slice(0, 80)}…`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="font-serif text-lg font-bold tracking-wide">{s.title}</p>
                  <p className="mt-1 text-xs tracking-[0.2em] uppercase text-[#737373]">
                    {s.year} · {s.photos.length} {isFr ? "photos" : "photos"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
