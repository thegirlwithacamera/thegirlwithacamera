import Image from "next/image";
import Link from "next/link";
import { hero, homeGrid, partners, footer } from "@/lib/content";

// ─────────────────────────────────────────────────────────
//  HOMEPAGE
//  Pour modifier le contenu, va dans :  lib/content.ts
//  Pour modifier le style, modifie ce fichier.
// ─────────────────────────────────────────────────────────

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
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "50vh",
          gap: "3px",
        }}
      >
        {homeGrid.map((item, i) => (
          <Link
            key={i}
            href={`/${lang}${item.href}`}
            style={{
              gridColumn: item.wide ? "span 2" : "span 1",
              gridRow: item.tall ? "span 2" : "span 1",
              position: "relative",
              overflow: "hidden",
              display: "block",
              background: "#111",
            }}
            className="group"
          >
            {/* Photo */}
            <Image
              src={item.src}
              alt={item.title || "Sandrine Ceuppens"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes={item.wide ? "50vw" : "25vw"}
              priority={i < 2}
            />

            {/* Assombrissement au hover */}
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 z-10" />

            {/* ── Accroche sur la 1ère cellule (grande) ── */}
            {i === 0 && (
              <div
                className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-14"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)",
                  pointerEvents: "none",
                }}
              >
                {/* Sous-titre */}
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: "12px",
                    fontFamily: "inherit",
                  }}
                >
                  {isFr ? hero.eyebrow.fr : hero.eyebrow.en}
                </p>

                {/* Titre principal */}
                <h1
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "clamp(26px, 3.2vw, 50px)",
                    fontWeight: 900,
                    lineHeight: 1.05,
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  {isFr ? hero.titleLine1.fr : hero.titleLine1.en}
                  <br />
                  <em style={{ fontWeight: 400, fontStyle: "italic" }}>
                    {isFr ? hero.titleLine2.fr : hero.titleLine2.en}
                  </em>
                </h1>

                {/* Tagline */}
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.16em",
                    color: "rgba(255,255,255,0.55)",
                    fontFamily: "inherit",
                  }}
                >
                  {isFr ? hero.tagline.fr : hero.tagline.en}
                </p>
              </div>
            )}

            {/* ── Légende au hover (toutes les cellules avec un titre) ── */}
            {item.title && (
              <div
                className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-7
                           opacity-0 translate-y-2
                           group-hover:opacity-100 group-hover:translate-y-0
                           transition-all duration-300"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#c8a882",
                    marginBottom: "5px",
                  }}
                >
                  {isFr ? item.cat.fr : item.cat.en}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "clamp(16px, 1.5vw, 22px)",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {item.title}
                </p>
              </div>
            )}
          </Link>
        ))}
      </main>

      {/* ── BANDE COLLABORATIONS ── */}
      {partners.length > 0 && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "24px 48px",
            display: "flex",
            alignItems: "center",
            gap: "48px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            {isFr ? "Collaborations" : "Selected collaborations"}
          </span>
          {partners.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "15px",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.35)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
            >
              {p.name}
            </a>
          ))}
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "#050505",
          padding: "24px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Sandrine Ceuppens
        </span>

        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.18)",
          }}
        >
          {footer.copyright}
        </span>

        <div style={{ display: "flex", gap: "20px" }}>
          {[
            { label: "Instagram", href: "https://www.instagram.com/sandrinecppns/" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.75)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
            >
              {s.label}
            </a>
          ))}
        </div>
      </footer>

    </div>
  );
}
