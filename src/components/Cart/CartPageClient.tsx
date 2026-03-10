'use client'

import dynamic from 'next/dynamic'

export const CartPageClient = dynamic(() => import('@/components/Cart/CartPage').then(mod => mod.CartPage), {
    ssr: false,
})
