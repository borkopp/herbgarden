import { ShopPageClient } from './ClientPage'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import { getPayload } from 'payload'

export const metadata: Metadata = {
  description: 'Pure Botanical Essences.',
  title: 'Collection | Herb Garden',
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
