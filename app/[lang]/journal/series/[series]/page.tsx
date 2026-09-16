import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNAL_SERIES, postsInSeries } from "@/lib/journal";
import { pageMeta } from "@/lib/seo";
import { PageHead } from "../../../components/editorial";
import Tile from "../../Tile";
import s from "../../journal.module.css";

interface Props {
  params: Promise<{ lang: "en"; series: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(JOURNAL_SERIES)
    .filter((k) => postsInSeries(k).length > 0)
    .map((series) => ({ lang: "en", series }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series } = await params;
  const conf = JOURNAL_SERIES[series];
  if (!conf) return {};
  return pageMeta({
    lang: "en",
    path: `/journal/series/${series}`,
    title: `${conf.label} · Journal`,
    description: `Every ${conf.label} story from the journal of Sandrine Ceuppens.`,
    image: conf.cover,
  });
}

// Page d'une série du journal (16/09) : les articles de la série en tuiles
// carrées, dans l'ordre fixé dans lib/journal.ts.
export default async function SeriesPage({ params }: Props) {
  const { series } = await params;
  const conf = JOURNAL_SERIES[series];
  const posts = postsInSeries(series);
  if (!conf || posts.length === 0) notFound();

  return (
    <main className={s.main}>
      <PageHead back={{ href: "/en/journal", label: "Journal" }} title={conf.label} />
      <div className={s.tiles}>
        {posts.map((p) => (
          <Tile key={p.slug} href={`/en/journal/${p.slug}`} cover={p.cover} label={p.tile} />
        ))}
      </div>
      <p className={s.back}><Link href="/en/journal">← All stories</Link></p>
    </main>
  );
}
