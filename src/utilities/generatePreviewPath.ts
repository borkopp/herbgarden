import { CollectionSlug, PayloadRequest } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  products: '/products',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
  locale?: any
}

export const generatePreviewPath = ({ collection, locale, slug }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  const path = `${locale ? `/${locale}` : ''}${collectionPrefixMap[collection]}/${slug}`

  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
