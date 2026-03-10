import type { Metadata } from 'next'

import { AddressListing } from '@/components/addresses/AddressListing'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { Order } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function AddressesPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let orders: Order[] | null = null

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent('Ве молиме најавете се за да пристапите до поставките на вашиот профил.')}`,
    )
  }

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 5,
      user,
      overrideAccess: false,
      pagination: false,
      where: {
        customer: {
          equals: user?.id,
        },
      },
    })

    orders = ordersResult?.docs || []
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="mb-2">
          <h1 className="text-3xl md:text-4xl font-light text-stone-900 dark:text-stone-100 tracking-tight">Адреси</h1>
          <p className="text-stone-500 mt-2">Управувајте со вашите адреси за достава.</p>
        </div>
        <CreateAddressModal />
      </div>

      <div className="bg-white dark:bg-stone-950 rounded-3xl border border-stone-200/60 dark:border-stone-800 p-6 md:p-10">
        <AddressListing />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Управувајте со вашите адреси.',
  openGraph: mergeOpenGraph({
    title: 'Адреси',
    url: '/account/addresses',
  }),
  title: 'Адреси',
}
