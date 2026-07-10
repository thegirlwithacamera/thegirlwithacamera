import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Vidéaste" : "Filmmaker",
    description:
      lang === "fr"
        ? "Films par Sandrine Ceuppens. Séquences contemplatives et cinématiques : mode, quotidien, venues, voyage, coulisses."
        : "Films by Sandrine Ceuppens. Contemplative, cinematic sequences: fashion, lifestyle, places, cities, bts.",
    alternates: { canonical: `/${lang}/filmmaker`, languages: { fr: "/fr/filmmaker", en: "/en/filmmaker" } },
  };
}

export default function FilmmakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
