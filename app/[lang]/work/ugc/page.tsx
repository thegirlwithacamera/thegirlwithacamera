import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "UGC & Campagnes · Sandrine Ceuppens" : "UGC & Campaigns · Sandrine Ceuppens",
  };
}

export default async function WorkUGCPage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";

  return (
    <main style={{ paddingTop: "52px", minHeight: "70vh" }}>

      {/* Nav Work */}
      <div style={{ borderBottom: "1px solid #ebebeb", padding: "0 48px" }}>
        <div style={{ display: "flex", gap: "32px", maxWidth: "1280px", margin: "0 auto" }}>
          {[
            { href: `/${lang}/gallery`,    label: isFr ? "Photo" : "Photo" },
            { href: `/${lang}/work/video`, label: isFr ? "Vidéo" : "Video" },
            { href: `/${lang}/work/ugc`,   label: "UGC" },
          ].map((tab) => {
            const active = tab.href.includes("ugc");
            return (
              <Link key={tab.href} href={tab.href} style={{
                fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase",
                color: active ? "#0a0a0a" : "#9a9a9a", textDecoration: "none",
                padding: "16px 0", borderBottom: active ? "1px solid #0a0a0a" : "1px solid transparent",
                fontWeight: active ? 500 : 400,
              }}>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 48px" }}>
        <h1 style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "clamp(40px, 6vw, 80px)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "#0a0a0a",
          marginBottom: "24px",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}>
          {isFr ? "UGC & Campagnes" : "UGC & Campaigns"}
        </h1>
        <p style={{ fontSize: "14px", color: "#9a9a9a", lineHeight: 1.8, maxWidth: "480px" }}>
          {isFr
            ? "Contenu de marque, collaborations et campagnes créatives. Bientôt disponible."
            : "Brand content, collaborations and creative campaigns. Coming soon."}
        </p>
      </section>
    </main>
  );
}
