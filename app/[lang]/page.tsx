import Image from "next/image";
import Link from "next/link";

const galleryImages = [
  { id: 1,  src: "/images/galerie/R0010544.JPG",              alt: "Street", category: "Street" },
  { id: 2,  src: "/images/galerie/IMG_2246.JPG",              alt: "Film",   category: "Film"   },
  { id: 3,  src: "/images/galerie/IMG_1921.JPG",              alt: "Street", category: "Street" },
  { id: 4,  src: "/images/galerie/IMG_2309.JPG",              alt: "Film",   category: "Film"   },
  { id: 5,  src: "/images/galerie/R0010729.JPG",              alt: "Street", category: "Street" },
  { id: 6,  src: "/images/galerie/IMG_2031.JPG",              alt: "Street", category: "Street" },
  { id: 7,  src: "/images/galerie/IMG_2348.JPG",              alt: "Film",   category: "Film"   },
  { id: 8,  src: "/images/galerie/1762191195000_R0012313.JPG",alt: "Street", category: "Street" },
  { id: 9,  src: "/images/galerie/IMG_2353.JPG",              alt: "Film",   category: "Film"   },
  { id: 10, src: "/images/galerie/IMG_2040.JPG",              alt: "Street", category: "Street" },
  { id: 11, src: "/images/galerie/IMG_2363.JPG",              alt: "Film",   category: "Film"   },
  { id: 12, src: "/images/galerie/IMG_9032.JPG",              alt: "Street", category: "Street" },
];

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const isFrench = lang === "fr";

  return (
    <div>
      {/* Hero */}
      <section className="h-[60vh] flex flex-col justify-end px-6 md:px-16 pb-16 pt-24 border-b border-[#e5e5e5]">
        <div className="max-w-7xl w-full mx-auto flex flex-col justify-end h-full">
          <h1 className="font-serif text-[clamp(3.5rem,10vw,10rem)] font-bold leading-none tracking-tight">
            THE GIRL<br />WITH A CAMERA
          </h1>
          <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <p className="text-xs tracking-[0.3em] uppercase text-[#737373]">
              Sandrine Ceuppens
            </p>
            <p className="text-xs tracking-[0.2em] uppercase text-[#737373]">
              {isFrench ? "Photographe & Créatrice de contenu, Bruxelles" : "Photographer & Content Creator, Brussels"}
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#e5e5e5]">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden bg-[#f5f5f5] image-overlay"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs tracking-widest uppercase">{image.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="py-24 px-6 border-t border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[3/4] bg-[#f5f5f5] overflow-hidden relative">
            <Image
              src="/images/about-preview.jpg"
              alt="Sandrine Ceuppens"
              fill
              className="object-cover"
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
                ? "Je photographie les rues, la lumière, les moments qu'on ne remarque pas. Mon travail se situe à la croisée du documentaire et de la mode, avec une approche instinctive et un post-traitement minimal. Basée à Bruxelles, je travaille avec Ricoh et Pentax Europe, et je construis un corpus de séries personnelles."
                : "I photograph streets, light, and moments that go unnoticed. My work sits at the intersection of documentary and fashion. Instinctive, barely edited. Based in Brussels, I work with Ricoh and Pentax Europe, and I'm building a body of personal series."}
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
