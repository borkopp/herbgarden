'use client'

import { useEffect } from 'react'
import { trackGAEvent } from '@/utilities/analytics'

export const TrackPurchase: React.FC<{ order: any }> = ({ order }) => {
  useEffect(() => {
    // Only track purchase once
    const sessionKey = `ga_purchase_tracked_${order.id}`
    if (sessionStorage.getItem(sessionKey)) return

    trackGAEvent('purchase', {
      transaction_id: order.id,
      value: order.amount,
      currency: 'MKD',
      items: order.items?.map((item: any) => ({
        item_id: item.product?.id || item.product,
        item_name: item.product?.title,
        price: item.variant?.priceInMKD || item.product?.priceInMKD,
        quantity: item.quantity,
      })),
    })

    sessionStorage.setItem(sessionKey, 'true')
  }, [order])

  return null
}
