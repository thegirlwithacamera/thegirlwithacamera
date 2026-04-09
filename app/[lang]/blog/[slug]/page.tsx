import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, postTypeLabel, formatDate } from "@/lib/posts";

interface Props {
  params: Promise<{ lang: "fr" | "en"; slug: string }>;
}

export default async function ArticlePage({ params }: Props) {
  const { lang, slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const body = post.body[lang];

  return (
    <div className="pt-32 pb-24">

      {/* Header */}
      <div className="px-6 mb-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/${lang}/blog`}
            className="text-xs tracking-widest uppercase text-[#737373] hover:text-black transition-colors mb-10 inline-block"
          >
            ← Journal
          </Link>

          <div className="mt-6">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs tracking-widest uppercase text-[#737373]">
                {postTypeLabel[post.type][lang]}
              </span>
              <span className="text-xs text-[#b5b5b5]">
                {formatDate(post.date, lang)}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
              {post.title[lang]}
            </h1>
          </div>
        </div>
      </div>

      {/* Cover photo */}
      <div className="mb-12">
        <div className="relative aspect-[16/9] md:aspect-[2/1] overflow-hidden bg-[#f5f5f5]">
          <Image
            src={post.cover}
            alt={post.title[lang]}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-6">
        <div className="max-w-2xl mx-auto">
          {body.map((block, i) => {
            if (block.type === "text") {
              return (
                <p
                  key={i}
                  className="text-[#1a1a1a] leading-relaxed text-base md:text-lg mb-8"
                >
                  {block.content}
                </p>
              );
            }
            if (block.type === "image") {
              return (
                <figure key={i} className="my-12 -mx-6 md:-mx-16">
                  <div className="relative aspect-[3/2] overflow-hidden bg-[#f5f5f5]">
                    <Image
                      src={block.src}
                      alt={block.caption ?? ""}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                  {block.caption && (
                    <figcaption className="mt-3 px-6 md:px-16 text-xs text-[#737373] tracking-wide">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            return null;
          })}
        </div>
      </div>

    </div>
  );
}
