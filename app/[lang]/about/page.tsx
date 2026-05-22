import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

const content = {
  en: {
    eyebrow: "About",
    chapter1: "I've had a camera in my hands since I was a child.",
    p1: "Then life happened, and I put it down. In 2024, I picked it up again. What came back wasn't just a hobby. It was a way of seeing.",
    p2: "I photograph streets, light, and quiet moments. The kind that go unnoticed. My work sits at the intersection of documentary and fashion. Minimal editing. I barely touch the image after. Just what's there, as it was.",
    p3: "Beyond stills, I create video content: scripting, filming, editing. Currently working with Ricoh and Pentax Europe. I'm building a body of personal work I want to see in print.",
    based: "Based in Brussels. Available to travel.",
    whatIDo: "What I do",
    disciplines: [
      { num: "01", title: "Photography", desc: "Street, documentary, travel, fashion.\nPersonal series and editorial work." },
      { num: "02", title: "Video & Content", desc: "Scripting, filming, editing.\nBrand content for social media." },
      { num: "03", title: "Collaborations", desc: "Ricoh Europe · Pentax Europe\nOpen to brands and magazines." },
    ],
    cta: "Want to work together?",
    ctaDesc: "Whether it's a brand project, an editorial idea, or something else — I'd love to hear it.",
    ctaBtn: "Get in touch",
  },
  fr: {
    eyebrow: "À propos",
    chapter1: "J'ai eu un appareil photo entre les mains depuis l'enfance.",
    p1: "Puis la vie a pris le dessus, et je l'ai posé. En 2024, je l'ai repris. Ce qui est revenu n'était pas juste une passion. C'était une façon de voir.",
    p2: "Je photographie les rues, la lumière, les moments silencieux. Ceux qu'on ne remarque pas. Mon travail se situe à la croisée du documentaire et de la mode. Post-traitement minimal. Je touche à peine l'image. Ce qui est là, tel que c'était.",
    p3: "Au-delà de la photo, je crée du contenu vidéo : scripting, tournage, montage. Actuellement avec Ricoh et Pentax Europe. Je construis un corpus de travail personnel que j'aimerais voir publié.",
    based: "Basée à Bruxelles. Disponible pour voyager.",
    whatIDo: "Ce que je fais",
    disciplines: [
      { num: "01", title: "Photographie", desc: "Street, documentaire, voyage, mode.\nSéries personnelles et travail éditorial." },
      { num: "02", title: "Vidéo & Contenu", desc: "Scripting, tournage, montage.\nContenu de marque pour les réseaux sociaux." },
      { num: "03", title: "Collaborations", desc: "Ricoh Europe · Pentax Europe\nOuverte aux marques et magazines." },
    ],
    cta: "Envie de travailler ensemble ?",
    ctaDesc: "Que ce soit un projet de marque, une idée éditoriale, ou autre chose — je suis à l'écoute.",
    ctaBtn: "Me contacter",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "À propos" : "About",
    description: isFr
      ? "Sandrine Ceuppens, photographe et créatrice de contenu basée à Bruxelles. Documentaire, mode, vidéo."
      : "Sandrine Ceuppens, photographer and content creator based in Brussels. Documentary, fashion, video.",
    alternates: { canonical: `/${lang}/about`, languages: { fr: "/fr/about", en: "/en/about" } },
  };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <main style={{ paddingTop: "64px" }}>

      {/* HERO : photo pleine hauteur + texte */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 64px)" }} className="about-hero">
        <style>{`
          @media (max-width: 768px) {
            .about-hero { grid-template-columns: 1fr !important; }
            .about-hero-img { min-height: 65vw !important; }
            .about-text { padding: 48px 24px !important; }
            .disciplines-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
            .disc-item { border-right: none !important; padding-left: 0 !important; border-top: 1px solid #ebebeb; padding-top: 40px !important; }
            .cta-grid { grid-template-columns: 1fr !important; padding: 64px 24px !important; }
          }
        `}</style>

        {/* Photo gauche pleine hauteur */}
        <div className="about-hero-img" style={{ position: "relative", overflow: "hidden", background: "#f0f0f0", minHeight: "calc(100vh - 64px)" }}>
          <Image
            src="/images/about.jpg"
            alt={lang === "fr" ? "Portrait de Sandrine Ceuppens" : "Portrait of Sandrine Ceuppens"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Texte droite */}
        <div className="about-text" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 72px" }}>
          <p style={{ fontSize: "8.5px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#b0b0b0", fontWeight: 600, marginBottom: "48px" }}>
            {t.eyebrow}
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 4vw, 58px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#0a0a0a",
            marginBottom: "40px",
          }}>
            {t.chapter1}
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "440px" }}>
            <p style={{ fontSize: "14px", color: "#6a6a6a", lineHeight: 1.9 }}>{t.p1}</p>
            <p style={{ fontSize: "14px", color: "#6a6a6a", lineHeight: 1.9 }}>{t.p2}</p>
            <p style={{ fontSize: "14px", color: "#6a6a6a", lineHeight: 1.9 }}>{t.p3}</p>
          </div>
          <p style={{ marginTop: "48px", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c0c0c0", fontWeight: 600 }}>
            {t.based}
          </p>
        </div>
      </section>

      {/* DISCIPLINES */}
      <section style={{ borderTop: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 64px" }}>
          <p style={{ fontSize: "8.5px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#b0b0b0", fontWeight: 600, marginBottom: "56px" }}>
            {t.whatIDo}
          </p>
          <div className="disciplines-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
            {t.disciplines.map((d, i) => (
              <div key={d.num} className="disc-item" style={{
                paddingRight: i < 2 ? "56px" : "0",
                paddingLeft: i > 0 ? "56px" : "0",
                borderRight: i < 2 ? "1px solid #ebebeb" : "none",
              }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "52px", fontWeight: 700, color: "#f0f0f0", lineHeight: 1, marginBottom: "16px" }}>
                  {d.num}
                </p>
                <h3 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0a0a0a", marginBottom: "12px" }}>
                  {d.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#9a9a9a", lineHeight: 1.9, whiteSpace: "pre-line" }}>
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: "1px solid #ebebeb" }}>
        <div className="cta-grid" style={{ maxWidth: "1280px", margin: "0 auto", padding: "100px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: "80px" }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 3.5vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#0a0a0a",
          }}>
            {t.cta}
          </h2>
          <div>
            <p style={{ fontSize: "14px", color: "#9a9a9a", lineHeight: 1.8, marginBottom: "36px" }}>
              {t.ctaDesc}
            </p>
            <Link
              href={`/${lang}/contact`}
              style={{
                display: "inline-block",
                padding: "14px 36px",
                background: "#0a0a0a",
                color: "#ffffff",
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              {t.ctaBtn}
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
