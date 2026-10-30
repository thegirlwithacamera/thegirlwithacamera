import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta({
    lang,
    path: "/creator",
    title: "Brands",
    description:
      lang === "fr"
        ? "Films de marque cinématiques et vidéo verticale pour les réseaux, en influence ou en UGC. Collaborations avec Ricoh, Pentax, Insta360, Godox et Edifier."
        : "Cinematic brand films and vertical video for social, as influence or UGC. Collaborations with Ricoh, Pentax, Insta360, Godox and Edifier.",
  });
}

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
