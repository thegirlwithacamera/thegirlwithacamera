import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { homeGrid } from "@/lib/content";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export const metadata: Metadata = {
  title: "Sandrine Ceuppens · Photographe documentaire & éditoriale, Bruxelles",
};

// Uniquement les entrées avec un titre (séries nommées)
function getSeries(items: typeof homeGrid) {
  return items.filter((item) => item.title !== "");
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";
  const series = getSeries(homeGrid);

  return (
    <div style={{ paddingTop: "52px", background: "#ffffff" }}>

      {/* ─── GRILLE MIX PLEIN ÉCRAN ───
          Layout éditorial : 1 grande à gauche (2 rangées) + 2×2 à droite
          puis ligne du bas avec les séries restantes en colonnes égales     */}
      <div
        style={{
          display: "grid",
          /* 3 colonnes : grande | moyenne | moyenne */
          gridTemplateColumns: "2fr 1fr 1fr",
          gridTemplateRows: "50vh 50vh",
          gap: "2px",
          background: "#e0e0e0",
        }}
        className="home-grid-top"
      >
        <style>{`
          @media (max-width: 767px) {
            .home-grid-top {
              grid-template-columns: 1fr 1fr !important;
              grid-template-rows: 50vw 50vw 50vw !important;
            }
            .home-grid-top .cell-large {
              grid-column: 1 / -1 !important;
              grid-row: 1 !important;
            }
          }
          .home-grid-top a { display: block; position: relative; overflow: hidden; }
          .home-grid-top a img { transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
          .home-grid-top a:hover img { transform: scale(1.04); }
          .home-grid-top .caption {
            position: absolute; bottom: 0; left: 0; right: 0;
            padding: 32px 20px 18px;
            background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
            opacity: 0; transition: opacity 0.3s;
          }
          .home-grid-top a:hover .caption { opacity: 1; }
          .cap-cat {
            font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
            color: rgba(255,255,255,0.5); margin-bottom: 4px;
          }
          .cap-title {
            font-family: 'EB Garamond', serif; font-size: 20px; font-style: italic;
            color: rgba(255,255,255,0.9); line-height: 1.1;
          }
        `}</style>

        {/* Cellule 0 — grande, span 2 rangées */}
        {series[0] && (
          <Link
            href={`/${lang}${series[0].href}`}
            className="cell-large"
            style={{ gridColumn: 1, gridRow: "1 / 3" }}
          >
            <Image src={series[0].src} alt={series[0].title} fill className="object-cover" sizes="(max-width:767px) 100vw, 50vw" priority />
            <div className="caption">
              <p className="cap-cat">{isFr ? series[0].cat.fr : series[0].cat.en}</p>
              <p className="cap-title">{series[0].title}</p>
            </div>
          </Link>
        )}

        {/* Cellules 1–4 — petites, 2×2 à droite */}
        {series.slice(1, 5).map((item, i) => (
          <Link key={i} href={`/${lang}${item.href}`} style={{ gridColumn: (i % 2) + 2, gridRow: Math.floor(i / 2) + 1 }}>
            <Image src={item.src} alt={item.title} fill className="object-cover" sizes="(max-width:767px) 50vw, 25vw" priority={i < 2} />
            <div className="caption">
              <p className="cap-cat">{isFr ? item.cat.fr : item.cat.en}</p>
              <p className="cap-title">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
