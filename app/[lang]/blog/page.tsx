import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, postTypeLabel, formatDate, urlFor } from '@/lib/sanity.queries'

interface Props {
  params: Promise<{ lang: 'fr' | 'en' }>
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params
  const posts = await getAllPosts()

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="mb-20 border-b border-[#e5e5e5] pb-8">
          <h1 className="font-serif text-5xl md:text-6xl font-bold">Journal</h1>
        </div>

        {posts.length === 0 && (
          <p className="text-xs tracking-widest uppercase text-[#b5b5b5]">
            {lang === 'fr' ? 'Bientôt' : 'Coming soon'}
          </p>
        )}

        <div className="space-y-16">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/${lang}/blog/${post.slug}`}
              className="group block border-b border-[#e5e5e5] pb-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
                {/* Cover */}
                <div className="relative aspect-[3/2] overflow-hidden bg-[#f5f5f5]">
                  <Image
                    src={urlFor(post.cover).width(600).height(400).url()}
                    alt={post.title[lang]}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Text */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs tracking-widest uppercase text-[#737373]">
                      {postTypeLabel[post.type][lang]}
                    </span>
                    <span className="text-xs text-[#b5b5b5]">
                      {formatDate(post.date, lang)}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold leading-snug mb-4 group-hover:text-[#333] transition-colors">
                    {post.title[lang]}
                  </h2>
                  <p className="text-[#737373] leading-relaxed text-sm">
                    {post.excerpt?.[lang]}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
