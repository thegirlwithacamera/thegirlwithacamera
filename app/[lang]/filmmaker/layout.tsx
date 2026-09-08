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
        ? "Films de marque et verticales par Sandrine Ceuppens : hôtels, maisons d'hôtes, restaurants et villes. Lumière naturelle, montage narratif, sound design. Basée à Bruxelles."
        : "Brand films and verticals by Sandrine Ceuppens: hotels, guesthouses, restaurants and cities. Natural light, narrative editing, sound design. Based in Brussels.",
  });
}

export default function FilmmakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
