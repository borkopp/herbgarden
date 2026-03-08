import type { Product, ProductCarouselBlock as ProductCarouselBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { DefaultDocumentIDType, getPayload } from 'payload'
import React from 'react'

import { ProductCarouselClient } from './Component.client'

export const ProductCarouselBlock: React.FC<
    ProductCarouselBlockProps & {
        id?: DefaultDocumentIDType
    }
> = async (props) => {
    const { id, title, subtitle, categories, limit = 10, populateBy, selectedDocs } = props

    let products: Product[] = []

    if (populateBy === 'category') {
        const payload = await getPayload({ config: configPromise })

        const flattenedCategories = categories?.length
            ? categories.map((category) => {
                if (typeof category === 'object') return category.id
                else return category
            })
            : null

        const fetchedProducts = await payload.find({
            collection: 'products',
            depth: 1,
            limit: limit || undefined,
            ...(flattenedCategories && flattenedCategories.length > 0
                ? {
                    where: {
                        categories: {
                            in: flattenedCategories,
                        },
                    },
                }
                : {}),
        })

        products = fetchedProducts.docs
    } else if (selectedDocs?.length) {
        products = selectedDocs.map((post) => {
            if (typeof post.value !== 'string') return post.value
        }) as Product[]
    }

    if (!products?.length) return null

    return (
        <div className="w-full pb-12 pt-12 overflow-hidden">
            <ProductCarouselClient
                title={title}
                subtitle={subtitle}
                products={products}
            />
        </div>
    )
}
