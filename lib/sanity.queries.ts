import { client } from './sanity.client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Builder pour les URLs d'images
const builder = imageUrlBuilder(client)
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Types
export type PostType = 'journal' | 'lieu' | 'technique'

export interface SanityPost {
  _id: string
  slug: string
  type: PostType
  date: string
  cover: SanityImageSource
  title: { fr: string; en: string }
  excerpt: { fr: string; en: string }
  bodyFr: Block[]
  bodyEn: Block[]
}

export type Block = {
  _type: string
  [key: string]: unknown
}

// Requête : tous les articles (pour la page liste)
export async function getAllPosts(): Promise<SanityPost[]> {
  return client.fetch(
    `*[_type == "post"] | order(date desc) {
      _id,
      "slug": slug.current,
      type,
      date,
      cover,
      title,
      excerpt
    }`
  )
}

// Requête : un article par slug (pour la page article)
export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      "slug": slug.current,
      type,
      date,
      cover,
      title,
      excerpt,
      bodyFr,
      bodyEn
    }`,
    { slug }
  )
}

export const postTypeLabel: Record<PostType, { fr: string; en: string }> = {
  journal: { fr: 'Journal de création', en: 'Creative journal' },
  lieu: { fr: 'Carnet de lieu', en: 'Field notes' },
  technique: { fr: 'Technique & gear', en: 'Technique & gear' },
}

export function formatDate(dateStr: string, lang: 'fr' | 'en'): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
