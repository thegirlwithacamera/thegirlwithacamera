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
      ? "Séries photographiques de Sandrine Ceuppens : street, documentaire, mode, voyage. Bruxelles, Sicile, Japon."
      : "Photographic series by Sandrine Ceuppens : street, documentary, fashion, travel. Brussels, Sicily, Japan.",
    alternates: { canonical: `/${lang}/gallery`, languages: { fr: "/fr/gallery", en: "/en/gallery" } },
    openGraph: {
      title: isFr ? "Séries · Sandrine Ceuppens" : "Series · Sandrine Ceuppens",
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
        <div className="mb-20 border-b border-[#ebebeb] pb-8">
          <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "#b0b0b0" }}>
            {isFr ? "Travail photographique" : "Photographic work"}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none">
            {isFr ? "Séries" : "Series"}
          </h1>
          <p className="mt-8 max-w-2xl leading-relaxed" style={{ color: "#6a6a6a" }}>
            {isFr
              ? "Des corpus de travail construits sur la durée. Chaque série est un sujet : un lieu, une obsession, une question. Pas d'illustration, pas de retouche lourde. Ce qui est là, tel que c'était."
              : "Bodies of work built over time. Each series is a subject : a place, an obsession, a question. No illustration, no heavy retouching. What's there, as it was."}
          </p>
        </div>

        {/* Series grid — photos à plat, sans cadre */}
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14">
          {series.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/${lang}/gallery/${s.slug}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                {/* Photo sans cadre */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f0f0f0]">
                  <Image
                    src={s.cover}
                    alt={`${s.title}, ${s.description[lang].slice(0, 80)}…`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Overlay très subtil au hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                </div>

                {/* Légende alignée à gauche, style éditorial */}
                <div className="mt-4">
                  <p style={{ fontSize: "8px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#b0b0b0", fontWeight: 600, marginBottom: "5px" }}>
                    {s.year} · {s.photos.length} {isFr ? "photos" : "photos"}
                  </p>
                  <p className="font-serif font-bold" style={{ fontSize: "16px", color: "#0a0a0a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                    {s.title}
                  </p>
                  <p style={{ fontSize: "11px", color: "#9a9a9a", marginTop: "4px", lineHeight: 1.4 }}>
                    {s.description[lang].slice(0, 60)}…
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
