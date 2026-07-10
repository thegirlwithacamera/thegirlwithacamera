import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedTrips, getTripBySlug } from "@/lib/diary";
import NewsletterCta from "./NewsletterCta";

// Boutique hors ligne : on masque le lien vers les tirages.
// Remettre a false en meme temps que app/[lang]/shop/page.tsx.
const SHOP_OFFLINE = true;

interface Props {
  params: Promise<{ lang: "fr" | "en"; slug: string }>;
}

export function generateStaticParams() {
  const langs: Array<"fr" | "en"> = ["fr", "en"];
  return langs.flatMap((lang) =>
    getPublishedTrips().map((trip) => ({ lang, slug: trip.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip) return {};
  const title = `${trip.destination} · Diary`;
  const description = trip.intro[lang] || `${trip.destination}, ${trip.location[lang]}.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/diary/${slug}`,
      languages: { fr: `/fr/diary/${slug}`, en: `/en/diary/${slug}` },
    },
  };
}

const copy = {
  fr: { prints: "Voir les tirages de cette série", back: "Retour au Diary" },
  en: { prints: "See the prints from this series", back: "Back to Diary" },
};

export default async function TripPage({ params }: Props) {
  const { lang, slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip || trip.status !== "published") notFound();

  const t = copy[lang];

  return (
    <>
      <style>{`
        .trip-hero {
          position: relative;
          width: 100%;
          height: 72vh;
          min-height: 420px;
          overflow: hidden;
          background: #0a0a0a;
        }
        .trip-hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .trip-hero-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 24px;
          background: linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.45));
          color: #ffffff;
        }
        .trip-kicker {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          margin: 0 0 16px;
        }
        .trip-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 56px;
          line-height: 1;
          color: #ffffff;
          margin: 0 0 14px;
        }
        .trip-sub {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
          margin: 0;
        }
        .trip-lede {
          max-width: 620px;
          margin: 48px auto 0;
          padding: 0 24px;
          text-align: center;
          font-family: var(--font-serif), Georgia, serif;
          font-size: 18px;
          font-style: italic;
          line-height: 1.7;
          color: #333333;
        }

        .essay { max-width: 720px; margin: 0 auto; padding: 0 24px; }
        .essay-text {
          font-size: 15px;
          line-height: 1.9;
          letter-spacing: 0.01em;
          color: #1a1a1a;
          margin: 44px 0;
        }
        .essay-figure { margin: 56px 0; }
        .essay-figure img { width: 100%; height: auto; display: block; }
        .essay-caption {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #999999;
          text-align: center;
          margin-top: 10px;
        }

        .trip-ctas {
          border-top: 1px solid #ebebeb;
          margin-top: 40px;
          padding: 64px 24px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 56px;
        }
        .trip-prints-link {
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 1px solid #0a0a0a;
          padding-bottom: 3px;
        }
        .trip-back {
          display: block;
          text-align: center;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999999;
          text-decoration: none;
          margin: 48px 0 0;
        }

        @media (max-width: 767px) {
          .trip-hero { height: 60vh; min-height: 360px; }
          .trip-title { font-size: 38px; }
          .trip-lede { font-size: 16px; margin-top: 36px; }
          .essay-text { font-size: 15px; margin: 32px 0; }
          .essay-figure { margin: 40px 0; }
        }
      `}</style>

      <main style={{ paddingBottom: "60px", background: "#ffffff" }}>
        {/* Hero */}
        <div className="trip-hero">
          <Image
            src={trip.cover}
            alt={`${trip.destination}, ${trip.location[lang]}`}
            width={1600}
            height={1000}
            priority
            sizes="100vw"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="trip-hero-overlay">
            <p className="trip-kicker">{trip.kicker}</p>
            <h1 className="trip-title">{trip.destination}</h1>
            <p className="trip-sub">{trip.location[lang]} · {trip.year}</p>
          </div>
        </div>

        {/* Chapeau */}
        {trip.intro[lang] && <p className="trip-lede">{trip.intro[lang]}</p>}

        {/* Photo essai */}
        <article className="essay">
          {trip.essay.map((block, i) => {
            if (block.type === "text") {
              return <p key={i} className="essay-text">{block.content[lang]}</p>;
            }
            return (
              <figure key={i} className="essay-figure">
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={1440}
                  height={1800}
                  sizes="(max-width: 767px) 100vw, 720px"
                  style={{ width: "100%", height: "auto" }}
                />
                {block.caption && <figcaption className="essay-caption">{block.caption[lang]}</figcaption>}
              </figure>
            );
          })}
        </article>

        {/* CTA : tirages + newsletter.
            Lien tirages masque tant que la boutique est hors ligne
            (voir SHOP_OFFLINE dans app/[lang]/shop/page.tsx). */}
        <div className="trip-ctas">
          {SHOP_OFFLINE ? null : (
            <Link href={`/${lang}${trip.printsHref}`} className="trip-prints-link">
              {t.prints}
            </Link>
          )}
          <NewsletterCta lang={lang} />
        </div>

        <Link href={`/${lang}/diary`} className="trip-back">
          {t.back}
        </Link>
      </main>
    </>
  );
}
