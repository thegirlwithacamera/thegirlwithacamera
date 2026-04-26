import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getAllPosts, postTypeLabel, formatDate, urlFor } from '@/lib/sanity.queries'

interface Props {
  params: Promise<{ lang: 'fr' | 'en' }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const isFr = lang === 'fr'
  return {
    title: 'Journal',
    description: isFr
      ? "Carnets de tournage, notes de lieu, technique. Le journal de Sandrine Ceuppens."
      : "Field notes, places, technique. The journal of Sandrine Ceuppens.",
    alternates: { canonical: `/${lang}/blog`, languages: { fr: '/fr/blog', en: '/en/blog' } },
  }
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params

  let posts: Awaited<ReturnType<typeof getAllPosts>> = []
  try {
    posts = await getAllPosts()
  } catch {
    // Sanity not configured — render the empty state.
  }

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="mb-20 border-b border-[#e5e5e5] pb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#737373] mb-6">
            {lang === 'fr' ? 'Carnet' : 'Notebook'}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none">Journal</h1>
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xs tracking-widest uppercase text-[#737373] mb-3">
              {lang === 'fr' ? 'Bientôt' : 'Coming soon'}
            </p>
            <p className="text-[#525252] max-w-md mx-auto">
              {lang === 'fr'
                ? "Le journal arrive — carnets de tournage, lectures, lieux, technique. Inscrivez-vous à la newsletter pour ne rien manquer."
                : 'The journal is coming — field notes, readings, places, technique. Subscribe to the newsletter so you don\'t miss it.'}
            </p>
          </div>
        )}

        <div className="space-y-16">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/${lang}/blog/${post.slug}`}
              className="group block border-b border-[#e5e5e5] pb-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
                <div className="relative aspect-[3/2] overflow-hidden bg-[#f5f5f5]">
                  <Image
                    src={urlFor(post.cover).width(600).height(400).url()}
                    alt={post.title[lang]}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs tracking-widest uppercase text-[#737373]">
                      {postTypeLabel[post.type][lang]}
                    </span>
                    <span className="text-xs text-[#a3a3a3]">
                      {formatDate(post.date, lang)}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold leading-snug mb-4 group-hover:text-[#525252] transition-colors">
                    {post.title[lang]}
                  </h2>
                  <p className="text-[#525252] leading-relaxed text-sm">
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
