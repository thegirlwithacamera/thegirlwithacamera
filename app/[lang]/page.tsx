import Image from "next/image";
import Link from "next/link";
import { hero, homeGrid, footer } from "@/lib/content";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";

  return (
    <div className="bg-black min-h-screen">

      {/* ── GRILLE FULL IMAGES ── */}
      <main
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "50vh",
          // On force les cellules à ne jamais dépasser leur zone
          gridAutoFlow: "dense",
        }}
      >
        {homeGrid.map((item, i) => (
          <Link
            key={i}
            href={`/${lang}${item.href}`}
            className="group relative overflow-hidden block bg-[#111]"
            style={{
              gridColumn: item.wide ? "span 2" : "span 1",
              gridRow:    item.tall ? "span 2" : "span 1",
            }}
          >
            {/* Photo */}
            <Image
              src={item.src}
              alt={item.title || "Sandrine Ceuppens"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes={item.wide ? "50vw" : "25vw"}
              priority={i < 4}
            />

            {/* Assombrissement au hover */}
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 z-10" />

            {/* Accroche sur la 1ère cellule uniquement */}
            {i === 0 && (
              <div
                className="absolute inset-0 z-20 flex flex-col justify-end p-10 md:p-14 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 52%)" }}
              >
                <h1
                  className="font-serif font-black leading-[1.02] text-white mb-2"
                  style={{ fontSize: "clamp(28px, 3.4vw, 54px)" }}
                >
                  {isFr ? hero.titleLine1.fr : hero.titleLine1.en}
                  <br />
                  <em className="font-normal italic">
                    {isFr ? hero.titleLine2.fr : hero.titleLine2.en}
                  </em>
                </h1>
                <p
                  className="text-[11px] tracking-[0.18em] uppercase"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {isFr ? hero.tagline.fr : hero.tagline.en}
                </p>
              </div>
            )}

            {/* Légende au hover */}
            {item.title && (
              <div
                className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-8
                           opacity-0 translate-y-2
                           group-hover:opacity-100 group-hover:translate-y-0
                           transition-all duration-300 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)" }}
              >
                <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "#c8a882" }}>
                  {isFr ? item.cat.fr : item.cat.en}
                </p>
                <p className="font-serif font-bold text-white" style={{ fontSize: "clamp(15px, 1.4vw, 21px)" }}>
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
        <span className="text-[10px] tracking-[0.05em] text-white/18">
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
