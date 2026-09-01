import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CreatorClient from "../CreatorClient";
import { SECTIONS, type Section } from "../constants";
import { DIARY_CATS } from "../../filmmaker/constants";
import { readCreatorData } from "@/lib/creator-videos";
import { pageMeta } from "@/lib/seo";

// Sous-pages creator : /creator/gear, /creator/lifestyle, /creator/unboxing,
// /creator/talk. Chaque section a sa propre URL, partageable directement.
// Les video diaries vivent sur leur propre page : /filmmaker.

interface Props {
  params: Promise<{ lang: "fr" | "en"; section: string[] }>;
}

const SECTION_TITLES: Record<Section, string> = {
  gear: "Gear",
  lifestyle: "Lifestyle",
  unboxing: "Unboxing",
  talk: "Talk",
};

function parseSection(section: string[]): Section | null {
  if (section.length === 1 && (SECTIONS as readonly string[]).includes(section[0])) {
    return section[0] as Section;
  }
  return null;
}

export function generateStaticParams() {
  return (["fr", "en"] as const).flatMap((lang) =>
    SECTIONS.map((s) => ({ lang, section: [s] })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, section } = await params;
  const parsed = parseSection(section);
  if (!parsed) return {};

  const name = SECTION_TITLES[parsed];
  const slug = section.join("/");

  return pageMeta({
    lang,
    path: `/creator/${slug}`,
    title: `Creator · ${name}`,
    description:
      lang === "fr"
        ? `${name}, contenu vidéo par Sandrine Ceuppens, The Girl With A Camera. Création de contenu pour les marques.`
        : `${name}, video content by Sandrine Ceuppens, The Girl With A Camera. Content creation for brands.`,
  });
}

export default async function CreatorSectionPage({ params }: Props) {
  const { lang, section } = await params;

  // Anciennes URLs /creator/diary[...] : les diaries ont demenage sur /filmmaker.
  if (section[0] === "diary") {
    const cat = (DIARY_CATS as readonly string[]).includes(section[1]) ? `/${section[1]}` : "";
    permanentRedirect(`/${lang}/filmmaker${cat}`);
  }
  // Ancienne URL /creator/experiences : la section s'appelle Lifestyle.
  if (section.length === 1 && section[0] === "experiences") {
    permanentRedirect(`/${lang}/creator/lifestyle`);
  }

  const parsed = parseSection(section);
  if (!parsed) notFound();

  return <CreatorClient lang={lang} data={readCreatorData()} section={parsed} />;
}
