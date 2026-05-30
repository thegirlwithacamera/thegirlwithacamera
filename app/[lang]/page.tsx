import Image from "next/image";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Portfolio",
    description: lang === "fr"
      ? "Portfolio photographique de Sandrine Ceuppens. Street photography, documentaire et création de contenu pour les marques. Bruxelles."
      : "Photography portfolio by Sandrine Ceuppens. Street, documentary and brand content creation. Brussels-based photographer.",
    alternates: { canonical: `/${lang}`, languages: { fr: "/fr", en: "/en" } },
  };
}

// ─────────────────────────────────────────────────────────────
// PORTFOLIO — ajouter / remplacer tes photos ici.
// Mets tes fichiers dans /public/images/portfolio/
// et nomme-les 01.JPG, 02.JPG, 03.JPG…
// Les dimensions (w, h) = taille réelle du fichier.
// ─────────────────────────────────────────────────────────────
const ALL_PHOTOS: { src: string; w: number; h: number }[] = Array.from({ length: 45 }, (_, i) => ({
  src: `/images/portfolio/${i + 1}.JPG`,
  w: 1066,
  h: 1600,
}));

export default async function HomePage({ params }: Props) {
  await params;

  return (
    <>
      <style>{`
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .portfolio-cell {
          display: block;
          aspect-ratio: 1066 / 1600;
          overflow: hidden;
          position: relative;
        }
        .portfolio-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        @media (max-width: 767px) {
          .portfolio-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            padding: 0 12px;
          }
        }
      `}</style>

      <h1 className="sr-only">The Girl With A Camera - Créatrice de contenu & Photographe Portfolio</h1>
      <main style={{ paddingTop: "16px", background: "#ffffff" }}>
        <div className="portfolio-grid">
          {ALL_PHOTOS.map((img, i) => (
            <div key={i} className="portfolio-cell">
              <Image
                src={img.src}
                alt={`Portfolio photograph number ${i + 1} by Sandrine Ceuppens`}
                width={img.w}
                height={img.h}
                sizes="(max-width: 767px) 33vw, (max-width: 1300px) 33vw, 420px"
                priority={i < 6}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: "Portfolio by Sandrine Ceuppens",
        description: "Photography portfolio featuring street, documentary, and brand content creation work",
        associatedMedia: ALL_PHOTOS.map((img, i) => ({
          "@type": "ImageObject",
          url: `https://thegirlwithacamera.com${img.src}`,
          name: `Portfolio photograph ${i + 1}`,
          width: img.w,
          height: img.h,
          creator: { "@type": "Person", name: "Sandrine Ceuppens" }
        }))
      })}} />
    </>
  );
}
