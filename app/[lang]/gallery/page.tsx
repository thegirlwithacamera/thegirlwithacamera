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
      ? "Séries photographiques de Sandrine Ceuppens : street, documentaire, mode, voyage."
      : "Photographic series by Sandrine Ceuppens : street, documentary, fashion, travel.",
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
    <main style={{ paddingTop: "64px" }}>

      {/* HERO HEADER éditorial */}
      <section style={{ padding: "72px 64px 56px", borderBottom: "1px solid #ebebeb", maxWidth: "1280px", margin: "0 auto" }}>
        <style>{`@media(max-width:768px){.gallery-header{padding:48px 24px 40px !important}}`}</style>
        <div className="gallery-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "32px", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: "8.5px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#b0b0b0", fontWeight: 600, marginBottom: "20px" }}>
              {isFr ? "Travail photographique" : "Photographic work"}
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(48px, 7vw, 100px)",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "#0a0a0a",
            }}>
              {isFr ? "Séries" : "Series"}
            </h1>
          </div>
          <p style={{ fontSize: "13px", color: "#9a9a9a", lineHeight: 1.8, maxWidth: "380px", paddingBottom: "8px" }}>
            {isFr
              ? "Des corpus construits sur la durée. Un lieu, une obsession, une question. Ce qui est là, tel que c'était."
              : "Bodies of work built over time. A place, an obsession, a question. What's there, as it was."}
          </p>
        </div>
      </section>

      {/* GRILLE SÉRIES */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 64px 96px" }}>
        <style>{`
          @media(max-width:768px){
            .series-grid { grid-template-columns: 1fr !important; padding: 48px 24px 72px !important; }
          }
          @media(min-width:769px) and (max-width:1024px){
            .series-grid { grid-template-columns: repeat(2,1fr) !important; }
          }
        `}</style>
        <ul className="series-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "48px 32px", listStyle: "none", padding: 0, margin: 0 }}>
          {series.map((s, idx) => (
            <li key={s.slug}>
              <Link
                href={`/${lang}/gallery/${s.slug}`}
                style={{ display: "block", textDecoration: "none" }}
                className="series-card"
              >
                <style>{`
                  .series-card:hover .series-img { transform: scale(1.04); }
                  .series-card:hover .series-arrow { opacity: 1; transform: translateX(0); }
                `}</style>

                {/* Numéro éditorial + photo */}
                <div style={{ position: "relative" }}>
                  <p style={{
                    position: "absolute",
                    top: "-18px",
                    left: "0",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#d0d0d0",
                    letterSpacing: "0.1em",
                    zIndex: 1,
                  }}>
                    {String(idx + 1).padStart(2, "0")}
                  </p>
                  <div style={{ overflow: "hidden", background: "#f0f0f0", aspectRatio: "4/3" }}>
                    <Image
                      src={s.cover}
                      alt={`${s.title}`}
                      fill
                      className="series-img object-cover"
                      style={{ transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>

                {/* Légende */}
                <div style={{ marginTop: "18px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#b0b0b0", fontWeight: 600, marginBottom: "6px" }}>
                      {s.year} · {s.photos.length} {isFr ? "photos" : "photos"}
                    </p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: "6px" }}>
                      {s.title}
                    </p>
                    <p style={{ fontSize: "12px", color: "#b0b0b0", lineHeight: 1.5 }}>
                      {s.description[lang].slice(0, 55)}…
                    </p>
                  </div>
                  <span className="series-arrow" style={{
                    fontSize: "16px",
                    color: "#0a0a0a",
                    marginTop: "4px",
                    flexShrink: 0,
                    opacity: 0,
                    transform: "translateX(-6px)",
                    transition: "opacity 0.2s, transform 0.2s",
                  }}>→</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

    </main>
  );
}
