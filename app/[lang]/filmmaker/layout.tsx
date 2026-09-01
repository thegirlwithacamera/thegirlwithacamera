import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta({
    lang,
    path: "/filmmaker",
    title: lang === "fr" ? "Vidéaste" : "Filmmaker",
    description:
      lang === "fr"
        ? "Films de marque et verticales par Sandrine Ceuppens : hôtels, restaurants, voyage, coulisses. Lumière naturelle, montage narratif, sound design. Bruxelles."
        : "Brand films and verticals by Sandrine Ceuppens: hotels, restaurants, travel, behind the scenes. Natural light, narrative editing, sound design. Brussels-based.",
  });
}

export default function FilmmakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
