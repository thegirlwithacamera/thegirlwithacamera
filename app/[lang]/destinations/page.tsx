import type { Metadata } from "next";
import { allCases } from "../photographer/constants";
import { readCaseCover } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";
import { PageHead, ProjectCard, ProjectGrid, SectionBar } from "../components/editorial";
import s from "./page.module.css";

interface Props {
  params: Promise<{ lang: "en" }>;
}

export function generateStaticParams() {
  return (["en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    lang: "en",
    path: "/destinations",
    title: "Destinations",
    description:
      "Hotels, cities and places photographed and filmed by Sandrine Ceuppens, travel photographer and content creator. Austria, Japan, Italy and beyond.",
  });
}

// ─────────────────────────────────────────────────────────────
// Destinations, créée le 16/09. Elle remplace la page Photographer dans le
// menu : tout le travail rangé par pays, les hôtels à l'intérieur, pour
// qu'un hôtel retrouve ses pairs dans leur ville.
//
// Les pages de projet ne bougent pas (/photographer/<catégorie>/<projet>) :
// elles sont indexées et partagées. Cette page les regroupe, rien de plus.
// L'ordre des pays est fixé ici ; un pays absent de la liste passe à la fin.
// ─────────────────────────────────────────────────────────────

const COUNTRY_ORDER = ["Austria", "Japan", "Italy", "Belgium"];

export default async function DestinationsPage({ params }: Props) {
  await params;

  const tiles = allCases()
    .map((c) => {
      const cover = readCaseCover(c.cat.slug, c.item.slug);
      if (!cover) return null;
      const place = c.item.place?.en;
      const country = place ? place.split(",").pop()!.trim() : "Elsewhere";
      return {
        key: `${c.cat.slug}/${c.item.slug}`,
        href: `/en${c.href}`,
        cover,
        title: c.item.short?.en ?? c.item.label.en,
        sub: place,
        country,
        coverPosition: c.item.coverPosition,
      };
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);

  const countries = [...new Set(tiles.map((t) => t.country))].sort((a, b) => {
    const ia = COUNTRY_ORDER.indexOf(a), ib = COUNTRY_ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });

  return (
    <main className={s.main}>
      <PageHead
        eyebrow="Destinations"
        title="Places, *the way they feel*."
        lede="Hotels, cities and the streets in between, photographed and filmed in natural light. Often at five in the morning, before anyone else is up."
        split
      />
      {countries.map((country, ci) => (
        <section key={country} className={s.section}>
          <SectionBar label={country} />
          <ProjectGrid>
            {tiles
              .filter((t) => t.country === country)
              .map((t, i) => (
                <ProjectCard
                  key={t.key}
                  href={t.href}
                  cover={t.cover}
                  alt={`${t.title}${t.sub ? `, ${t.sub}` : ""}, photographed by Sandrine Ceuppens`}
                  title={t.title}
                  sub={t.sub}
                  priority={ci === 0 && i < 3}
                  coverPosition={t.coverPosition}
                />
              ))}
          </ProjectGrid>
        </section>
      ))}
    </main>
  );
}
