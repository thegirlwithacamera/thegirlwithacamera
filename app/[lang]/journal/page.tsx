import type { Metadata } from "next";
import Link from "next/link";
import { allPosts, formatDate } from "@/lib/journal";
import { pageMeta } from "@/lib/seo";
import { PageHead, ProjectCard, ProjectGrid } from "../components/editorial";
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

  return (
    <main className={s.main}>
      <PageHead
        eyebrow="Journal"
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
          <ProjectGrid>
            {posts.map((p, i) => (
              <ProjectCard
                key={p.slug}
                href={`/en/journal/${p.slug}`}
                cover={p.cover}
                alt={p.title}
                title={p.title}
                sub={[p.place, formatDate(p.date)].filter(Boolean).join(", ")}
                priority={i < 3}
                door={!p.cover}
              />
            ))}
          </ProjectGrid>
        </div>
      )}
      <p className={s.back}><Link href="/en/destinations">See the destinations →</Link></p>
    </main>
  );
}
