import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Instagram Pentax Europe" : "Instagram Pentax Europe",
    description: lang === "fr"
      ? "Contenus Instagram créés pour Pentax Europe."
      : "Instagram content created for Pentax Europe.",
    alternates: {
      canonical: `/${lang}/seen/instagram-pentax-europe`,
      languages: { fr: "/fr/seen/instagram-pentax-europe", en: "/en/seen/instagram-pentax-europe" }
    },
  };
}

const content = {
  fr: {
    pageTitle: "INSTAGRAM PENTAX EUROPE",
    emptyState: "Aucun contenu pour le moment. Revenez bientôt.",
  },
  en: {
    pageTitle: "INSTAGRAM PENTAX EUROPE",
    emptyState: "No content yet. Check back soon.",
  },
};

interface GalleryItem {
  id: string;
  type: "video" | "image";
  src: string;
  thumbnail?: string;
  link?: string;
  brand?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "pentax-sicily-1",
    type: "video",
    src: "/videos/pentax-sicily-1.mp4",
    thumbnail: "/images/gallery/pentax-sicily-1.jpg",
    link: "https://www.instagram.com/reel/DYrwp_bNhQa/",
    brand: "PENTAX EUROPE",
  },
  {
    id: "pentax-sicily-2",
    type: "video",
    src: "/videos/pentax-sicily-2.mp4",
    thumbnail: "/images/gallery/pentax-sicily-2.jpg",
    link: "https://www.instagram.com/reel/DYkCMzYtIVz/",
    brand: "PENTAX EUROPE",
  },
  {
    id: "pentax-sicily-3",
    type: "video",
    src: "/videos/pentax-sicily-3.mp4",
    thumbnail: "/images/gallery/pentax-sicily-3.jpg",
    link: "https://www.instagram.com/reel/DYhdaEsNqxd/",
    brand: "PENTAX EUROPE",
  },
  {
    id: "pentax-sicily-4",
    type: "video",
    src: "/videos/pentax-sicily-4.mp4",
    thumbnail: "/images/gallery/pentax-sicily-4.jpg",
    link: "https://www.instagram.com/reel/DYSAsOENsPh/",
    brand: "PENTAX EUROPE",
  },
  {
    id: "pentax-sicily-5",
    type: "video",
    src: "/videos/pentax-sicily-5.mp4",
    thumbnail: "/images/gallery/pentax-sicily-5.jpg",
    link: "https://www.instagram.com/reel/DYPb5uOt4ju/",
    brand: "PENTAX EUROPE",
  },
];

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <main style={{ paddingTop: "60px", paddingBottom: "80px", background: "#ffffff" }}>
      <style>{`
        .gallery-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #0a0a0a;
          text-align: center;
          margin: 0 0 48px 0;
        }

        .gallery-empty {
          font-size: 13px;
          line-height: 1.8;
          letter-spacing: 0.06em;
          color: #999999;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .gallery-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin: 0;
          list-style: none;
          padding: 0;
        }

        .gallery-item {
          position: relative;
          aspect-ratio: 9 / 16;
          background: #f5f5f5;
          border: 1px solid #ebebeb;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .gallery-item:hover {
          border-color: #999999;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .gallery-item-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery-item-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0);
          transition: background 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-item:hover .gallery-item-overlay {
          background: rgba(0, 0, 0, 0.3);
        }

        .gallery-play-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover .gallery-play-icon {
          opacity: 1;
        }

        .gallery-item-link {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          text-decoration: none;
          z-index: 2;
        }

        .gallery-brand {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.5);
          padding: 6px 10px;
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.3s ease;
          text-transform: uppercase;
        }

        .gallery-item:hover .gallery-brand {
          opacity: 1;
        }

        @media (max-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 767px) {
          .gallery-title {
            font-size: 10px;
            margin-bottom: 32px;
          }

          .gallery-container {
            padding: 0 20px;
          }

          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .gallery-item {
            border-radius: 8px;
          }
        }

        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>

      <h1 className="gallery-title">{t.pageTitle}</h1>

      {GALLERY_ITEMS.length === 0 ? (
        <p className="gallery-empty">{t.emptyState}</p>
      ) : (
        <div className="gallery-container">
          <ul className="gallery-grid">
            {GALLERY_ITEMS.map((item) => (
              <li key={item.id} className="gallery-item">
                {item.type === "video" ? (
                  <>
                    <video
                      className="gallery-item-media"
                      poster={item.thumbnail}
                      controls
                      preload="none"
                    >
                      <source src={item.src} type="video/mp4" />
                    </video>
                    <div className="gallery-item-overlay">
                      <div className="gallery-play-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={item.src}
                      alt={item.brand || "Gallery item"}
                      className="gallery-item-media"
                    />
                    <div className="gallery-item-overlay" />
                  </>
                )}

                {item.brand && (
                  <div className="gallery-brand">{item.brand}</div>
                )}

                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="gallery-item-link" title={item.brand} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Instagram Pentax Europe",
        url: `https://thegirlwithacamera.com/${lang}/seen/instagram-pentax-europe`,
      })}} />
    </main>
  );
}
