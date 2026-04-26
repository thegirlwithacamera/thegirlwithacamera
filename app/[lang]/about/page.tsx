import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

const content = {
  en: {
    eyebrow: "About",
    title: "About",
    chapter1: "I've had a camera in my hands since I was a child.",
    p1: "Then life happened, and I put it down. In 2024, I picked it up again. What came back wasn't just a hobby. It was a way of seeing.",
    p2: "I photograph streets, light, and quiet moments. The kind that go unnoticed. My work sits at the intersection of documentary and fashion. Minimal editing. I barely touch the image after. Just what's there, as it was.",
    p3: "Beyond stills, I create video content: scripting, filming, editing. Currently working with Ricoh and Pentax Europe. I'm building a body of personal work I want to see in print.",
    based: "Based in Brussels. Available to travel.",
    whatIDo: "What I do",
    s1title: "Photography",
    s1desc: "Street, documentary, travel, fashion.\nPersonal series and editorial work.",
    s2title: "Video & Content",
    s2desc: "Scripting, filming, editing.\nBrand content for social media.",
    s3title: "Collaborations",
    s3desc: "Ricoh Europe · Pentax Europe\nOpen to brands and magazines.",
    cta: "Want to work together?",
    ctaDesc: "Whether it's a brand project, an editorial idea, or something else. I'd love to hear it.",
    ctaBtn: "Get in touch",
  },
  fr: {
    eyebrow: "À propos",
    title: "À propos",
    chapter1: "J'ai eu un appareil photo entre les mains depuis l'enfance.",
    p1: "Puis la vie a pris le dessus, et je l'ai posé. En 2024, je l'ai repris. Ce qui est revenu n'était pas juste une passion. C'était une façon de voir.",
    p2: "Je photographie les rues, la lumière, les moments silencieux. Ceux qu'on ne remarque pas. Mon travail se situe à la croisée du documentaire et de la mode. Post-traitement minimal. Je touche à peine l'image. Ce qui est là, tel que c'était.",
    p3: "Au-delà de la photo, je crée du contenu vidéo : scripting, tournage, montage. Actuellement avec Ricoh et Pentax Europe. Je construis un corpus de travail personnel que j'aimerais voir publié.",
    based: "Basée à Bruxelles. Disponible pour voyager.",
    whatIDo: "Ce que je fais",
    s1title: "Photographie",
    s1desc: "Street, documentaire, voyage, mode.\nSéries personnelles et travail éditorial.",
    s2title: "Vidéo & Contenu",
    s2desc: "Scripting, tournage, montage.\nContenu de marque pour les réseaux sociaux.",
    s3title: "Collaborations",
    s3desc: "Ricoh Europe · Pentax Europe\nOuverte aux marques et magazines.",
    cta: "Envie de travailler ensemble ?",
    ctaDesc: "Que ce soit un projet de marque, une idée éditoriale, ou autre chose. Je suis à l'écoute.",
    ctaBtn: "Me contacter",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "À propos" : "About",
    description: isFr
      ? "Sandrine Ceuppens, photographe et créatrice de contenu basée à Bruxelles. Documentaire, mode, vidéo. Collaborations Ricoh et Pentax Europe."
      : "Sandrine Ceuppens, photographer and content creator based in Brussels. Documentary, fashion, video. Ricoh and Pentax Europe collaborations.",
    alternates: { canonical: `/${lang}/about`, languages: { fr: "/fr/about", en: "/en/about" } },
  };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 border-b border-[#e5e5e5] pb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#737373] mb-6">{t.eyebrow}</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none">
            {t.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden">
            <Image
              src="/images/about.jpg"
              alt={lang === "fr" ? "Portrait de Sandrine Ceuppens" : "Portrait of Sandrine Ceuppens"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8 leading-snug">
              {t.chapter1}
            </h2>
            <div className="space-y-5 text-[#525252] leading-relaxed">
              <p>{t.p1}</p>
              <p>{t.p2}</p>
              <p>{t.p3}</p>
            </div>
            <p className="mt-8 text-xs tracking-widest uppercase text-[#737373]">{t.based}</p>
          </div>
        </div>

        <div className="border-t border-[#e5e5e5] pt-16">
          <h3 className="font-serif text-2xl font-bold mb-12">{t.whatIDo}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-sm tracking-wide mb-3">{t.s1title}</h4>
              <p className="text-[#525252] text-sm leading-relaxed whitespace-pre-line">{t.s1desc}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm tracking-wide mb-3">{t.s2title}</h4>
              <p className="text-[#525252] text-sm leading-relaxed whitespace-pre-line">{t.s2desc}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm tracking-wide mb-3">{t.s3title}</h4>
              <p className="text-[#525252] text-sm leading-relaxed whitespace-pre-line">{t.s3desc}</p>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">{t.cta}</h3>
          <p className="text-[#525252] mb-8 max-w-md mx-auto">{t.ctaDesc}</p>
          <Link
            href={`/${lang}/contact`}
            className="inline-block px-8 py-3 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-[#333] transition-colors"
          >
            {t.ctaBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
