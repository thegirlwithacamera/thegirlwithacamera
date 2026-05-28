import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Seen" : "Seen",
    description: lang === "fr"
      ? "Contenus créés pour les marques. Ricoh Europe, Pentax Europe."
      : "Brand content gallery. Ricoh Europe, Pentax Europe.",
    alternates: {
      canonical: `/${lang}/seen`,
      languages: { fr: "/fr/seen", en: "/en/seen" }
    },
  };
}

const content = {
  fr: {
    pageTitle: "SEEN IN",
    categories: [
      {
        id: "ricoh-social-media",
        title: "RICOH SOCIAL MEDIA",
        description: "8 contenus",
        image: "/images/seen/RICOH%20EU.JPG",
      },
      {
        id: "pentax-social-media",
        title: "PENTAX SOCIAL MEDIA",
        description: "5 contenus",
        image: "/images/seen/PENTAX%20EU.JPG",
      },
    ],
  },
  en: {
    pageTitle: "SEEN IN",
    categories: [
      {
        id: "ricoh-social-media",
        title: "RICOH SOCIAL MEDIA",
        description: "8 contents",
        image: "/images/seen/RICOH%20EU.JPG",
      },
      {
        id: "pentax-social-media",
        title: "PENTAX SOCIAL MEDIA",
        description: "5 contents",
        image: "/images/seen/PENTAX%20EU.JPG",
      },
    ],
  },
};

export default async function SeenPage({ params }: Props) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <main style={{ paddingTop: "60px", paddingBottom: "80px", background: "#ffffff" }}>
      <style>{`
        .seen-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .seen-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin: 0;
          list-style: none;
          padding: 0;
        }

        .seen-card {
          position: relative;
          aspect-ratio: 1;
          background: #f5f5f5;
          border: 1px solid #ebebeb;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .seen-card:hover {
          border-color: #999999;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .seen-card-link {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 24px;
          z-index: 1;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
        }

        .seen-card-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: #ffffff;
          text-align: left;
          background: transparent;
          padding: 0;
          border-radius: 0;
          text-transform: uppercase;
          margin: 0 0 8px 0;
        }

        .seen-card-desc {
          font-size: 11px;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.9);
          text-align: left;
          background: transparent;
          padding: 0;
          border-radius: 0;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .seen-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 767px) {
          .seen-title {
            font-size: 10px;
            margin-bottom: 32px;
          }

          .seen-container {
            padding: 0 20px;
          }

          .seen-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .seen-card {
            border-radius: 8px;
          }
        }
      `}</style>

      <div className="seen-container">
        <ul className="seen-grid">
          {t.categories.map((cat) => (
            <li key={cat.id} className="seen-card" style={{ backgroundImage: `url(${cat.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <Link href={`/${lang}/seen/${cat.id}`} className="seen-card-link">
                <span className="seen-card-title">{cat.title}</span>
                <span className="seen-card-desc">{cat.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Seen",
        description: lang === "fr" ? "Contenus créés pour les marques" : "Brand content gallery",
        url: `https://thegirlwithacamera.com/${lang}/seen`,
      })}} />
    </main>
  );
}
