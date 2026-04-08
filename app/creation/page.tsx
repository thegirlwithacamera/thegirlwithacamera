import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    id: 1,
    title: "Campagne Digitale",
    type: "Direction Artistique",
    description: "Création de contenu pour une marque de lifestyle",
    image: "/images/creation/campaign-1.jpg",
  },
  {
    id: 2,
    title: "Série Vidéo",
    type: "Vidéo",
    description: "Behind the scenes d'une séance photo éditoriale",
    image: "/images/creation/video-1.jpg",
  },
  {
    id: 3,
    title: "Content Creation",
    type: "Social Media",
    description: "Contenu pour réseaux sociaux - marque de mode",
    image: "/images/creation/social-1.jpg",
  },
  {
    id: 4,
    title: "Brand Storytelling",
    type: "Direction Artistique",
    description: "Narrative visuelle pour une marque émergente",
    image: "/images/creation/brand-1.jpg",
  },
  {
    id: 5,
    title: "Reels & Formats Courts",
    type: "Vidéo",
    description: "Création de contenus dynamiques pour Instagram",
    image: "/images/creation/reels-1.jpg",
  },
  {
    id: 6,
    title: "Editorial Project",
    type: "Direction Artistique",
    description: "Projet éditorial indépendant",
    image: "/images/creation/editorial-1.jpg",
  },
];

export default function CreationPage() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Création de Contenu
          </h1>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            Direction artistique, vidéo et contenus pour les réseaux sociaux
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group">
              <div className="aspect-[16/9] bg-[#f5f5f5] overflow-hidden image-overlay mb-4">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs tracking-widest uppercase text-[#737373] mb-2">
                {project.type}
              </p>
              <h3 className="font-serif text-2xl font-bold mb-2">
                {project.title}
              </h3>
              <p className="text-[#525252]">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
