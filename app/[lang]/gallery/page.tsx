import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Portfolio · Sandrine Ceuppens" : "Portfolio · Sandrine Ceuppens",
    description:
      lang === "fr"
        ? "Séries photographiques de Sandrine Ceuppens : street, documentaire, mode, voyage."
        : "Photographic series by Sandrine Ceuppens: street, documentary, fashion, travel.",
    alternates: { canonical: `/${lang}/gallery`, languages: { fr: "/fr/gallery", en: "/en/gallery" } },
  };
}

const ALL_PHOTOS: { src: string; href: string; w: number; h: number }[] = [
  { src: "/images/series/behind-doors/01.JPG",  href: "/gallery/behind-doors",  w: 2051, h: 3077 },
  { src: "/images/series/mercato/01.JPG",        href: "/gallery/mercato",        w: 5589, h: 3726 },
  { src: "/images/series/dramatic-bw/01.JPG",    href: "/gallery/dramatic-bw",    w: 3729, h: 5594 },
  { src: "/images/series/workers/01.JPG",        href: "/gallery/workers",        w: 2051, h: 1367 },
  { src: "/images/series/color-hunting/01.JPG",  href: "/gallery/color-hunting",  w: 3224, h: 2161 },
  { src: "/images/series/behind-doors/02.JPG",  href: "/gallery/behind-doors",  w: 2333, h: 3500 },
  { src: "/images/series/mercato/02.JPG",        href: "/gallery/mercato",        w: 5788, h: 3859 },
  { src: "/images/series/dramatic-bw/02.JPG",    href: "/gallery/dramatic-bw",    w: 4000, h: 6000 },
  { src: "/images/series/workers/02.JPG",        href: "/gallery/workers",        w: 3906, h: 2604 },
  { src: "/images/series/color-hunting/02.JPG",  href: "/gallery/color-hunting",  w: 3224, h: 2161 },
  { src: "/images/series/behind-doors/03.JPG",  href: "/gallery/behind-doors",  w: 2038, h: 3057 },
  { src: "/images/series/mercato/03.JPG",        href: "/gallery/mercato",        w: 6000, h: 4000 },
  { src: "/images/series/dramatic-bw/03.JPG",    href: "/gallery/dramatic-bw",    w: 3644, h: 5466 },
  { src: "/images/series/workers/03.JPG",        href: "/gallery/workers",        w: 4000, h: 2667 },
  { src: "/images/series/color-hunting/03.JPG",  href: "/gallery/color-hunting",  w: 3224, h: 2161 },
  { src: "/images/series/behind-doors/04.JPG",  href: "/gallery/behind-doors",  w: 5524, h: 3683 },
  { src: "/images/series/mercato/04.JPG",        href: "/gallery/mercato",        w: 3728, h: 2485 },
  { src: "/images/series/dramatic-bw/04.JPG",    href: "/gallery/dramatic-bw",    w: 2850, h: 4275 },
  { src: "/images/series/workers/04.JPG",        href: "/gallery/workers",        w: 1777, h: 2666 },
  { src: "/images/series/color-hunting/04.JPG",  href: "/gallery/color-hunting",  w: 3224, h: 2161 },
  { src: "/images/series/behind-doors/05.JPG",  href: "/gallery/behind-doors",  w: 5790, h: 3860 },
  { src: "/images/series/mercato/05.JPG",        href: "/gallery/mercato",        w: 6000, h: 4000 },
  { src: "/images/series/dramatic-bw/05.JPG",    href: "/gallery/dramatic-bw",    w: 3265, h: 4897 },
  { src: "/images/series/workers/05.JPG",        href: "/gallery/workers",        w: 2240, h: 3360 },
  { src: "/images/series/color-hunting/05.JPG",  href: "/gallery/color-hunting",  w: 3224, h: 2161 },
  { src: "/images/series/behind-doors/06.JPG",  href: "/gallery/behind-doors",  w: 6000, h: 4000 },
  { src: "/images/series/mercato/06.JPG",        href: "/gallery/mercato",        w: 6000, h: 4000 },
  { src: "/images/series/dramatic-bw/06.JPG",    href: "/gallery/dramatic-bw",    w: 3397, h: 5095 },
  { src: "/images/series/workers/06.JPG",        href: "/gallery/workers",        w: 2240, h: 3360 },
  { src: "/images/series/color-hunting/06.JPG",  href: "/gallery/color-hunting",  w: 3224, h: 2161 },
  { src: "/images/series/behind-doors/07.JPG",  href: "/gallery/behind-doors",  w: 3111, h: 4667 },
  { src: "/images/series/mercato/07.JPG",        href: "/gallery/mercato",        w: 5586, h: 3724 },
  { src: "/images/series/workers/07.JPG",        href: "/gallery/workers",        w: 3200, h: 4800 },
  { src: "/images/series/color-hunting/07.JPG",  href: "/gallery/color-hunting",  w: 3224, h: 2161 },
  { src: "/images/series/behind-doors/08.JPG",  href: "/gallery/behind-doors",  w: 1928, h: 2892 },
  { src: "/images/series/mercato/08.JPG",        href: "/gallery/mercato",        w: 6000, h: 4000 },
  { src: "/images/series/workers/08.JPG",        href: "/gallery/workers",        w: 1956, h: 2934 },
  { src: "/images/series/color-hunting/08.JPG",  href: "/gallery/color-hunting",  w: 3224, h: 2161 },
  { src: "/images/series/behind-doors/09.JPG",  href: "/gallery/behind-doors",  w: 2071, h: 3106 },
  { src: "/images/series/mercato/09.JPG",        href: "/gallery/mercato",        w: 5700, h: 3800 },
  { src: "/images/series/workers/09.JPG",        href: "/gallery/workers",        w: 4000, h: 6000 },
  { src: "/images/series/color-hunting/09.JPG",  href: "/gallery/color-hunting",  w: 3224, h: 2161 },
  { src: "/images/series/behind-doors/10.JPG",  href: "/gallery/behind-doors",  w: 2272, h: 3408 },
  { src: "/images/series/workers/10.JPG",        href: "/gallery/workers",        w: 4000, h: 6000 },
  { src: "/images/series/color-hunting/10.JPG",  href: "/gallery/color-hunting",  w: 3224, h: 2161 },
  { src: "/images/series/behind-doors/11.JPG",  href: "/gallery/behind-doors",  w: 2240, h: 3360 },
  { src: "/images/series/workers/11.JPG",        href: "/gallery/workers",        w: 4000, h: 2667 },
  { src: "/images/series/color-hunting/11.JPG",  href: "/gallery/color-hunting",  w: 3224, h: 2161 },
  { src: "/images/series/behind-doors/12.JPG",  href: "/gallery/behind-doors",  w: 2247, h: 3371 },
  { src: "/images/series/workers/12.JPG",        href: "/gallery/workers",        w: 1996, h: 2994 },
];

export default async function GalleryPage({ params }: Props) {
  const { lang } = await params;

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
          transition: transform 0.5s ease;
        }
        .portfolio-cell:hover img {
          transform: scale(1.03);
        }
        @media (max-width: 767px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
            padding: 0 16px;
          }
        }
      `}</style>

      <main style={{ paddingTop: "90px", background: "#ffffff" }}>
        <div className="portfolio-grid">
          {ALL_PHOTOS.map((img, i) => (
            <Link
              key={i}
              href={`/${lang}${img.href}`}
              className="portfolio-cell"
            >
              <Image
                src={img.src}
                alt=""
                width={img.w}
                height={img.h}
                sizes="(max-width: 767px) 50vw, 33vw"
                priority={i < 6}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
