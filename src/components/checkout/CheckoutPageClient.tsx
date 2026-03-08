'use client'

import dynamic from 'next/dynamic'

export const CheckoutPageClient = dynamic(() => import('@/components/checkout/CheckoutPage').then(mod => mod.CheckoutPage), {
    ssr: false,
})
