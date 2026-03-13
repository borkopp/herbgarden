import type { Metadata } from 'next'

import { AddressListing } from '@/components/addresses/AddressListing'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { Order } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { getDictionary } from '@/i18n/getDictionary'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{
    locale: Locale
  }>
}

export default async function AddressesPage({ params }: Props) {
  const { locale } = await params
  const t = await getDictionary(locale)
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let orders: Order[] | null = null

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent(t.account.loginWarning)}`,
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
    <div className="flex flex-col gap-12 w-full max-w-6xl mx-auto py-4">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
          <div>
            {/* <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mb-3 block">Shipping Details</span> */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-black uppercase leading-[0.85]">
              {t.account.saved}<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #e5e5e5' }}>{t.account.addresses}</span>
            </h1>
          </div>
          <CreateAddressModal />
        </div>

        <div className="bg-white border border-black/5 rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)]">
          <AddressListing />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getDictionary(locale)

  return {
    description: t.account.addressesDescription,
    openGraph: mergeOpenGraph({
      title: t.account.addresses,
      url: `/${locale}/account/addresses`,
    }),
    title: t.account.addresses,
  }
}
