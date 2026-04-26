import Image from "next/image";
import Link from "next/link";
import { series } from "@/lib/series";
import { site } from "@/lib/site";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const isFrench = lang === "fr";
  const featuredSeries = series.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="min-h-[80vh] flex flex-col justify-end px-6 md:px-16 pb-16 pt-32 border-b border-[#e5e5e5]">
        <div className="max-w-7xl w-full mx-auto flex flex-col justify-end h-full">
          <p className="text-xs tracking-[0.3em] uppercase text-[#737373] mb-6">
            {isFrench ? "Photographe & créatrice de contenu — Bruxelles" : "Photographer & content creator — Brussels"}
          </p>
          <h1 className="font-serif text-[clamp(3rem,9vw,9rem)] font-bold leading-[0.95] tracking-tight">
            THE GIRL<br />WITH A CAMERA
          </h1>
          <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <p className="max-w-xl text-base md:text-lg text-[#525252] leading-relaxed">
              {isFrench
                ? "Je photographie le réel — rues, lumière, gens au travail — et je conçois du contenu vidéo pour les marques qui veulent sortir du moule."
                : "I photograph the real — streets, light, people at work — and craft video content for brands that want to step out of the mould."}
            </p>
            <div className="flex gap-4">
              <Link
                href={`/${lang}/services`}
                className="inline-block px-8 py-3 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-[#333] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                {isFrench ? "Travailler avec moi" : "Work with me"}
              </Link>
              <Link
                href={`/${lang}/gallery`}
                className="inline-block px-8 py-3 border border-black text-black text-xs font-medium tracking-widest uppercase hover:bg-black hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                {isFrench ? "Voir les séries" : "View the series"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-12 px-6 border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs tracking-[0.3em] uppercase text-[#737373]">
            {isFrench ? "Collaborations" : "Selected collaborations"}
          </p>
          <ul className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {site.partners.map((p) => (
              <li key={p.name} className="font-serif text-lg text-[#525252]">
                {p.name}
              </li>
            ))}
            <li className="text-sm text-[#a3a3a3] italic">
              {isFrench ? "& projets éditoriaux indépendants" : "& independent editorial projects"}
            </li>
          </ul>
        </div>
      </section>

      {/* Featured series */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 border-b border-[#e5e5e5] pb-6">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#737373] mb-3">
                {isFrench ? "Travail récent" : "Recent work"}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold">
                {isFrench ? "Séries en cours" : "Current series"}
              </h2>
            </div>
            <Link
              href={`/${lang}/gallery`}
              className="hidden md:inline-block text-xs tracking-widest uppercase text-[#525252] hover:text-black border-b border-[#525252] hover:border-black pb-1"
            >
              {isFrench ? "Voir tout" : "See all"} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredSeries.map((s) => (
              <Link key={s.slug} href={`/${lang}/gallery/${s.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5] mb-4">
                  <Image
                    src={s.cover}
                    alt={`${s.title} — ${isFrench ? "série de" : "series by"} Sandrine Ceuppens`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#737373] mb-2">{s.year}</p>
                <h3 className="font-serif text-2xl font-bold group-hover:text-[#525252] transition-colors">
                  {s.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services teaser */}
      <section className="py-24 px-6 border-t border-[#e5e5e5] bg-[#fafafa]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#737373] mb-3">Services</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
                {isFrench ? "Trois façons de travailler ensemble." : "Three ways to work together."}
              </h2>
              <Link
                href={`/${lang}/services`}
                className="inline-block text-xs tracking-widest uppercase border-b-2 border-black pb-1 hover:opacity-70"
              >
                {isFrench ? "Voir les offres" : "View offers"} →
              </Link>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div>
                <h3 className="font-serif text-xl font-bold mb-3">{isFrench ? "Brand content" : "Brand content"}</h3>
                <p className="text-[#525252] leading-relaxed">
                  {isFrench
                    ? "Vidéo + photo pour réseaux sociaux. Concept, tournage, montage. Packs mensuels ou one-shot."
                    : "Video + stills for social. Concept, shoot, edit. Monthly packs or one-shot."}
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold mb-3">{isFrench ? "Éditorial" : "Editorial"}</h3>
                <p className="text-[#525252] leading-relaxed">
                  {isFrench
                    ? "Séries documentaires et mode pour magazines, livres, expositions."
                    : "Documentary and fashion series for magazines, books, exhibitions."}
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold mb-3">{isFrench ? "Tirages & mentorat" : "Prints & mentoring"}</h3>
                <p className="text-[#525252] leading-relaxed">
                  {isFrench
                    ? "Tirages limités sur demande. Mentorat 1:1 pour photographes en construction."
                    : "Limited prints on request. 1:1 mentoring for photographers finding their voice."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="py-24 px-6 border-t border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[3/4] bg-[#f5f5f5] overflow-hidden relative">
            <Image
              src="/images/about-preview.jpg"
              alt={isFrench ? "Portrait de Sandrine Ceuppens, photographe basée à Bruxelles" : "Portrait of Sandrine Ceuppens, photographer based in Brussels"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#737373] mb-6">
              {isFrench ? "À propos" : "About"}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 leading-tight">
              {isFrench
                ? "Des instants réels, façonnés par l'instinct et l'esthétique."
                : "Real moments, shaped by instinct and aesthetics."}
            </h2>
            <p className="text-[#525252] leading-relaxed mb-10">
              {isFrench
                ? "Je photographie les rues, la lumière, les moments qu'on ne remarque pas. Documentaire et mode. Approche instinctive, post-traitement minimal. Basée à Bruxelles, en collaboration avec Ricoh et Pentax Europe."
                : "I photograph streets, light, and moments that go unnoticed. Documentary and fashion. Instinctive, barely edited. Based in Brussels, in collaboration with Ricoh and Pentax Europe."}
            </p>
            <Link
              href={`/${lang}/about`}
              className="inline-block px-8 py-3 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-[#333] transition-colors"
            >
              {isFrench ? "En savoir plus" : "Learn more"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
