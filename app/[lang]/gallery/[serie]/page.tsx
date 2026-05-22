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
      <div className="px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-[#ebebeb] pb-10">
            <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "#b0b0b0" }}>{s.year}</p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none mb-8">
              {s.title}
            </h1>
            <p className="max-w-xl leading-relaxed text-sm md:text-base" style={{ color: "#6a6a6a" }}>
              {s.description[lang]}
            </p>
          </div>
        </div>
      </div>

      {/* Cover — sans cadre */}
      <div className="px-6 mb-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative aspect-[3/2] overflow-hidden bg-[#f0f0f0]">
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

      {/* Photos via lightbox */}
      {s.photos.length > 0 ? (
        <div className="px-6 mt-6">
          <Lightbox photos={s.photos} alt={s.title} lang={lang} />
        </div>
      ) : (
        <div className="px-6 mt-12 text-center text-xs tracking-widest uppercase" style={{ color: "#b0b0b0" }}>
          {isFr ? "Photos à venir" : "Photos coming soon"}
        </div>
      )}

      {/* Prev / next series avec thumbnail */}
      <nav className="px-6 mt-24 max-w-6xl mx-auto border-t border-[#ebebeb] pt-10 grid grid-cols-2 gap-6">
        {prev && (
          <Link href={`/${lang}/gallery/${prev.slug}`} className="group flex items-center gap-4">
            <div className="relative w-16 h-12 overflow-hidden bg-[#f0f0f0] flex-shrink-0">
              <Image src={prev.cover} alt={prev.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="64px" />
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#b0b0b0" }}>← {isFr ? "Précédente" : "Previous"}</p>
              <p className="font-serif font-bold" style={{ fontSize: "15px", color: "#0a0a0a" }}>{prev.title}</p>
            </div>
          </Link>
        )}
        {next && (
          <Link href={`/${lang}/gallery/${next.slug}`} className="group flex items-center gap-4 justify-end text-right">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#b0b0b0" }}>{isFr ? "Suivante" : "Next"} →</p>
              <p className="font-serif font-bold" style={{ fontSize: "15px", color: "#0a0a0a" }}>{next.title}</p>
            </div>
            <div className="relative w-16 h-12 overflow-hidden bg-[#f0f0f0] flex-shrink-0">
              <Image src={next.cover} alt={next.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="64px" />
            </div>
          </Link>
        )}
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
