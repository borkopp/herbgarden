import type { Metadata } from 'next'

import { AccountForm } from '@/components/forms/AccountForm'
import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { Order } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { getDictionary } from '@/i18n/getDictionary'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{
    locale: Locale
  }>
}

export default async function AccountPage({ params }: Props) {
  const { locale } = await params
  const t = await getDictionary(locale)
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let orders: Order[] | null = null

  if (!user) {
    redirect(`/${locale}/login?warning=${encodeURIComponent(t.account.loginWarning)}`)
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
    <div className="flex flex-col gap-16 w-full max-w-6xl mx-auto py-4">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
        <div className="mb-10">
          {/* <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mb-3 block">Profile Overview</span> */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-black uppercase leading-[0.85]">
            {t.account.accountSettingsTitle1}
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #e5e5e5' }}>
              {t.account.accountSettingsTitle2}
            </span>
          </h1>
        </div>

        <div className="bg-white border border-black/5 rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)]">
          <AccountForm />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mb-3 block">
              {t.account.purchaseHistory}
            </span>
            <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-black uppercase leading-none">
              {t.account.recentOrders}
            </h2>
          </div>
          <Link
            href="/orders"
            className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 hover:text-black flex items-center gap-2 transition-all"
          >
            {t.account.viewAllOrders}
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
          </Link>
        </div>

        <div className="bg-white border border-black/5 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f6f6f6]">
                  <th className="px-10 py-6 text-[9px] font-bold text-black/40 uppercase tracking-[0.2em]">
                    {t.common.id}
                  </th>
                  <th className="px-10 py-6 text-[9px] font-bold text-black/40 uppercase tracking-[0.2em]">
                    {t.common.date}
                  </th>
                  <th className="px-10 py-6 text-[9px] font-bold text-black/40 uppercase tracking-[0.2em]">
                    {t.common.amount}
                  </th>
                  <th className="px-10 py-6 text-[9px] font-bold text-black/40 uppercase tracking-[0.2em]">
                    {t.common.status}
                  </th>
                  <th className="px-10 py-6 text-[9px] font-bold text-black/40 uppercase tracking-[0.2em] text-right">
                    {t.common.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {(!orders || orders.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-10 py-20 text-center text-xs font-medium text-black/40 uppercase tracking-widest leading-loose"
                    >
                      {t.account.noRecentOrders}
                    </td>
                  </tr>
                )}
                {orders &&
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors group">
                      <td className="px-10 py-8">
                        <span className="font-bold text-black uppercase tracking-[0.1em] text-[11px]">
                          #{order.id.slice(-8)}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-black/60 text-xs font-medium uppercase tracking-tight">
                        {formatDateTime({ date: order.createdAt, format: 'MMM dd, yyyy' })}
                      </td>
                      <td className="px-10 py-8 font-bold text-black text-sm">
                        {order.amount ? (
                          <Price
                            as="span"
                            amount={order.amount}
                            currencyCode={order.currency ?? undefined}
                          />
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-10 py-8">
                        {order.status && <OrderStatus status={order.status} />}
                      </td>
                      <td className="px-10 py-8 text-right">
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center justify-center h-10 px-6 rounded-full border border-black/5 text-[9px] font-bold tracking-[0.15em] uppercase text-black hover:bg-black hover:text-white transition-all"
                        >
                          {t.account.details}
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getDictionary(locale)

  return {
    description: t.account.accountSettings,
    openGraph: mergeOpenGraph({
      title: t.account.account,
      url: `/${locale}/account`,
    }),
    title: t.account.account,
  }
}
