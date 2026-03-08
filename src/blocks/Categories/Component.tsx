import type { Page } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { CategoriesClient } from './Component.client'

type CategoriesBlockProps = Extract<Page['layout'][0], { blockType: 'categories' }>

export const CategoriesBlock = async (
    props: CategoriesBlockProps & {
        id?: string
    }
) => {
    const { items } = props
    const payload = await getPayload({ config: configPromise })

    let enrichedItems: any[] = []

    if (items && items.length > 0) {
        enrichedItems = await Promise.all(
            items.map(async (item) => {
                let count = 0
                if (item.category && typeof item.category === 'object') {
                    // Fetch product count for this category
                    const fetchedProducts = await payload.find({
                        collection: 'products',
                        depth: 0,
                        limit: 1,
                        where: {
                            categories: {
                                in: [item.category.id],
                            },
                        },
                    })
                    count = fetchedProducts.totalDocs || 0
                }
                return {
                    ...item,
                    count,
                }
            })
        )
    }

    return <CategoriesClient {...props} items={enrichedItems} />
}
