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
    <div className="pt-32 pb-24">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-6 mb-8">
        <ol className="max-w-6xl mx-auto flex flex-wrap gap-2 text-xs tracking-[0.2em] uppercase text-[#737373]">
          <li><Link className="hover:text-black" href={`/${lang}`}>{isFr ? "Accueil" : "Home"}</Link></li>
          <li aria-hidden>/</li>
          <li><Link className="hover:text-black" href={`/${lang}/gallery`}>{isFr ? "Séries" : "Series"}</Link></li>
          <li aria-hidden>/</li>
          <li className="text-black">{s.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="px-6 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-[#e5e5e5] pb-10">
            <p className="text-xs tracking-[0.25em] uppercase text-[#737373] mb-3">{s.year}</p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none mb-8">
              {s.title}
            </h1>
            <p className="max-w-xl text-[#525252] leading-relaxed text-sm md:text-base">
              {s.description[lang]}
            </p>
          </div>
        </div>
      </div>

      {/* Cover */}
      <div className="px-6 mb-4">
        <div className="max-w-6xl mx-auto">
          <div className="border border-[#d4d4d4] p-3 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="relative aspect-[3/2] overflow-hidden bg-[#f5f5f5]">
              <Image
                src={s.cover}
                alt={`${s.title}, ${isFr ? "image de couverture" : "cover image"}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Photos via lightbox */}
      {s.photos.length > 0 ? (
        <div className="px-6 mt-8">
          <Lightbox photos={s.photos} alt={s.title} lang={lang} />
        </div>
      ) : (
        <div className="px-6 mt-12 text-center text-xs tracking-widest uppercase text-[#b5b5b5]">
          {isFr ? "Photos à venir" : "Photos coming soon"}
        </div>
      )}

      {/* Prev / next series */}
      <nav className="px-6 mt-24 max-w-6xl mx-auto border-t border-[#e5e5e5] pt-10 grid grid-cols-2 gap-6">
        {prev && (
          <Link href={`/${lang}/gallery/${prev.slug}`} className="group block">
            <p className="text-xs tracking-[0.2em] uppercase text-[#737373] mb-2">← {isFr ? "Précédente" : "Previous"}</p>
            <p className="font-serif text-xl font-bold group-hover:text-[#525252]">{prev.title}</p>
          </Link>
        )}
        {next && (
          <Link href={`/${lang}/gallery/${next.slug}`} className="group block text-right">
            <p className="text-xs tracking-[0.2em] uppercase text-[#737373] mb-2">{isFr ? "Suivante" : "Next"} →</p>
            <p className="font-serif text-xl font-bold group-hover:text-[#525252]">{next.title}</p>
          </Link>
        )}
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
