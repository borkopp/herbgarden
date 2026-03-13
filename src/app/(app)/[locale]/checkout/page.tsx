import type { Metadata } from 'next'

import { CheckoutPageClient } from '@/components/checkout/CheckoutPageClient'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default function Checkout() {
  return (
    <div className="container min-h-[90vh] flex">
      <CheckoutPageClient />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Checkout.',
  openGraph: mergeOpenGraph({
    title: 'Checkout',
    url: '/checkout',
  }),
  title: 'Checkout',
}
