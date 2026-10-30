import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import FilmsView from "../FilmsView";
import SocialClient from "../SocialClient";
import { BRAND_FILMS, SECTIONS, type Section } from "../constants";
import { readSocial } from "../data";
import { pageMeta } from "@/lib/seo";

// Sous-pages Brands (30/10) : /creator/films, les films de marque
// horizontaux, et /creator/social, les verticales (influence et UGC).
// Chaque page a sa propre URL, partageable directement.

interface Props {
  params: Promise<{ lang: "fr" | "en"; section: string[] }>;
}

const SECTION_META: Record<Section, { title: string; fr: string; en: string }> = {
  films: {
    title: "Brand films",
    fr: "Films de marque horizontaux et cinématiques, par Sandrine Ceuppens, The Girl With A Camera.",
    en: "Horizontal, cinematic brand films by Sandrine Ceuppens, The Girl With A Camera.",
  },
  social: {
    title: "Social",
    fr: "Vidéo verticale pour les marques, en influence ou en UGC, par Sandrine Ceuppens, The Girl With A Camera.",
    en: "Vertical video for brands, as influence or UGC, by Sandrine Ceuppens, The Girl With A Camera.",
  },
};

// Anciennes sections (jusqu'au 30/10), toutes verticales : elles mènent
// désormais à Social. Talk a été retiré, son adresse suit le même chemin.
const OLD_SECTIONS = ["gear", "lifestyle", "unboxing", "talk", "experiences"];

function parseSection(section: string[]): Section | null {
  if (section.length === 1 && (SECTIONS as readonly string[]).includes(section[0])) {
    return section[0] as Section;
  }
  return null;
}

export function generateStaticParams() {
  return (["en"] as const).flatMap((lang) =>
    SECTIONS.map((s) => ({ lang, section: [s] })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, section } = await params;
  const parsed = parseSection(section);
  if (!parsed) return {};
  const m = SECTION_META[parsed];
  return pageMeta({
    lang,
    path: `/creator/${parsed}`,
    title: `Brands · ${m.title}`,
    description: m[lang],
  });
}

export default async function CreatorSectionPage({ params }: Props) {
  const { lang, section } = await params;

  // Anciennes URLs /creator/diary[...] : les diaries ont demenage.
  if (section[0] === "diary") permanentRedirect(`/${lang}/destinations`);
  if (section.length === 1 && OLD_SECTIONS.includes(section[0])) {
    permanentRedirect(`/${lang}/creator/social`);
  }

  const parsed = parseSection(section);
  if (!parsed) notFound();

  if (parsed === "films") return <FilmsView lang={lang} films={BRAND_FILMS} />;
  return <SocialClient lang={lang} clips={readSocial(lang)} />;
}
