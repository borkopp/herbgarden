import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export default function ConfirmOrderPage() {
  // This page is no longer used in the cash-on-delivery flow.
  // Orders are confirmed immediately on the checkout page.
  redirect('/checkout')
}

export const metadata: Metadata = {
  description: 'Потврдување на нарачката.',
  openGraph: mergeOpenGraph({
    title: 'Потврдување на нарачката',
    url: '/checkout/confirm-order',
  }),
  title: 'Потврдување на нарачката',
}
