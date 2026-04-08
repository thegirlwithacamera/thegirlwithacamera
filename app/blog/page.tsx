import Image from "next/image";
import Link from "next/link";

const articles = [
  {
    id: 1,
    title: "Les coulisses de ma dernière séance photo",
    excerpt:
      "Découvrez le processus créatif derrière cette série éditoriale, de la préparation au post-traitement.",
    date: "8 Avril 2026",
    category: "Coulisses",
    image: "/images/blog/article-1.jpg",
    href: "/blog/coulisses-seance-photo",
  },
  {
    id: 2,
    title: "Mon équipement photo pour 2026",
    excerpt:
      "Tour d'horizon du matériel que j'utilise au quotidien pour mes séances photo et créations de contenu.",
    date: "1 Avril 2026",
    category: "Matériel",
    image: "/images/blog/article-2.jpg",
    href: "/blog/equipement-2026",
  },
  {
    id: 3,
    title: "5 conseils pour réussir ses portraits en lumière naturelle",
    excerpt:
      "Mes astuces pour sublimer vos sujets avec la lumière du jour, même sans matériel professionnel.",
    date: "25 Mars 2026",
    category: "Tutoriels",
    image: "/images/blog/article-3.jpg",
    href: "/blog/portraits-lumiere-naturelle",
  },
  {
    id: 4,
    title: "Comment trouver son style en photographie",
    excerpt:
      "Développer une signature visuelle unique : mes conseils après des années de pratique.",
    date: "18 Mars 2026",
    category: "Conseils",
    image: "/images/blog/article-4.jpg",
    href: "/blog/trouver-son-style",
  },
  {
    id: 5,
    title: "Ma routine de post-traitement",
    excerpt:
      "Comment j'édite mes photos pour obtenir ce look éditorial qui me caractérise.",
    date: "10 Mars 2026",
    category: "Tutoriels",
    image: "/images/blog/article-5.jpg",
    href: "/blog/routine-post-traitement",
  },
  {
    id: 6,
    title: "Pourquoi j'ai choisi la photographie",
    excerpt:
      "Retour sur mon parcours et ce qui m'a poussée à transformer ma passion en métier.",
    date: "1 Mars 2026",
    category: "Personnel",
    image: "/images/blog/article-6.jpg",
    href: "/blog/pourquoi-la-photographie",
  },
];

export default function BlogPage() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Blog
          </h1>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            Conseils, coulisses et réflexions sur la photographie et la création
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.id} href={article.href} className="group">
              <div className="aspect-[4/3] bg-[#e5e5e5] mb-4 overflow-hidden image-overlay">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs tracking-widest uppercase text-[#737373] mb-2">
                {article.category}
              </p>
              <p className="text-xs text-[#737373] mb-2">{article.date}</p>
              <h3 className="font-serif text-xl font-bold mb-2 group-hover:underline">
                {article.title}
              </h3>
              <p className="text-[#737373] text-sm leading-relaxed">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
