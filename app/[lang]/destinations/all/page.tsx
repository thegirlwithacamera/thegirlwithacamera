import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { allCases } from "../../photographer/constants";
import { countCasePhotos, readCaseCover } from "@/lib/portfolio";
import Tile from "../../journal/Tile";
import s from "../../journal/journal.module.css";

interface Props {
  params: Promise<{ lang: "en" }>;
}

export function generateStaticParams() {
  return (["en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    lang: "en",
    path: "/destinations/all",
    title: "All destinations",
    description:
      "Every hotel, table and city photographed and filmed by Sandrine Ceuppens, from Austria to Italy and Japan.",
    image: "/images/portfolio/travel/tokyo/1.jpg",
  });
}

// ─────────────────────────────────────────────────────────────
// Toutes les destinations (27/09, demande de Sandrine) : la page Destinations
// reste la vitrine des projets commandés, celle-ci montre tout, pays par pays,
// en carrés photo avec le nom dessus (même tuile que le Journal). Chaque carré
// mène à la page du projet, photos et films. Un projet sans photos n'apparaît
// pas. Pour cacher un projet : HIDDEN_CASES dans photographer/constants.ts.
// ─────────────────────────────────────────────────────────────

export default async function AllDestinationsPage({ params }: Props) {
  await params;
  const cases = allCases()
    .filter((c) => countCasePhotos(c.cat.slug, c.item.slug) > 0)
    .map((c) => {
      const place = c.item.place?.en ?? "";
      const country = place.split(",").pop()?.trim() || "Elsewhere";
      return {
        key: `${c.cat.slug}-${c.item.slug}`,
        href: `/en${c.href}`,
        label: (c.item.short ?? c.item.label).en,
        cover: c.item.coverImage ?? readCaseCover(c.cat.slug, c.item.slug) ?? undefined,
        country,
      };
    });

  const countries = [...new Set(cases.map((c) => c.country))].sort((a, b) => a.localeCompare(b));

  return (
    <main className={s.main}>
      <h1 className={s.sectionTitle} style={{ paddingTop: "clamp(40px, 5vw, 72px)" }}>All destinations</h1>
      {countries.map((country) => (
        <section key={country} id={country.toLowerCase()} className={s.section}>
          <h2 className={s.sectionTitle}>{country}</h2>
          <div className={s.tiles}>
            {cases.filter((c) => c.country === country).map((c) => (
              <Tile key={c.key} href={c.href} cover={c.cover} label={c.label} />
            ))}
          </div>
        </section>
      ))}
      <p className={s.back}><Link href="/en/destinations">Back to destinations →</Link></p>
    </main>
  );
}
