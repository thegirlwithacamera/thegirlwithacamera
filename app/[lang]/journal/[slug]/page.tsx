import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts, findPost, formatDate, renderMarkdown } from "@/lib/journal";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHead } from "../../components/editorial";
import s from "../journal.module.css";

interface Props {
  params: Promise<{ lang: "en"; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts().map((p) => ({ lang: "en", slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};
  return pageMeta({
    lang: "en",
    path: `/journal/${post.slug}`,
    title: post.title,
    description: post.excerpt ?? `${post.title}, a story by Sandrine Ceuppens.`,
    image: post.cover,
    type: "article",
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  return (
    <main className={s.main}>
      <PageHead
        back={{ href: "/en/journal", label: "Journal" }}
        title={post.title}
        meta={[post.place, formatDate(post.date)]}
        lede={post.excerpt}
      />
      {post.cover && (
        <div className={s.cover}>
          <Image src={post.cover} alt={post.title} width={1800} height={1200} sizes="(max-width: 900px) 100vw, 900px" priority quality={80} />
        </div>
      )}
      <article className={s.body} dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
      <p className={s.back}><Link href="/en/journal">← All stories</Link></p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        datePublished: post.date,
        image: post.cover ? `${site.url}${post.cover}` : undefined,
        author: { "@type": "Person", name: site.name, url: site.url },
        mainEntityOfPage: `${site.url}/en/journal/${post.slug}`,
      }) }} />
    </main>
  );
}
