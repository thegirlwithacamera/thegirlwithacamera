"use client";

import Image from "next/image";
import { use } from "react";

const projects = {
  fr: [
    {
      id: 1,
      title: "Campagne Digitale",
      type: "Direction Artistique",
      description: "Création de contenu pour une marque de lifestyle",
      image: "/images/da/campaign-1.jpg",
    },
    {
      id: 2,
      title: "Série Vidéo",
      type: "Vidéo",
      description: "Behind the scenes d'une séance photo éditoriale",
      image: "/images/da/video-1.jpg",
    },
    {
      id: 3,
      title: "Content Creation",
      type: "Réseaux Sociaux",
      description: "Contenu pour réseaux sociaux - marque de mode",
      image: "/images/da/social-1.jpg",
    },
    {
      id: 4,
      title: "Brand Storytelling",
      type: "Direction Artistique",
      description: "Narrative visuelle pour une marque émergente",
      image: "/images/da/brand-1.jpg",
    },
    {
      id: 5,
      title: "Reels & Formats Courts",
      type: "Vidéo",
      description: "Création de contenus dynamiques pour Instagram",
      image: "/images/da/reels-1.jpg",
    },
    {
      id: 6,
      title: "Editorial Project",
      type: "Direction Artistique",
      description: "Projet éditorial indépendant",
      image: "/images/da/editorial-1.jpg",
    },
  ],
  en: [
    {
      id: 1,
      title: "Digital Campaign",
      type: "Art Direction",
      description: "Content creation for a lifestyle brand",
      image: "/images/da/campaign-1.jpg",
    },
    {
      id: 2,
      title: "Video Series",
      type: "Video",
      description: "Behind the scenes of an editorial photoshoot",
      image: "/images/da/video-1.jpg",
    },
    {
      id: 3,
      title: "Content Creation",
      type: "Social Media",
      description: "Social media content for a fashion brand",
      image: "/images/da/social-1.jpg",
    },
    {
      id: 4,
      title: "Brand Storytelling",
      type: "Art Direction",
      description: "Visual narrative for an emerging brand",
      image: "/images/da/brand-1.jpg",
    },
    {
      id: 5,
      title: "Reels & Short Formats",
      type: "Video",
      description: "Dynamic content creation for Instagram",
      image: "/images/da/reels-1.jpg",
    },
    {
      id: 6,
      title: "Editorial Project",
      type: "Art Direction",
      description: "Independent editorial project",
      image: "/images/da/editorial-1.jpg",
    },
  ],
};

export default function DAPage({ params }: { params: Promise<{ lang: "fr" | "en" }> }) {
  const { lang } = use(params);
  const isFrench = lang === "fr";

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            {isFrench ? "Direction Artistique" : "Art Direction"}
          </h1>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            {isFrench
              ? "Création de contenu, direction artistique et vidéo"
              : "Content creation, art direction and video"}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects[lang].map((project) => (
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
