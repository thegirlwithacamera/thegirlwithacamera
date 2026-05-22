import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSeriesBySlug, getAdjacentSeries, series } from "@/lib/series";
import { site } from "@/lib/site";
import Lightbox from "../../components/Lightbox";

interface Props {
  params: Promise<{ lang: "fr" | "en"; serie: string }>;
}

export async function generateStaticParams() {
  return series.flatMap((s) => [
    { lang: "fr", serie: s.slug },
    { lang: "en", serie: s.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, serie } = await params;
  const s = getSeriesBySlug(serie);
  if (!s) return {};
  return {
    title: `${s.title} (${s.year})`,
    description: s.description[lang],
    alternates: {
      canonical: `/${lang}/gallery/${s.slug}`,
      languages: {
        fr: `/fr/gallery/${s.slug}`,
        en: `/en/gallery/${s.slug}`,
      },
    },
    openGraph: {
      title: `${s.title} · ${site.name}`,
      description: s.description[lang],
      images: [{ url: s.cover, alt: s.title }],
      type: "article",
    },
  };
}

export default async function SeriePage({ params }: Props) {
  const { lang, serie } = await params;
  const s = getSeriesBySlug(serie);
  if (!s) notFound();
  const { prev, next } = getAdjacentSeries(serie);
  const isFr = lang === "fr";

  // Schema.org ImageGallery for SEO image surfaces.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: s.title,
    description: s.description[lang],
    creator: { "@type": "Person", name: site.name, url: site.url },
    datePublished: s.year,
    image: [s.cover, ...s.photos].map((src) => `${site.url}${src}`),
  };

  return (
    <main style={{ paddingTop: "64px" }}>
      <style>{`
        @media(max-width:768px){
          .serie-header { padding: 40px 24px 36px !important; }
          .serie-cover { margin: 0 !important; }
          .serie-photos { padding: 40px 24px 64px !important; }
          .serie-nav { padding: 32px 24px 64px !important; flex-direction: column !important; gap: 24px !important; }
          .serie-nav-next { text-align: left !important; flex-direction: row !important; justify-content: flex-start !important; }
        }
      `}</style>

      {/* BREADCRUMB éditorial */}
      <div style={{ padding: "20px 64px 0", maxWidth: "1280px", margin: "0 auto" }}>
        <nav aria-label="Breadcrumb">
          <ol style={{ display: "flex", gap: "8px", alignItems: "center", listStyle: "none", margin: 0, padding: 0 }}>
            <li>
              <Link href={`/${lang}/gallery`} style={{ fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#b0b0b0", textDecoration: "none" }}>
                {isFr ? "Séries" : "Series"}
              </Link>
            </li>
            <li style={{ color: "#d4d4d4", fontSize: "8px" }}>—</li>
            <li style={{ fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#0a0a0a", fontWeight: 600 }}>{s.title}</li>
          </ol>
        </nav>
      </div>

      {/* HEADER éditorial — titre géant + méta */}
      <section className="serie-header" style={{ padding: "48px 64px 40px", maxWidth: "1280px", margin: "0 auto", borderBottom: "1px solid #ebebeb" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "32px", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#b0b0b0", fontWeight: 600, marginBottom: "16px" }}>
              {s.year} · {s.photos.length} {isFr ? "photos" : "photos"}
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(40px, 6vw, 88px)",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "#0a0a0a",
            }}>
              {s.title}
            </h1>
          </div>
          <p style={{ fontSize: "13px", color: "#9a9a9a", lineHeight: 1.8, maxWidth: "360px", paddingBottom: "6px" }}>
            {s.description[lang]}
          </p>
        </div>
      </section>

      {/* COVER PHOTO pleine largeur */}
      <div className="serie-cover" style={{ margin: "0 0" }}>
        <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "#f0f0f0" }}>
          <Image
            src={s.cover}
            alt={`${s.title}, ${isFr ? "image de couverture" : "cover image"}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      {/* PHOTOS via lightbox */}
      {s.photos.length > 0 ? (
        <div className="serie-photos" style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 64px 96px" }}>
          <Lightbox photos={s.photos} alt={s.title} lang={lang} />
        </div>
      ) : (
        <div style={{ padding: "80px 64px", textAlign: "center" }}>
          <p style={{ fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c8c8c8" }}>
            {isFr ? "Photos à venir" : "Photos coming soon"}
          </p>
        </div>
      )}

      {/* PREV / NEXT éditorial */}
      <div className="serie-nav" style={{ borderTop: "1px solid #ebebeb", display: "flex", justifyContent: "space-between", padding: "40px 64px 80px", maxWidth: "1280px", margin: "0 auto", gap: "24px" }}>
        {prev ? (
          <Link href={`/${lang}/gallery/${prev.slug}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "20px" }} className="serie-nav-prev group">
            <div style={{ position: "relative", width: "80px", height: "60px", overflow: "hidden", background: "#f0f0f0", flexShrink: 0 }}>
              <Image src={prev.cover} alt={prev.title} fill className="object-cover" style={{ transition: "transform 0.5s ease" }} sizes="80px" />
            </div>
            <div>
              <p style={{ fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#b0b0b0", marginBottom: "6px" }}>
                ← {isFr ? "Précédente" : "Previous"}
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.01em" }}>
                {prev.title}
              </p>
            </div>
          </Link>
        ) : <div />}

        {next ? (
          <Link href={`/${lang}/gallery/${next.slug}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "20px", textAlign: "right", justifyContent: "flex-end" }} className="serie-nav-next group">
            <div>
              <p style={{ fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#b0b0b0", marginBottom: "6px" }}>
                {isFr ? "Suivante" : "Next"} →
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.01em" }}>
                {next.title}
              </p>
            </div>
            <div style={{ position: "relative", width: "80px", height: "60px", overflow: "hidden", background: "#f0f0f0", flexShrink: 0 }}>
              <Image src={next.cover} alt={next.title} fill className="object-cover" style={{ transition: "transform 0.5s ease" }} sizes="80px" />
            </div>
          </Link>
        ) : <div />}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
