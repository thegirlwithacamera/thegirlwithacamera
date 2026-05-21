import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { homeGrid } from "@/lib/content";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export const metadata: Metadata = {
  title: "Sandrine Ceuppens · Photographe & Créatrice de contenu, Bruxelles",
};

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";

  return (
    <div className="bg-black" style={{ paddingTop: "72px" }}>

      {/* ── GRILLE RESPONSIVE ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridAutoRows: "50vw",
          gap: "2px",
        }}
        className="md-grid"
      >
        <style>{`
          @media (min-width: 768px) {
            .md-grid {
              grid-template-columns: repeat(4, 1fr) !important;
              grid-auto-rows: calc((100vh - 72px) / 2) !important;
            }
          }
        `}</style>
        {homeGrid.map((item, i) => (
          <Link
            key={i}
            href={`/${lang}${item.href}`}
            className="group relative overflow-hidden block bg-[#111]"
          >
            <Image
              src={item.src}
              alt={item.title || "Sandrine Ceuppens"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 767px) 50vw, 25vw"
              priority={i < 4}
            />

            {/* Overlay hover */}
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-300 z-10" />

            {/* Légende au hover */}
            {item.title && (
              <div
                className="absolute bottom-0 left-0 right-0 z-20 p-4 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}
              >
                <p className="text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: "#c8a882" }}>
                  {isFr ? item.cat.fr : item.cat.en}
                </p>
                <p className="font-serif font-bold text-white text-sm">
                  {item.title}
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>

    </div>
  );
}
