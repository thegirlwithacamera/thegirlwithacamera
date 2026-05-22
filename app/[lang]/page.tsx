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

// Uniquement les séries nommées (on exclut les entrées sans titre)
function getSeries(items: typeof homeGrid) {
  return items.filter((item) => item.title !== "");
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";
  const series = getSeries(homeGrid);

  // Ligne 1 : 3 premières séries — Ligne 2 : 2 dernières (colonnes 1 et 3)
  const row1 = series.slice(0, 3);
  const row2 = series.slice(3, 5);

  return (
    <div style={{ paddingTop: "52px", background: "var(--warm-white)" }}>

      {/* ── EN-TÊTE DE SECTION ── */}
      <div
        style={{
          padding: "40px 40px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "1px solid var(--cream)",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--stone)",
              marginBottom: "10px",
            }}
          >
            {isFr ? "Travail photographique" : "Photographic work"}
          </p>
          <h1
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "var(--ink)",
            }}
          >
            {isFr ? (
              <>Séries <em style={{ fontStyle: "italic", color: "var(--stone)" }}>en cours</em> &amp; archive</>
            ) : (
              <>Series <em style={{ fontStyle: "italic", color: "var(--stone)" }}>in progress</em> &amp; archive</>
            )}
          </h1>
        </div>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "52px",
            color: "var(--cream)",
            lineHeight: 1,
            letterSpacing: "0.02em",
          }}
        >
          {String(series.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── GRILLE LIGNE 1 : 3 colonnes ── */}
      <div
        style={{
          padding: "32px 40px 0",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {row1.map((item, i) => (
          <SerieCard key={i} item={item} index={i} lang={lang} isFr={isFr} priority />
        ))}
      </div>

      {/* ── GRILLE LIGNE 2 : colonnes 1 et 3 seulement ── */}
      <div
        style={{
          padding: "16px 40px 0",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {row2.map((item, i) => (
          <SerieCard
            key={i}
            item={item}
            index={row1.length + i}
            lang={lang}
            isFr={isFr}
            style={{ gridColumn: i === 0 ? 1 : 3 }}
          />
        ))}
      </div>

      {/* ── LIEN TOUTES LES SÉRIES ── */}
      <div
        style={{
          padding: "32px 40px 56px",
          display: "flex",
          justifyContent: "flex-end",
          borderTop: "1px solid var(--cream)",
          marginTop: "32px",
        }}
      >
        <Link
          href={`/${lang}/gallery`}
          style={{
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--stone)",
            textDecoration: "none",
            paddingBottom: "3px",
            borderBottom: "1px solid var(--dust)",
          }}
        >
          {isFr ? "Voir toutes les séries →" : "View all series →"}
        </Link>
      </div>

    </div>
  );
}

/* ── COMPOSANT CARTE SÉRIE ── */
function SerieCard({
  item,
  index,
  lang,
  isFr,
  priority = false,
  style = {},
}: {
  item: (typeof homeGrid)[number];
  index: number;
  lang: string;
  isFr: boolean;
  priority?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      href={`/${lang}${item.href}`}
      className="group"
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        ...style,
      }}
    >
      {/* Image — ratio 2:3 allongé vertical */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "2 / 3",
          overflow: "hidden",
          background: "#1a1815",
        }}
      >
        <Image
          src={item.src}
          alt={item.title || "Sandrine Ceuppens"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 767px) 90vw, 33vw"
          priority={priority}
        />

        {/* Overlay sombre au hover */}
        <span
          className="absolute inset-0 z-10 transition-colors duration-300"
          style={{ background: "rgba(0,0,0,0)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.28)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0)")}
        />

        {/* Caption au hover */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            padding: "40px 18px 18px",
            background: "linear-gradient(to top, rgba(10,10,8,0.75) 0%, transparent 100%)",
          }}
        >
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "3px",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </p>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "20px",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.1,
              marginBottom: "3px",
            }}
          >
            {item.title}
          </p>
          <p
            style={{
              fontSize: "9px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {isFr ? item.cat.fr : item.cat.en}
          </p>
        </div>
      </div>

      {/* Meta sous l'image */}
      <div
        style={{
          paddingTop: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "16px",
            fontStyle: "italic",
            color: "var(--ink)",
          }}
        >
          {item.title}
        </span>
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--dust)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </Link>
  );
}
