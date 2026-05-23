import type { Metadata } from "next";
import FilmPlayer from "./FilmPlayer";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Film",
    description:
      lang === "fr"
        ? "Films documentaires, vidéos de voyage et créations de contenu pour les marques par Sandrine Ceuppens. Diaires de ville, moments de vie, documentaires photographiques."
        : "Documentary films, travel videos and brand content creation by Sandrine Ceuppens. City diaries, moments of life, photographer documentaries.",
    alternates: { canonical: `/${lang}/film`, languages: { fr: "/fr/film", en: "/en/film" } },
  };
}

export default async function FilmPage() {
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Film Collection by Sandrine Ceuppens",
    description: "Documentary films, travel videos and content creation work",
    creator: { "@type": "Person", name: "Sandrine Ceuppens" },
    hasPart: [
      { "@type": "VideoObject", name: "Tokyo", uploadDate: "2024-01-01", duration: "PT2M" },
      { "@type": "VideoObject", name: "Osaka", uploadDate: "2024-01-01", duration: "PT2M" },
      { "@type": "VideoObject", name: "Tokyo Night", uploadDate: "2024-01-01", duration: "PT2M" },
      { "@type": "VideoObject", name: "Nara", uploadDate: "2024-01-01", duration: "PT2M" },
      { "@type": "VideoObject", name: "Kyoto", uploadDate: "2024-01-01", duration: "PT2M" },
    ]
  };

  return (
    <main style={{ paddingTop: "16px", paddingBottom: "60px", background: "#ffffff" }}>
      <FilmPlayer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(videoSchema)}} />
    </main>
  );
}
