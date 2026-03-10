import type { Metadata } from 'next'

import { CartPageClient } from '@/components/Cart/CartPageClient'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default function Cart() {
  return (
    <div className="container min-h-[90vh] flex">
      <h1 className="sr-only">Selection</h1>
      <CartPageClient />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Manage your selection.',
  openGraph: mergeOpenGraph({
    title: 'Selection',
    url: '/cart',
  }),
  title: 'Selection',
}
