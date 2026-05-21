import Image from "next/image";
import Link from "next/link";
import { homeGrid, footer } from "@/lib/content";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";

  return (
    <div className="bg-black min-h-screen" style={{ paddingTop: "72px" }}>

      {/* ── GRILLE 4 COLONNES UNIFORME ── */}
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "calc((100vh - 72px) / 2)",
          gap: "2px",
        }}
      >
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
              sizes="25vw"
              priority={i < 8}
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
      </main>

      {/* ── FOOTER ── */}
      <footer className="flex items-center justify-between flex-wrap gap-4 px-10 py-5 border-t border-white/5 bg-[#050505]">
        <span className="font-serif font-bold text-[11px] tracking-[0.12em] uppercase text-white/35">
          Sandrine Ceuppens
        </span>
        <span className="text-[10px] text-white/20">
          {footer.copyright}
        </span>
        <a
          href="https://www.instagram.com/sandrinecppns/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.12em] uppercase text-white/30 hover:text-white/70 transition-colors no-underline"
        >
          Instagram
        </a>
      </footer>

    </div>
  );
}
