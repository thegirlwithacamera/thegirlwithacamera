"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";

const content = {
  fr: {
    title: "À Propos",
    subtitle: "La personne derrière l'objectif",
    hello: "Bonjour, je suis Sandrine",
    p1: "Photographe et créatrice de contenu basée à Paris, je capture des moments uniques avec un style éditorial et authentique.",
    p2: "Mon approche combine technique maîtrisée et sensibilité artistique pour créer des images qui racontent une histoire. Chaque projet est une nouvelle opportunité de créer quelque chose d'unique.",
    p3: "Spécialisée en portrait, mode et lifestyle, je travaille aussi bien en studio qu'en extérieur, avec une prédilection pour la lumière naturelle qui apporte authenticité et émotion à mes images.",
    services: "Mes Services",
    photoSessions: "Séances Photo",
    photoSessionsDesc: "Portraits, mode, événements\nStudio ou extérieur",
    contentCreation: "Création de Contenu",
    contentCreationDesc: "Direction artistique\nContenu pour réseaux sociaux",
    video: "Vidéo",
    videoDesc: "Reels, behind the scenes\nFormats courts dynamiques",
    haveProject: "Vous avez un projet ?",
    projectDesc: "Je serais ravie d'échanger avec vous sur votre prochain projet créatif.",
    contact: "ME CONTACTER",
  },
  en: {
    title: "About",
    subtitle: "The person behind the lens",
    hello: "Hello, I'm Sandrine",
    p1: "Photographer and content creator based in Paris, capturing unique moments with an editorial and authentic style.",
    p2: "My approach combines technical mastery and artistic sensitivity to create images that tell a story. Every project is a new opportunity to create something unique.",
    p3: "Specializing in portrait, fashion and lifestyle, I work both in studio and on location, with a preference for natural light that brings authenticity and emotion to my images.",
    services: "Services",
    photoSessions: "Photo Sessions",
    photoSessionsDesc: "Portraits, fashion, events\nStudio or location",
    contentCreation: "Content Creation",
    contentCreationDesc: "Art direction\nSocial media content",
    video: "Video",
    videoDesc: "Reels, behind the scenes\nDynamic short formats",
    haveProject: "Have a project?",
    projectDesc: "I'd love to discuss your next creative project with you.",
    contact: "GET IN TOUCH",
  },
};

export default function AboutPage({ params }: { params: Promise<{ lang: "fr" | "en" }> }) {
  const { lang } = use(params);
  const t = content[lang];

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            {t.title}
          </h1>
          <p className="text-[#737373] text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="aspect-[3/4] bg-[#f5f5f5] overflow-hidden">
            <Image
              src="/images/about.jpg"
              alt="Sandrine Ceuppens"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold mb-6">
              {t.hello}
            </h2>
            <div className="space-y-4 text-[#525252] leading-relaxed">
              <p>{t.p1}</p>
              <p>{t.p2}</p>
              <p>{t.p3}</p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="py-12 border-t border-b border-[#e5e5e5]">
          <h3 className="font-serif text-2xl font-bold mb-8 text-center">
            {t.services}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2">{t.photoSessions}</h4>
              <p className="text-[#737373] text-sm whitespace-pre-line">
                {t.photoSessionsDesc}
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2">{t.contentCreation}</h4>
              <p className="text-[#737373] text-sm whitespace-pre-line">
                {t.contentCreationDesc}
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2">{t.video}</h4>
              <p className="text-[#737373] text-sm whitespace-pre-line">
                {t.videoDesc}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="font-serif text-2xl font-bold mb-4">
            {t.haveProject}
          </h3>
          <p className="text-[#737373] mb-8">
            {t.projectDesc}
          </p>
          <Link
            href={`/${lang === "fr" ? "fr" : "en"}/contact`}
            className="inline-block px-8 py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-[#333] transition-colors"
          >
            {t.contact}
          </Link>
        </div>
      </div>
    </div>
  );
}
