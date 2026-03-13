import { ShopPageClient } from './ClientPage'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import { getPayload } from 'payload'

import { getDictionary } from '@/i18n/getDictionary'
import { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{
    locale: Locale
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getDictionary(locale)

  return {
    description: t.shop.shopDescription,
    title: `${t.shop.collection} | Herb Garden`,
  }
}

export default async function ShopPage() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInMKD: true,
    },
    sort: 'title',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return <ShopPageClient products={products.docs} />
}
