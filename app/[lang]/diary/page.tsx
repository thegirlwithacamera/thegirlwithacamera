import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { trips } from "@/lib/diary";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Diary",
    description:
      lang === "fr"
        ? "Carnet de voyage de Sandrine Ceuppens. Des series photographiques par destination : Tokyo, Sicile, Liège. Photo essais entre rue et documentaire."
        : "Travel diary by Sandrine Ceuppens. Photographic series by destination: Tokyo, Sicily, Liège. Photo essays between street and documentary.",
    alternates: { canonical: `/${lang}/diary`, languages: { fr: "/fr/diary", en: "/en/diary" } },
  };
}

const copy = {
  fr: { intro: "Carnet de voyage. Des series par destination.", soon: "Bientôt" },
  en: { intro: "A travel diary. Series by destination.", soon: "Soon" },
};

export default async function DiaryPage({ params }: Props) {
  const { lang } = await params;
  const t = copy[lang];

  return (
    <>
      <style>{`
        .diary-intro {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #999999;
          text-align: center;
          margin: 8px auto 44px;
        }
        .diary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .diary-card { display: block; text-decoration: none; }
        .diary-cover {
          aspect-ratio: 4 / 5;
          overflow: hidden;
          position: relative;
          background: #0a0a0a;
        }
        .diary-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .diary-card:hover .diary-cover img { transform: scale(1.04); }
        .diary-cover--soon {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
        }
        .diary-soon-tag {
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #8c8880;
        }
        .diary-meta { text-align: center; padding: 16px 8px 0; }
        .diary-dest {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 22px;
          color: #0a0a0a;
          margin: 0 0 4px;
        }
        .diary-sub {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999999;
          margin: 0;
        }
        @media (max-width: 767px) {
          .diary-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; padding: 0 12px; }
          .diary-dest { font-size: 17px; }
          .diary-intro { margin-bottom: 28px; }
        }
      `}</style>

      <main style={{ paddingTop: "16px", paddingBottom: "24px", background: "#ffffff" }}>
        <p className="diary-intro">{t.intro}</p>

        <div className="diary-grid">
          {trips.map((trip) => {
            const meta = (
              <div className="diary-meta">
                <p className="diary-dest">{trip.destination}</p>
                <p className="diary-sub">{trip.location[lang]} · {trip.year}</p>
              </div>
            );

            if (trip.status === "soon") {
              return (
                <div key={trip.slug} className="diary-card" aria-disabled="true">
                  <div className="diary-cover diary-cover--soon">
                    <span className="diary-soon-tag">{t.soon}</span>
                  </div>
                  {meta}
                </div>
              );
            }

            return (
              <Link key={trip.slug} href={`/${lang}/diary/${trip.slug}`} className="diary-card">
                <div className="diary-cover">
                  <Image
                    src={trip.cover}
                    alt={`${trip.destination}, ${trip.location[lang]}`}
                    width={800}
                    height={1000}
                    sizes="(max-width: 767px) 50vw, 420px"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                {meta}
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
