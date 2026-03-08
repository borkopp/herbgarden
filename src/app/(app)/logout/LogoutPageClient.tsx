'use client'

import dynamic from 'next/dynamic'

export const LogoutPageClient = dynamic(() => import('@/app/(app)/logout/LogoutPage').then(mod => mod.LogoutPage), {
    ssr: false,
})
