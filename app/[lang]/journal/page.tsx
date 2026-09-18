import type { Metadata } from "next";
import Link from "next/link";
import { allPosts, JOURNAL_SECTIONS, JOURNAL_SERIES, tileCaption } from "@/lib/journal";
import { pageMeta } from "@/lib/seo";
import { PageHead } from "../components/editorial";
import Tile from "./Tile";
import LazyFilm from "../destinations/LazyFilm";
import s from "./journal.module.css";

interface Props {
  params: Promise<{ lang: "en" }>;
}

export function generateStaticParams() {
  return (["en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    lang: "en",
    path: "/journal",
    title: "Journal",
    description: "Travel stories and guides by Sandrine Ceuppens, travel photographer and content creator.",
  });
}

// Liste des articles du journal, du plus récent au plus ancien. Tant qu'il
// n'y en a aucun, la page le dit simplement et renvoie vers Instagram, où
// les voyages se suivent déjà.
export default async function JournalPage({ params }: Props) {
  await params;
  const posts = allPosts();

  // Une tuile par destination (Interrail, Austria) et une par article seul.
  const sections = JOURNAL_SECTIONS.map((sec) => {
    const inSection = posts.filter((p) => p.section === sec.key);
    const seriesKeys = [...new Set(inSection.map((p) => p.series).filter((k): k is string => !!k))];
    const tiles = [
      ...seriesKeys.map((k) => ({
        key: `series-${k}`,
        href: `/en/journal/category/${k}`,
        label: JOURNAL_SERIES[k]?.label ?? k,
        cover: JOURNAL_SERIES[k]?.cover ?? inSection.find((p) => p.series === k)?.cover,
      })),
      ...inSection.filter((p) => !p.series).map((p) => ({ key: p.slug, href: `/en/journal/${p.slug}`, label: p.tile, cover: p.cover, caption: tileCaption(p) })),
    ];
    return { ...sec, tiles };
  }).filter((sec) => sec.tiles.length > 0);

  return (
    <main className={s.main}>
      <section className={s.banner}>
        <LazyFilm
          src="/videos/banners/journal-drone.mp4"
          poster="/videos/banners/journal-drone.jpg"
          label="Aerial view of a castle above a lake"
        />
        <span className={s.bannerVeil} aria-hidden="true" />
        <p className={s.bannerWord}>Travel Journal</p>
      </section>
      <PageHead
        title="Notes from *the road*."
        lede="Stories and guides from the places I photograph: where to stay, where to walk, and what a city looks like before it wakes up."
        split
      />
      {posts.length === 0 ? (
        <p className={s.empty}>
          The first stories are on their way. In the meantime, the trips are on{" "}
          <a href="https://www.instagram.com/sandrinecppns/" target="_blank" rel="noopener noreferrer">Instagram</a>.
        </p>
      ) : (
        <div className={s.list}>
          {/* Trois sections (16/09) : Travel, Creator, Photographer. Une
              section sans article n'apparaît pas. Dans une section, les séries
              (Interrail) passent d'abord, puis les articles seuls. */}
          <nav className={s.tabs} aria-label="Journal sections">
            {sections.map((sec) => (
              <a key={sec.key} href={`#${sec.key}`} className={s.tab}>{sec.label}</a>
            ))}
          </nav>
          {sections.map((sec) => (
            <section key={sec.key} id={sec.key} className={s.section}>
              <h2 className={s.sectionTitle}>{sec.label}</h2>
              <div className={s.tiles}>
                {sec.tiles.map((t) => (
                  <Tile key={t.key} href={t.href} cover={t.cover} label={t.label} caption={t.caption} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
      <p className={s.back}><Link href="/en/destinations">See the destinations →</Link></p>
    </main>
  );
}
