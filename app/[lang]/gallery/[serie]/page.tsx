import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesBySlug } from "@/lib/series";

interface Props {
  params: Promise<{ lang: "fr" | "en"; serie: string }>;
}

export default async function SeriePage({ params }: Props) {
  const { lang, serie } = await params;
  const s = getSeriesBySlug(serie);

  if (!s) notFound();

  return (
    <div className="pt-32 pb-24">

      {/* Header */}
      <div className="px-6 mb-16">
        <div className="max-w-6xl mx-auto">
          <Link
            href={`/${lang}/gallery`}
            className="text-xs tracking-widest uppercase text-[#737373] hover:text-black transition-colors mb-10 inline-block"
          >
            ← {lang === "fr" ? "Séries" : "Series"}
          </Link>

          <div className="mt-6 border-b border-[#e5e5e5] pb-10">
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
                alt={s.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Photos */}
      {s.photos.length > 0 && (
        <div className="px-6 mt-8">
          <div
            className="max-w-6xl mx-auto columns-1 md:columns-2"
            style={{ columnGap: "1rem" }}
          >
            {s.photos.map((src, i) => (
              <div
                key={i}
                className="border border-[#d4d4d4] p-3 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] mb-4 break-inside-avoid"
              >
                <Image
                  src={src}
                  alt={`${s.title} ${i + 1}`}
                  width={1200}
                  height={1200}
                  className="w-full h-auto block bg-[#f5f5f5]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder si pas encore de photos */}
      {s.photos.length === 0 && (
        <div className="px-6 mt-12 text-center text-xs tracking-widest uppercase text-[#b5b5b5]">
          {lang === "fr" ? "Photos à venir" : "Photos coming soon"}
        </div>
      )}

    </div>
  );
}
