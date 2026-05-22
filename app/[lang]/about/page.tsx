import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Info" : "Info",
    alternates: { canonical: `/${lang}/about`, languages: { fr: "/fr/about", en: "/en/about" } },
  };
}

const content = {
  fr: {
    bio: "SANDRINE CEUPPENS EST UNE PHOTOGRAPHE DOCUMENTAIRE ET CRÉATRICE DE CONTENU BASÉE À BRUXELLES. ELLE PHOTOGRAPHIE LES RUES, LA LUMIÈRE ET LES MOMENTS SILENCIEUX — CEUX QU'ON NE REMARQUE PAS. SON TRAVAIL SE SITUE À LA CROISÉE DU DOCUMENTAIRE ET DE LA MODE. POST-TRAITEMENT MINIMAL. SANDRINE COLLABORE AVEC DES MARQUES EUROPÉENNES POUR CRÉER DU CONTENU AUTHENTIQUE ET ÉDITORIAL.",
    collabLabel: "COLLABORATIONS",
    based: "BASÉE À BRUXELLES · DISPONIBLE POUR VOYAGER",
  },
  en: {
    bio: "SANDRINE CEUPPENS IS A DOCUMENTARY PHOTOGRAPHER AND CONTENT CREATOR BASED IN BRUSSELS. SHE PHOTOGRAPHS STREETS, LIGHT AND QUIET MOMENTS — THE KIND THAT GO UNNOTICED. HER WORK SITS AT THE INTERSECTION OF DOCUMENTARY AND FASHION. MINIMAL EDITING. SANDRINE COLLABORATES WITH EUROPEAN BRANDS TO CREATE AUTHENTIC AND EDITORIAL CONTENT.",
    collabLabel: "COLLABORATIONS",
    based: "BASED IN BRUSSELS · AVAILABLE TO TRAVEL",
  },
};

const COLLABORATIONS = [
  "RICOH EUROPE",
  "PENTAX EUROPE",
];

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <main style={{ paddingTop: "120px", paddingBottom: "80px", background: "#ffffff" }}>
      <style>{`
        .info-bio {
          font-size: 11px;
          line-height: 2;
          letter-spacing: 0.06em;
          color: #0a0a0a;
          text-align: center;
          max-width: 780px;
          margin: 0 auto;
          padding: 0 40px;
          font-weight: 400;
        }
        .info-section-title {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #0a0a0a;
          text-align: center;
          margin: 0;
        }
        .info-item {
          font-size: 10px;
          letter-spacing: 0.12em;
          color: #0a0a0a;
          text-align: center;
          line-height: 2.4;
        }
        .info-based {
          font-size: 9px;
          letter-spacing: 0.18em;
          color: #aaaaaa;
          text-align: center;
        }
        @media (max-width: 767px) {
          .info-bio { font-size: 10px; padding: 0 24px; }
        }
      `}</style>

      {/* Bio */}
      <p className="info-bio">{t.bio}</p>

      {/* Séparateur */}
      <div style={{ height: "1px", background: "#ebebeb", maxWidth: "320px", margin: "60px auto" }} />

      {/* Collaborations */}
      <p className="info-section-title">{t.collabLabel}</p>
      <div style={{ marginTop: "32px" }}>
        {COLLABORATIONS.map((name) => (
          <p key={name} className="info-item">{name}</p>
        ))}
      </div>

      {/* Séparateur */}
      <div style={{ height: "1px", background: "#ebebeb", maxWidth: "320px", margin: "60px auto" }} />

      {/* Based */}
      <p className="info-based">{t.based}</p>

      {/* Instagram */}
      <div style={{ marginTop: "60px", textAlign: "center" }}>
        <a
          href="https://www.instagram.com/sandrinecppns/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "12px", textDecoration: "none", color: "#0a0a0a" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
          </svg>
          <span style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}>@sandrinecppns</span>
        </a>
      </div>
    </main>
  );
}
