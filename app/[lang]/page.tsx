import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export const metadata: Metadata = {
  title: "Sandrine Ceuppens · Photographe documentaire & éditoriale, Bruxelles",
};

// Sélection éditoriale pour la homepage
const GRID_IMAGES = [
  { src: "/images/series/dramatic-bw/cover.JPG",   href: "/gallery/dramatic-bw"  },
  { src: "/images/series/mercato/03.JPG",           href: "/gallery/mercato"       },
  { src: "/images/series/workers/07.JPG",           href: "/gallery/workers"       },
  { src: "/images/series/behind-doors/cover.JPG",   href: "/gallery/behind-doors"  },
  { src: "/images/series/workers/09.JPG",           href: "/gallery/workers"       },
  { src: "/images/series/color-hunting/06.JPG",     href: "/gallery/color-hunting" },
  { src: "/images/series/behind-doors/07.JPG",      href: "/gallery/behind-doors"  },
  { src: "/images/series/mercato/cover.jpg",        href: "/gallery/mercato"       },
  { src: "/images/series/dramatic-bw/02.JPG",       href: "/gallery/dramatic-bw"   },
  { src: "/images/series/workers/04.JPG",           href: "/gallery/workers"       },
  { src: "/images/series/mercato/07.JPG",           href: "/gallery/mercato"       },
  { src: "/images/series/behind-doors/11.JPG",      href: "/gallery/behind-doors"  },
  { src: "/images/series/color-hunting/03.JPG",     href: "/gallery/color-hunting" },
  { src: "/images/series/workers/12.JPG",           href: "/gallery/workers"       },
  { src: "/images/series/dramatic-bw/04.JPG",       href: "/gallery/dramatic-bw"   },
];

export default async function HomePage({ params }: Props) {
  const { lang } = await params;

  return (
    <>
      <style>{`
        .portfolio-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 3px;
          background: #e8e8e8;
          padding-top: 3px;
        }
        .portfolio-cell {
          aspect-ratio: 4 / 3;
          overflow: hidden;
          display: block;
          position: relative;
          background: #f0f0f0;
        }
        .portfolio-cell img {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portfolio-cell:hover img {
          transform: scale(1.04);
        }
        @media (max-width: 767px) {
          .portfolio-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2px;
            padding-top: 2px;
          }
        }
      `}</style>

      <div style={{ paddingTop: "52px", background: "#ffffff" }}>
        <div className="portfolio-grid">
          {GRID_IMAGES.map((img, i) => (
            <Link
              key={i}
              href={`/${lang}${img.href}`}
              className="portfolio-cell"
            >
              <Image
                src={img.src}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 767px) 50vw, 33vw"
                priority={i < 6}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
