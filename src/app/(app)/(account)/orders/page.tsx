import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { HugeiconsIcon } from '@hugeicons/react'
import { Dollar01Icon, Package01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function Orders() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let orders: Order[] | null = null

  if (!user) {
    redirect(`/login?warning=${encodeURIComponent('Ве молиме најавете се за да пристапите до вашите нарачки.')}`)
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
  } catch (error) { }

  const totalSpent = orders?.reduce((acc, order) => acc + (order.amount || 0), 0) || 0
  const averageOrderValue = orders && orders.length > 0 ? totalSpent / orders.length : 0

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-stone-900 dark:text-stone-100 tracking-tight">Мои нарачки</h1>
          <p className="text-stone-500 mt-2">Прегледајте ги и управувајте со вашите минати купувања.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-stone-950 rounded-3xl border border-stone-200/60 dark:border-stone-800 overflow-hidden">
        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 dark:bg-stone-900/30">
                <th className="px-8 py-5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Број</th>
                <th className="px-8 py-5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Датум</th>
                <th className="px-8 py-5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Вкупна цена</th>
                <th className="px-8 py-5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Статус</th>
                <th className="px-8 py-5 text-xs font-semibold text-stone-500 uppercase tracking-wider text-right">Активности</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-stone-500">
                    Сè уште немате нарачки.
                  </td>
                </tr>
              )}
              {orders && orders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors border-b border-stone-100 dark:border-stone-800/50 last:border-0">
                  <td className="px-8 py-6">
                    <span className="font-medium text-stone-900 dark:text-stone-100 uppercase tracking-wider text-sm">#{order.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-8 py-6 text-stone-500 dark:text-stone-400 text-sm">
                    {formatDateTime({ date: order.createdAt, format: 'MMM dd, yyyy' })}
                  </td>
                  <td className="px-8 py-6 font-medium text-stone-900 dark:text-stone-100">
                    {order.amount ? <Price as="span" amount={order.amount} currencyCode={order.currency ?? undefined} /> : '-'}
                  </td>
                  <td className="px-8 py-6">
                    {order.status && <OrderStatus status={order.status} />}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link href={`/orders/${order.id}`} className="text-stone-900 dark:text-stone-100 hover:opacity-70 font-medium text-sm transition-opacity">Детали</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-stone-100 dark:divide-stone-800">
          {(!orders || orders.length === 0) && (
            <div className="px-6 py-8 text-center text-stone-500">
              Сè уште немате нарачки.
            </div>
          )}
          {orders && orders.map((order) => (
            <div key={order.id} className="p-6 flex flex-col gap-5 border-b border-stone-100 dark:border-stone-800/50 last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-stone-900 dark:text-stone-100 uppercase tracking-wider text-sm">#{order.id.slice(0, 8)}</span>
                  <span className="text-sm text-stone-500">
                    {formatDateTime({ date: order.createdAt, format: 'MMM dd, yyyy' })}
                  </span>
                </div>
                {order.status && <OrderStatus status={order.status} />}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-widest">Износ</span>
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    {order.amount ? <Price as="span" amount={order.amount} currencyCode={order.currency ?? undefined} /> : '-'}
                  </span>
                </div>
                <Link
                  href={`/orders/${order.id}`}
                  className="bg-black dark:bg-white px-5 py-2.5 rounded-full text-white dark:text-black font-medium text-sm hover:opacity-80 active:scale-95 transition-all"
                >
                  Детали
                </Link>
              </div>
            </div>
          ))}
        </div>

        {orders && orders.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-800/20">
            <p className="text-sm text-stone-500 font-medium">Прикажани {orders.length} нарачки</p>
          </div>
        )}
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="bg-white dark:bg-stone-950 p-6 md:p-8 rounded-3xl border border-stone-200/60 dark:border-stone-800 flex items-center gap-5">
          <div className="size-14 rounded-full bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex items-center justify-center">
            <HugeiconsIcon icon={Package01Icon} size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm text-stone-500">Вкупно нарачки</p>
            <p className="text-2xl font-light tracking-tight">{orders?.length || 0}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-stone-950 p-6 md:p-8 rounded-3xl border border-stone-200/60 dark:border-stone-800 flex items-center gap-5">
          <div className="size-14 rounded-full bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex items-center justify-center">
            <HugeiconsIcon icon={Dollar01Icon} size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm text-stone-500">Вкупно потрошено</p>
            <p className="text-2xl font-light tracking-tight">{totalSpent.toLocaleString()} ден</p>
          </div>
        </div>
        <div className="bg-white dark:bg-stone-950 p-6 md:p-8 rounded-3xl border border-stone-200/60 dark:border-stone-800 flex items-center gap-5">
          <div className="size-14 rounded-full bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex items-center justify-center">
            <HugeiconsIcon icon={ArrowUp01Icon} size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm text-stone-500">Просечна вредност</p>
            <p className="text-2xl font-light tracking-tight">{Math.round(averageOrderValue).toLocaleString()} ден</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Вашите нарачки.',
  openGraph: mergeOpenGraph({
    title: 'Нарачки',
    url: '/orders',
  }),
  title: 'Нарачки',
}
