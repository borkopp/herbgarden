import type { Metadata } from 'next'

import { CheckoutPageClient } from '@/components/checkout/CheckoutPageClient'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default function Checkout() {
  return (
    <div className="container min-h-[90vh] flex">
      <h1 className="sr-only">Нарачај</h1>
      <CheckoutPageClient />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Нарачај.',
  openGraph: mergeOpenGraph({
    title: 'Нарачај',
    url: '/checkout',
  }),
  title: 'Нарачај',
}
