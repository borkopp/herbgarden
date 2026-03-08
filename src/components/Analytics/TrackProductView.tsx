'use client'

import { useEffect } from 'react'
import { trackGAEvent } from '@/utilities/analytics'
import type { Product } from '@/payload-types'
import posthog from 'posthog-js'

export const TrackProductView: React.FC<{ product: Product }> = ({ product }) => {
  useEffect(() => {
    trackGAEvent('view_item', {
      currency: 'MKD',
      value: product.priceInMKD,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          price: product.priceInMKD,
        },
      ],
    })
    posthog.capture('product_viewed', {
      product_id: product.id,
      product_name: product.title,
      product_slug: product.slug,
      price: product.priceInMKD,
      currency: 'MKD',
    })
  }, [product])

  return null
}
