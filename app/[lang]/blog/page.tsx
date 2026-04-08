"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";

const content = {
  fr: {
    desc: "Conseils, coulisses et réflexions sur la photographie et la création",
    categories: {
      coulisses: "Coulisses",
      materiel: "Matériel",
      tutoriels: "Tutoriels",
      conseils: "Conseils",
      personnel: "Personnel",
    },
  },
  en: {
    desc: "Tips, behind the scenes and thoughts on photography and creation",
    categories: {
      coulisses: "Behind the Scenes",
      materiel: "Equipment",
      tutoriels: "Tutorials",
      conseils: "Tips",
      personnel: "Personal",
    },
  },
};

const articles = [
  {
    id: 1,
    titleFr: "Les coulisses de ma dernière séance photo",
    titleEn: "Behind the scenes of my latest photoshoot",
    excerptFr: "Découvrez le processus créatif derrière cette série éditoriale, de la préparation au post-traitement.",
    excerptEn: "Discover the creative process behind this editorial series, from preparation to post-processing.",
    date: "8 Avril 2026",
    category: "coulisses",
    image: "/images/blog/article-1.jpg",
  },
  {
    id: 2,
    titleFr: "Mon équipement photo pour 2026",
    titleEn: "My photography equipment for 2026",
    excerptFr: "Tour d'horizon du matériel que j'utilise au quotidien pour mes séances photo et créations de contenu.",
    excerptEn: "Overview of the equipment I use daily for my photo shoots and content creation.",
    date: "1 Avril 2026",
    category: "materiel",
    image: "/images/blog/article-2.jpg",
  },
  {
    id: 3,
    titleFr: "5 conseils pour réussir ses portraits en lumière naturelle",
    titleEn: "5 tips for successful natural light portraits",
    excerptFr: "Mes astuces pour sublimer vos sujets avec la lumière du jour, même sans matériel professionnel.",
    excerptEn: "My tips to enhance your subjects with daylight, even without professional equipment.",
    date: "25 Mars 2026",
    category: "tutoriels",
    image: "/images/blog/article-3.jpg",
  },
  {
    id: 4,
    titleFr: "Comment trouver son style en photographie",
    titleEn: "How to find your photography style",
    excerptFr: "Développer une signature visuelle unique : mes conseils après des années de pratique.",
    excerptEn: "Developing a unique visual signature: my advice after years of practice.",
    date: "18 Mars 2026",
    category: "conseils",
    image: "/images/blog/article-4.jpg",
  },
  {
    id: 5,
    titleFr: "Ma routine de post-traitement",
    titleEn: "My post-processing routine",
    excerptFr: "Comment j'édite mes photos pour obtenir ce look éditorial qui me caractérise.",
    excerptEn: "How I edit my photos to achieve my signature editorial look.",
    date: "10 Mars 2026",
    category: "tutoriels",
    image: "/images/blog/article-5.jpg",
  },
  {
    id: 6,
    titleFr: "Pourquoi j'ai choisi la photographie",
    titleEn: "Why I chose photography",
    excerptFr: "Retour sur mon parcours et ce qui m'a poussée à transformer ma passion en métier.",
    excerptEn: "Looking back on my journey and what drove me to turn my passion into a profession.",
    date: "1 Mars 2026",
    category: "personnel",
    image: "/images/blog/article-6.jpg",
  },
];

export default function BlogPage({ params }: { params: Promise<{ lang: "fr" | "en" }> }) {
  const { lang } = use(params);
  const t = content[lang];
  const isFrench = lang === "fr";

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Blog
          </h1>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            {t.desc}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.id} href="#" className="group">
              <div className="aspect-[4/3] bg-[#e5e5e5] mb-4 overflow-hidden image-overlay">
                <Image
                  src={article.image}
                  alt={isFrench ? article.titleFr : article.titleEn}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs tracking-widest uppercase text-[#737373] mb-2">
                {t.categories[article.category as keyof typeof t.categories]}
              </p>
              <p className="text-xs text-[#737373] mb-2">{article.date}</p>
              <h3 className="font-serif text-xl font-bold mb-2 group-hover:underline">
                {isFrench ? article.titleFr : article.titleEn}
              </h3>
              <p className="text-[#737373] text-sm leading-relaxed">
                {isFrench ? article.excerptFr : article.excerptEn}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
