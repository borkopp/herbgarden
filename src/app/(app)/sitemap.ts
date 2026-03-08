// src/app/(app)/sitemap.ts
import configPromise from '@payload-config'
import { MetadataRoute } from 'next'
import { getPayload } from 'payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const payload = await getPayload({ config: configPromise })
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://tinyme.mk'

    // Fetch all published products
    const products = await payload.find({
        collection: 'products',
        where: { _status: { equals: 'published' } },
        limit: 1000,
    })

    // Fetch all published pages
    const pages = await payload.find({
        collection: 'pages',
        where: { _status: { equals: 'published' } },
        limit: 1000,
    })

    const productEntries = products.docs.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt),
    }))

    const pageEntries = pages.docs.map((page) => ({
        url: `${baseUrl}/${page.slug === 'home' ? '' : page.slug}`,
        lastModified: new Date(page.updatedAt),
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        ...pageEntries,
        ...productEntries,
    ]
}
