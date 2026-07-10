import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FilmmakerClient from "../FilmmakerClient";
import { DIARY_CATS, type DiaryCat } from "../constants";
import { readDiary } from "@/lib/creator-videos";

// Une URL par categorie de video diary : /filmmaker/fashion, /lifestyle,
// /places, /travel, /work — a partager directement avec les marques.

interface Props {
  params: Promise<{ lang: "fr" | "en"; category: string }>;
}

const CAT_TITLES: Record<DiaryCat, string> = {
  places: "Places",
  cities: "Cities",
  lifestyle: "Lifestyle",
  fashion: "Fashion",
  bts: "BTS",
};

function parseCat(category: string): DiaryCat | null {
  return (DIARY_CATS as readonly string[]).includes(category) ? (category as DiaryCat) : null;
}

export function generateStaticParams() {
  return (["fr", "en"] as const).flatMap((lang) =>
    DIARY_CATS.map((category) => ({ lang, category })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category } = await params;
  const cat = parseCat(category);
  if (!cat) return {};

  const name = CAT_TITLES[cat];
  return {
    title: `Filmmaker — ${name}`,
    description:
      lang === "fr"
        ? `${name} — films par Sandrine Ceuppens, The Girl With A Camera. Séquences contemplatives et cinématiques.`
        : `${name} — films by Sandrine Ceuppens, The Girl With A Camera. Contemplative, cinematic sequences.`,
    alternates: {
      canonical: `/${lang}/filmmaker/${cat}`,
      languages: { fr: `/fr/filmmaker/${cat}`, en: `/en/filmmaker/${cat}` },
    },
  };
}

export default async function FilmmakerCategoryPage({ params }: Props) {
  const { lang, category } = await params;
  const cat = parseCat(category);
  if (!cat) notFound();

  return <FilmmakerClient lang={lang} diary={readDiary()} activeCat={cat} />;
}
