import Image from "next/image";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr"
      ? "Sandrine Ceuppens · Photographe documentaire, Bruxelles"
      : "Sandrine Ceuppens · Documentary Photographer, Brussels",
    alternates: { canonical: `/${lang}`, languages: { fr: "/fr", en: "/en" } },
  };
}

// ─────────────────────────────────────────────────────────────
// PORTFOLIO — ajouter / remplacer tes photos ici.
// Mets tes fichiers dans /public/images/portfolio/
// et nomme-les 01.JPG, 02.JPG, 03.JPG…
// Les dimensions (w, h) = taille réelle du fichier.
// ─────────────────────────────────────────────────────────────
const ALL_PHOTOS: { src: string; w: number; h: number }[] = [
  { src: "/images/portfolio/01.JPG", w: 2051, h: 3077 }, // 01
  { src: "/images/portfolio/02.JPG", w: 5589, h: 3726 }, // 02
  { src: "/images/portfolio/03.JPG", w: 3729, h: 5594 }, // 03
  { src: "/images/portfolio/04.JPG", w: 2051, h: 1367 }, // 04
  { src: "/images/portfolio/05.JPG", w: 3224, h: 2161 }, // 05
  { src: "/images/portfolio/06.JPG", w: 2333, h: 3500 }, // 06
  { src: "/images/portfolio/07.JPG", w: 5788, h: 3859 }, // 07
  { src: "/images/portfolio/08.JPG", w: 4000, h: 6000 }, // 08
  { src: "/images/portfolio/09.JPG", w: 3906, h: 2604 }, // 09
  { src: "/images/portfolio/10.JPG", w: 3224, h: 2161 }, // 10
  { src: "/images/portfolio/11.JPG", w: 2038, h: 3057 }, // 11
  { src: "/images/portfolio/12.JPG", w: 6000, h: 4000 }, // 12
  { src: "/images/portfolio/13.JPG", w: 3644, h: 5466 }, // 13
  { src: "/images/portfolio/14.JPG", w: 4000, h: 2667 }, // 14
  { src: "/images/portfolio/15.JPG", w: 3224, h: 2161 }, // 15
  { src: "/images/portfolio/16.JPG", w: 5524, h: 3683 }, // 16
  { src: "/images/portfolio/17.JPG", w: 3728, h: 2485 }, // 17
  { src: "/images/portfolio/18.JPG", w: 2850, h: 4275 }, // 18
  { src: "/images/portfolio/19.JPG", w: 1777, h: 2666 }, // 19
  { src: "/images/portfolio/20.JPG", w: 3224, h: 2161 }, // 20
  { src: "/images/portfolio/21.JPG", w: 5790, h: 3860 }, // 21
  { src: "/images/portfolio/22.JPG", w: 6000, h: 4000 }, // 22
  { src: "/images/portfolio/23.JPG", w: 3265, h: 4897 }, // 23
  { src: "/images/portfolio/24.JPG", w: 2240, h: 3360 }, // 24
  { src: "/images/portfolio/25.JPG", w: 3224, h: 2161 }, // 25
  { src: "/images/portfolio/26.JPG", w: 6000, h: 4000 }, // 26
  { src: "/images/portfolio/27.JPG", w: 6000, h: 4000 }, // 27
  { src: "/images/portfolio/28.JPG", w: 3397, h: 5095 }, // 28
  { src: "/images/portfolio/29.JPG", w: 2240, h: 3360 }, // 29
  { src: "/images/portfolio/30.JPG", w: 3224, h: 2161 }, // 30
  { src: "/images/portfolio/31.JPG", w: 3111, h: 4667 }, // 31
  { src: "/images/portfolio/32.JPG", w: 5586, h: 3724 }, // 32
  { src: "/images/portfolio/33.JPG", w: 3200, h: 4800 }, // 33
  { src: "/images/portfolio/34.JPG", w: 3224, h: 2161 }, // 34
  { src: "/images/portfolio/35.JPG", w: 1928, h: 2892 }, // 35
  { src: "/images/portfolio/36.JPG", w: 6000, h: 4000 }, // 36
  { src: "/images/portfolio/37.JPG", w: 1956, h: 2934 }, // 37
  { src: "/images/portfolio/38.JPG", w: 3224, h: 2161 }, // 38
  { src: "/images/portfolio/39.JPG", w: 2071, h: 3106 }, // 39
  { src: "/images/portfolio/40.JPG", w: 5700, h: 3800 }, // 40
  { src: "/images/portfolio/41.JPG", w: 4000, h: 6000 }, // 41
  { src: "/images/portfolio/42.JPG", w: 3224, h: 2161 }, // 42
  { src: "/images/portfolio/43.JPG", w: 2272, h: 3408 }, // 43
  { src: "/images/portfolio/44.JPG", w: 4000, h: 6000 }, // 44
  { src: "/images/portfolio/45.JPG", w: 3224, h: 2161 }, // 45
  { src: "/images/portfolio/46.JPG", w: 2240, h: 3360 }, // 46
  { src: "/images/portfolio/47.JPG", w: 4000, h: 2667 }, // 47
  { src: "/images/portfolio/48.JPG", w: 3224, h: 2161 }, // 48
  { src: "/images/portfolio/49.JPG", w: 2247, h: 3371 }, // 49
  { src: "/images/portfolio/50.JPG", w: 1996, h: 2994 }, // 50
];

export default async function HomePage({ params }: Props) {
  await params;

  return (
    <>
      <style>{`
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
          aspect-ratio: 4 / 5;
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
            grid-template-columns: repeat(2, 1fr);
            gap: 4px;
            padding: 0 12px;
          }
        }
      `}</style>

      <main style={{ paddingTop: "16px", background: "#ffffff" }}>
        <div className="portfolio-grid">
          {ALL_PHOTOS.map((img, i) => (
            <div key={i} className="portfolio-cell">
              <Image
                src={img.src}
                alt=""
                width={img.w}
                height={img.h}
                sizes="(max-width: 767px) 50vw, 33vw"
                priority={i < 6}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
