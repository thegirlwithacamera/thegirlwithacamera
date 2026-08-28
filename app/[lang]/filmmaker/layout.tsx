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
        ? "Films de marque et verticales par Sandrine Ceuppens : hôtels, restaurants, voyage, coulisses. Lumière naturelle, montage narratif, sound design. Bruxelles."
        : "Brand films and verticals by Sandrine Ceuppens: hotels, restaurants, travel, behind the scenes. Natural light, narrative editing, sound design. Brussels-based.",
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
