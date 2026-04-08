import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            À Propos
          </h1>
          <p className="text-[#737373] text-lg">
            La personne derrière l'objectif
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="aspect-[3/4] bg-[#f5f5f5] overflow-hidden">
            <Image
              src="/images/about.jpg"
              alt="Sandrine CPPNS"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold mb-6">
              Bonjour, je suis Sandrine
            </h2>
            <div className="space-y-4 text-[#525252] leading-relaxed">
              <p>
                Photographe et créatrice de contenu basée à Paris, je capture
                des moments uniques avec un style éditorial et authentique.
              </p>
              <p>
                Mon approche combine technique maîtrisée et sensibilité
                artistique pour créer des images qui racontent une histoire.
                Chaque projet est une nouvelle opportunité de créer quelque
                chose d'unique.
              </p>
              <p>
                Spécialisée en portrait, mode et lifestyle, je travaille aussi
                bien en studio qu'en extérieur, avec une prédilection pour la
                lumière naturelle qui apporte authenticité et émotion à mes
                images.
              </p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="py-12 border-t border-b border-[#e5e5e5]">
          <h3 className="font-serif text-2xl font-bold mb-8 text-center">
            Mes Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2">Séances Photo</h4>
              <p className="text-[#737373] text-sm">
                Portraits, mode, événements<br />
                Studio ou extérieur
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2">Création de Contenu</h4>
              <p className="text-[#737373] text-sm">
                Direction artistique<br />
                Contenu pour réseaux sociaux
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2">Vidéo</h4>
              <p className="text-[#737373] text-sm">
                Reels, behind the scenes<br />
                Formats courts dynamiques
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="font-serif text-2xl font-bold mb-4">
            Vous avez un projet ?
          </h3>
          <p className="text-[#737373] mb-8">
            Je serais ravie d'échanger avec vous sur votre prochain projet créatif.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-[#333] transition-colors"
          >
            ME CONTACTER
          </a>
        </div>
      </div>
    </div>
  );
}
