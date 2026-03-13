import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import type { Order } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'

type Props = {
  params: Promise<{
    locale: Locale
  }>
}

export default async function Orders({ params }: Props) {
  const { locale } = await params
  const t = await getDictionary(locale)
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let orders: Order[] | null = null

  if (!user) {
    redirect(`/${locale}/login?warning=${encodeURIComponent(t.account.ordersLoginWarning)}`)
  }

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 0,
      pagination: false,
      user,
      overrideAccess: false,
      where: {
        customer: {
          equals: user?.id,
        },
      },
    })

    orders = ordersResult?.docs || []
  } catch (error) {}

  const totalSpent = orders?.reduce((acc, order) => acc + (order.amount || 0), 0) || 0
  const averageOrderValue = orders && orders.length > 0 ? totalSpent / orders.length : 0

  return (
    <div className="flex flex-col gap-12 w-full max-w-6xl mx-auto py-4">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
        <div className="mb-10">
          {/* <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mb-3 block">Review History</span> */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-black uppercase leading-[0.85]">
            {t.account.ordersTitle1}
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #e5e5e5' }}>
              {t.account.ordersTitle2}
            </span>
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#f6f6f6] p-8 rounded-[2rem] border border-black/5 flex flex-col gap-2">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40">
              {t.account.totalOrders}
            </span>
            <p className="font-display text-4xl text-black leading-none">{orders?.length || 0}</p>
          </div>
          <div className="bg-[#f6f6f6] p-8 rounded-[2rem] border border-black/5 flex flex-col gap-2">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40">
              {t.account.totalSpent}
            </span>
            <p className="font-display text-4xl text-black leading-none">
              {totalSpent.toLocaleString()} {t.common.mkd}
            </p>
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)]">
          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f6f6f6]">
                  <th className="px-10 py-6 text-[9px] font-bold text-black/40 uppercase tracking-[0.2em]">
                    {t.account.orderId}
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
                      {t.account.noOrdersFound}
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

          {/* Mobile View: Cards */}
          <div className="md:hidden divide-y divide-black/5">
            {(!orders || orders.length === 0) && (
              <div className="px-8 py-20 text-center text-xs font-medium text-black/40 uppercase tracking-widest">
                {t.account.noOrdersFound}
              </div>
            )}
            {orders &&
              orders.map((order) => (
                <div key={order.id} className="p-8 flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-black uppercase tracking-[0.1em] text-[11px]">
                        #{order.id.slice(-8)}
                      </span>
                      <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest">
                        {formatDateTime({ date: order.createdAt, format: 'MMM dd, yyyy' })}
                      </span>
                    </div>
                    {order.status && <OrderStatus status={order.status} />}
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-bold text-black/20 tracking-widest">
                        {t.account.totalAmount}
                      </span>
                      <span className="font-bold text-black text-lg">
                        {order.amount ? (
                          <Price
                            as="span"
                            amount={order.amount}
                            currencyCode={order.currency ?? undefined}
                          />
                        ) : (
                          '-'
                        )}
                      </span>
                    </div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="h-10 px-6 rounded-full border border-black/5 text-[9px] font-bold tracking-[0.15em] uppercase text-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                    >
                      {t.account.details}
                    </Link>
                  </div>
                </div>
              ))}
          </div>

          {orders && orders.length > 0 && (
            <div className="px-10 py-6 border-t border-black/5 bg-[#f6f6f6]/30">
              <p className="text-[9px] font-bold tracking-[0.2em] text-black/40 uppercase">
                {t.account.totalItems}: {orders.length} {t.account.items_plural}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getDictionary(locale)

  return {
    description: t.account.purchaseHistory,
    openGraph: mergeOpenGraph({
      title: t.account.orders,
      url: `/${locale}/orders`,
    }),
    title: t.account.orders,
  }
}
