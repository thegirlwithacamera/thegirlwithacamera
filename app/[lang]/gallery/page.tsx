import Image from "next/image";
import Link from "next/link";
import { series } from "@/lib/series";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export default async function GalleryPage({ params }: Props) {
  const { lang } = await params;

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-20 border-b border-[#e5e5e5] pb-8">
          <h1 className="font-serif text-5xl md:text-6xl font-bold">
            {lang === "fr" ? "Séries" : "Series"}
          </h1>
        </div>

        {/* Series grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {series.map((s) => (
            <Link
              key={s.slug}
              href={`/${lang}/gallery/${s.slug}`}
              className="group block"
            >
              {/* Frame */}
              <div className="border border-[#d4d4d4] p-3 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-shadow duration-400">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                  <Image
                    src={s.cover}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>

              {/* Label */}
              <div className="mt-4 text-center">
                <p className="font-serif text-lg font-bold tracking-wide">{s.title}</p>
                <p className="mt-1 text-xs tracking-[0.2em] uppercase text-[#737373]">{s.year}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
