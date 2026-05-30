import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Creator",
    description:
      lang === "fr"
        ? "Services de création de contenu visuel pour les marques. Vidéos de produits, lifestyle, tutoriels et reels pour Instagram. Collaborations avec Ricoh, Pentax et Insta360."
        : "Visual content creation services for brands. Product videos, lifestyle, tutorials and reels for Instagram. Collaborations with Ricoh, Pentax and Insta360.",
    alternates: { canonical: `/${lang}/creator`, languages: { fr: "/fr/creator", en: "/en/creator" } },
  };
}

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
