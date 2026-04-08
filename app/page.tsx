import Image from "next/image";
import Link from "next/link";

// Placeholder images - à remplacer par tes vraies photos
const featuredProjects = [
  {
    id: 1,
    title: "Portrait Editorial",
    category: "Portrait",
    image: "/images/portfolio/portrait-1.jpg",
    href: "/portfolio/portraits",
  },
  {
    id: 2,
    title: "Fashion Week",
    category: "Mode",
    image: "/images/portfolio/fashion-1.jpg",
    href: "/portfolio/mode",
  },
  {
    id: 3,
    title: "Urban Stories",
    category: "Street",
    image: "/images/portfolio/street-1.jpg",
    href: "/portfolio/street",
  },
  {
    id: 4,
    title: "Natural Light",
    category: "Lifestyle",
    image: "/images/portfolio/lifestyle-1.jpg",
    href: "/portfolio/lifestyle",
  },
  {
    id: 5,
    title: "Studio Sessions",
    category: "Studio",
    image: "/images/portfolio/studio-1.jpg",
    href: "/portfolio/studio",
  },
  {
    id: 6,
    title: "Creative Direction",
    category: "Création",
    image: "/images/portfolio/creative-1.jpg",
    href: "/creation",
  },
];

const latestArticles = [
  {
    id: 1,
    title: "Les coulisses de ma dernière séance photo",
    excerpt: "Découvrez le processus créatif derrière cette série éditoriale...",
    date: "8 Avril 2026",
    href: "/blog/coulisses-seance-photo",
  },
  {
    id: 2,
    title: "Mon équipement photo pour 2026",
    excerpt: "Tour d'horizon du matériel que j'utilise au quotidien...",
    date: "1 Avril 2026",
    href: "/blog/equipement-2026",
  },
  {
    id: 3,
    title: "5 conseils pour réussir ses portraits en lumière naturelle",
    excerpt: "Mes astuces pour sublimer vos sujets avec la lumière du jour...",
    date: "25 Mars 2026",
    href: "/blog/portraits-lumiere-naturelle",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image placeholder */}
        <div className="absolute inset-0 bg-[#f5f5f5]">
          <Image
            src="/images/hero-bg.jpg"
            alt="The Girl With A Camera"
            fill
            className="object-cover opacity-80"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 text-[#525252]">
            Sandrine CPPNS
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            THE GIRL WITH<br />A CAMERA
          </h1>
          <p className="text-lg md:text-xl text-[#525252] max-w-xl mx-auto font-light">
            Photographe & Créatrice de contenu
          </p>
          <div className="mt-8">
            <Link
              href="/portfolio"
              className="inline-block px-8 py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-[#333] transition-colors"
            >
              DÉCOUVRIR MON TRAVAIL
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 5V19M12 19L5 12M12 19L19 12" />
          </svg>
        </div>
      </section>

      {/* Featured Portfolio Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Portfolio Sélectionné
            </h2>
            <p className="text-[#737373] text-lg max-w-2xl mx-auto">
              Une sélection de mes travaux en photographie et création de contenu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProjects.map((project, index) => (
              <Link
                key={project.id}
                href={project.href}
                className={`group relative aspect-[3/4] overflow-hidden bg-[#f5f5f5] image-overlay ${
                  index === 0 ? "md:col-span-2 md:aspect-[16/9]" : ""
                }`}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-xs tracking-widest uppercase mb-2">
                      {project.category}
                    </p>
                    <h3 className="font-serif text-2xl font-bold">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-block px-8 py-3 border-2 border-black text-black text-sm font-medium tracking-wide hover:bg-black hover:text-white transition-colors"
            >
              VOIR TOUT LE PORTFOLIO
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-24 px-6 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Derniers Articles
              </h2>
              <p className="text-[#737373] text-lg">
                Conseils, coulisses et réflexions
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-block text-sm font-medium tracking-wide border-b-2 border-black pb-1 hover:opacity-70 transition-opacity"
            >
              Voir tous les articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <Link key={article.id} href={article.href} className="group">
                <div className="aspect-[4/3] bg-[#e5e5e5] mb-4 overflow-hidden">
                  <Image
                    src={`/images/blog/article-${article.id}.jpg`}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs text-[#737373] tracking-wide mb-2">
                  {article.date}
                </p>
                <h3 className="font-serif text-xl font-bold mb-2 group-hover:underline">
                  {article.title}
                </h3>
                <p className="text-[#737373] text-sm leading-relaxed">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link
              href="/blog"
              className="inline-block text-sm font-medium tracking-wide border-b-2 border-black pb-1"
            >
              Voir tous les articles →
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[3/4] bg-[#f5f5f5] overflow-hidden">
              <Image
                src="/images/about-preview.jpg"
                alt="Sandrine CPPNS"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-[#737373] mb-4">
                À propos
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                L'œil derrière<br />l'objectif
              </h2>
              <p className="text-[#525252] leading-relaxed mb-6">
                Photographe passionnée basée à Paris, je capture des moments uniques
                avec un style éditorial et authentique. Mon approche combine technique
                maîtrisée et sensibilité artistique pour créer des images qui racontent
                une histoire.
              </p>
              <p className="text-[#525252] leading-relaxed mb-8">
                Que ce soit pour des portraits, de la mode, ou de la création de
                contenu, chaque projet est une nouvelle opportunité de créer quelque
                chose d'unique.
              </p>
              <Link
                href="/a-propos"
                className="inline-block px-8 py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-[#333] transition-colors"
              >
                EN SAVOIR PLUS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Travaillons ensemble
          </h2>
          <p className="text-[#a3a3a3] text-lg mb-8 max-w-2xl mx-auto">
            Vous avez un projet en tête ? Une idée créative à concrétiser ?
            Je serais ravie d'échanger avec vous.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-black text-sm font-medium tracking-wide hover:bg-[#e5e5e5] transition-colors"
          >
            ME CONTACTER
          </Link>
        </div>
      </section>
    </>
  );
}
