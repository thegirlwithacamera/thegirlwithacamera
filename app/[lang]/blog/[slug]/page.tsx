import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, postTypeLabel, formatDate, urlFor } from '@/lib/sanity.queries'
import { PortableText, PortableTextComponents } from 'next-sanity'

interface Props {
  params: Promise<{ lang: 'fr' | 'en'; slug: string }>
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-12 -mx-6 md:-mx-16">
          <div className="relative aspect-[3/2] overflow-hidden bg-[#f5f5f5]">
            <Image
              src={urlFor(value).width(1200).height(800).url()}
              alt={value.caption ?? ''}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-3 px-6 md:px-16 text-xs text-[#737373] tracking-wide">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="text-[#1a1a1a] leading-relaxed text-base md:text-lg mb-8">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl md:text-3xl font-bold mt-12 mb-6">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl md:text-2xl font-bold mt-10 mb-4">{children}</h3>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
}

export default async function ArticlePage({ params }: Props) {
  const { lang, slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const body = lang === 'fr' ? post.bodyFr : post.bodyEn

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

      {/* Cover */}
      <div className="mb-12">
        <div className="relative aspect-[16/9] md:aspect-[2/1] overflow-hidden bg-[#f5f5f5]">
          <Image
            src={urlFor(post.cover).width(1600).height(800).url()}
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
          {body && <PortableText value={body} components={portableTextComponents} />}
        </div>
      </div>

    </div>
  )
}
