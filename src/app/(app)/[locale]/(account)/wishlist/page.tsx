import configPromise from '@payload-config'
import { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import { WishlistClient } from './page.client'

import { getDictionary } from '@/i18n/getDictionary'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{
    locale: Locale
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getDictionary(locale)

  return {
    description: t.wishlist.wishlist,
    title: `${t.wishlist.wishlist} | Herb Garden`,
  }
}

export default async function WishlistPage({ params }: Props) {
    const { locale } = await params
    const t = await getDictionary(locale)
    const headers = await getHeaders()
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers })

    return (
        <div className="flex flex-col gap-12 w-full max-w-6xl mx-auto py-4">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
                <div className="mb-10">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-black uppercase leading-[0.85]">
                        {t.cart.my}<br />
                        <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #e5e5e5' }}>{t.wishlist.wishlist}</span>
                    </h1>
                </div>

                <div className="bg-white border border-black/5 rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)]">
                    <WishlistClient />
                </div>
            </div>
        </div>
    )
}
