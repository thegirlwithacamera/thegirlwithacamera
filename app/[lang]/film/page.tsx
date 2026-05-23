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
        ? "Films documentaires et créations vidéo par Sandrine Ceuppens."
        : "Documentary films and video work by Sandrine Ceuppens.",
    alternates: { canonical: `/${lang}/film`, languages: { fr: "/fr/film", en: "/en/film" } },
  };
}

export default async function FilmPage() {
  return (
    <main style={{ paddingTop: "16px", paddingBottom: "60px", background: "#ffffff" }}>
      <FilmPlayer />
    </main>
  );
}
