import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Photo · Sandrine Ceuppens" : "Photo · Sandrine Ceuppens",
    description:
      lang === "fr"
        ? "Séries photographiques de Sandrine Ceuppens : street, documentaire, mode, voyage."
        : "Photographic series by Sandrine Ceuppens: street, documentary, fashion, travel.",
    alternates: { canonical: `/${lang}/gallery`, languages: { fr: "/fr/gallery", en: "/en/gallery" } },
  };
}

// Toutes les photos interleaved entre séries
const ALL_PHOTOS = [
  { src: "/images/series/behind-doors/01.JPG",  href: "/gallery/behind-doors"  },
  { src: "/images/series/mercato/01.JPG",        href: "/gallery/mercato"        },
  { src: "/images/series/dramatic-bw/01.JPG",    href: "/gallery/dramatic-bw"    },
  { src: "/images/series/workers/01.JPG",        href: "/gallery/workers"        },
  { src: "/images/series/color-hunting/01.JPG",  href: "/gallery/color-hunting"  },
  { src: "/images/series/behind-doors/02.JPG",  href: "/gallery/behind-doors"  },
  { src: "/images/series/mercato/02.JPG",        href: "/gallery/mercato"        },
  { src: "/images/series/dramatic-bw/02.JPG",    href: "/gallery/dramatic-bw"    },
  { src: "/images/series/workers/02.JPG",        href: "/gallery/workers"        },
  { src: "/images/series/color-hunting/02.JPG",  href: "/gallery/color-hunting"  },
  { src: "/images/series/behind-doors/03.JPG",  href: "/gallery/behind-doors"  },
  { src: "/images/series/mercato/03.JPG",        href: "/gallery/mercato"        },
  { src: "/images/series/dramatic-bw/03.JPG",    href: "/gallery/dramatic-bw"    },
  { src: "/images/series/workers/03.JPG",        href: "/gallery/workers"        },
  { src: "/images/series/color-hunting/03.JPG",  href: "/gallery/color-hunting"  },
  { src: "/images/series/behind-doors/04.JPG",  href: "/gallery/behind-doors"  },
  { src: "/images/series/mercato/04.JPG",        href: "/gallery/mercato"        },
  { src: "/images/series/dramatic-bw/04.JPG",    href: "/gallery/dramatic-bw"    },
  { src: "/images/series/workers/04.JPG",        href: "/gallery/workers"        },
  { src: "/images/series/color-hunting/04.JPG",  href: "/gallery/color-hunting"  },
  { src: "/images/series/behind-doors/05.JPG",  href: "/gallery/behind-doors"  },
  { src: "/images/series/mercato/05.JPG",        href: "/gallery/mercato"        },
  { src: "/images/series/dramatic-bw/05.JPG",    href: "/gallery/dramatic-bw"    },
  { src: "/images/series/workers/05.JPG",        href: "/gallery/workers"        },
  { src: "/images/series/color-hunting/05.JPG",  href: "/gallery/color-hunting"  },
  { src: "/images/series/behind-doors/06.JPG",  href: "/gallery/behind-doors"  },
  { src: "/images/series/mercato/06.JPG",        href: "/gallery/mercato"        },
  { src: "/images/series/dramatic-bw/06.JPG",    href: "/gallery/dramatic-bw"    },
  { src: "/images/series/workers/06.JPG",        href: "/gallery/workers"        },
  { src: "/images/series/color-hunting/06.JPG",  href: "/gallery/color-hunting"  },
  { src: "/images/series/behind-doors/07.JPG",  href: "/gallery/behind-doors"  },
  { src: "/images/series/mercato/07.JPG",        href: "/gallery/mercato"        },
  { src: "/images/series/workers/07.JPG",        href: "/gallery/workers"        },
  { src: "/images/series/color-hunting/07.JPG",  href: "/gallery/color-hunting"  },
  { src: "/images/series/behind-doors/08.JPG",  href: "/gallery/behind-doors"  },
  { src: "/images/series/mercato/08.JPG",        href: "/gallery/mercato"        },
  { src: "/images/series/workers/08.JPG",        href: "/gallery/workers"        },
  { src: "/images/series/color-hunting/08.JPG",  href: "/gallery/color-hunting"  },
  { src: "/images/series/behind-doors/09.JPG",  href: "/gallery/behind-doors"  },
  { src: "/images/series/mercato/09.JPG",        href: "/gallery/mercato"        },
  { src: "/images/series/workers/09.JPG",        href: "/gallery/workers"        },
  { src: "/images/series/color-hunting/09.JPG",  href: "/gallery/color-hunting"  },
  { src: "/images/series/behind-doors/10.JPG",  href: "/gallery/behind-doors"  },
  { src: "/images/series/workers/10.JPG",        href: "/gallery/workers"        },
  { src: "/images/series/color-hunting/10.JPG",  href: "/gallery/color-hunting"  },
  { src: "/images/series/behind-doors/11.JPG",  href: "/gallery/behind-doors"  },
  { src: "/images/series/workers/11.JPG",        href: "/gallery/workers"        },
  { src: "/images/series/color-hunting/11.JPG",  href: "/gallery/color-hunting"  },
  { src: "/images/series/behind-doors/12.JPG",  href: "/gallery/behind-doors"  },
  { src: "/images/series/workers/12.JPG",        href: "/gallery/workers"        },
];

export default async function GalleryPage({ params }: Props) {
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

      <main style={{ paddingTop: "52px", background: "#ffffff" }}>

        {/* Nav Work */}
        <div style={{ borderBottom: "1px solid #ebebeb", padding: "0 48px" }}>
          <div style={{ display: "flex", gap: "32px", maxWidth: "1280px", margin: "0 auto" }}>
            {[
              { href: `/${lang}/gallery`,    label: lang === "fr" ? "Photo" : "Photo", active: true  },
              { href: `/${lang}/work/video`, label: lang === "fr" ? "Vidéo" : "Video",  active: false },
              { href: `/${lang}/work/ugc`,   label: "UGC",                               active: false },
            ].map((tab) => (
              <Link key={tab.href} href={tab.href} style={{
                fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase",
                color: tab.active ? "#0a0a0a" : "#9a9a9a", textDecoration: "none",
                padding: "16px 0",
                borderBottom: tab.active ? "1px solid #0a0a0a" : "1px solid transparent",
                fontWeight: tab.active ? 500 : 400,
              }}>
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Grille uniforme */}
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
                fill
                className="object-cover"
                sizes="(max-width: 767px) 50vw, 33vw"
                priority={i < 6}
              />
            </Link>
          ))}
        </div>

      </main>
    </>
  );
}
