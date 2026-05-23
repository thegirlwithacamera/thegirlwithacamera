import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSeriesBySlug, series } from "@/lib/series";
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
    <main style={{ background: "#ffffff" }}>
      <style>{`
        .serie-cover { width: 100%; aspect-ratio: 16/9; overflow: hidden; background: #f0f0f0; }
        .serie-photos { max-width: 1280px; margin: 0 auto; padding: 40px 20px; }
        .back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; letter-spacing: 0.1em; text-decoration: none; color: #0a0a0a; padding: 20px; }
        .back-link:hover { opacity: 0.7; }
        @media(max-width:767px) {
          .serie-photos { padding: 24px 16px; }
        }
      `}</style>

      {/* Back link */}
      <Link href={`/${lang}/gallery`} className="back-link">
        ← {lang === "fr" ? "Retour" : "Back"}
      </Link>

      {/* Cover photo */}
      <div className="serie-cover">
        <Image
          src={s.cover}
          alt={s.title}
          fill
          priority
          sizes="100vw"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Lightbox */}
      {s.photos.length > 0 && (
        <div className="serie-photos">
          <Lightbox photos={s.photos} alt={s.title} lang={lang} />
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
