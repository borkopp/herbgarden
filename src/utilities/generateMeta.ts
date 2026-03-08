import type { Metadata } from 'next'

import type { Page, Product } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'

export const generateMeta = async (args: { doc: Page | Product }): Promise<Metadata> => {
  const { doc } = args || {}

  const ogImage =
    typeof doc?.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

  const category = 'categories' in doc && Array.isArray(doc.categories) && doc.categories.length > 0
    ? doc.categories[0]
    : undefined

  const categoryTitle = typeof category === 'object' && category !== null && 'title' in category
    ? category.title
    : undefined

  const title = doc?.meta?.title || (categoryTitle ? `${doc?.title} - ${categoryTitle}` : doc?.title) || 'Herb Garden'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      ...(doc?.meta?.description
        ? {
          description: doc?.meta?.description,
        }
        : {}),
      images: ogImage
        ? [
          {
            url: ogImage,
          },
        ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
