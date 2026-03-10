import type { Metadata } from 'next'

import { AccountForm } from '@/components/forms/AccountForm'
import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { Order } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function AccountPage() {
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
      <div className="mb-2">
        <h1 className="text-3xl md:text-4xl font-light text-stone-900 dark:text-stone-100 tracking-tight">Поставки на профилот</h1>
        <p className="text-stone-500 mt-2">Управувајте со деталите и преференциите на вашиот профил.</p>
      </div>

      <div className="bg-white dark:bg-stone-950 rounded-3xl border border-stone-200/60 dark:border-stone-800 p-6 md:p-10">
        <AccountForm />
      </div>

      <div className="mt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-light text-stone-900 dark:text-stone-100 tracking-tight">Последни нарачки</h2>
            <p className="text-stone-500 mt-2 text-sm">Вашите најнови купувања.</p>
          </div>
          <Link href="/orders" className="text-stone-900 dark:text-stone-100 hover:opacity-70 font-medium text-sm flex items-center gap-1 transition-opacity">
            Сите нарачки
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="bg-white dark:bg-stone-950 rounded-3xl border border-stone-200/60 dark:border-stone-800 overflow-hidden">
          <div className="overflow-x-auto">
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
                      Немате неодамнешни нарачки.
                    </td>
                  </tr>
                )}
                {orders && orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors">
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
                    <td className="px-8 py-6 text-right flex items-center justify-end gap-2">
                      <Link href={`/orders/${order.id}`} className="text-stone-900 dark:text-stone-100 font-medium text-sm hover:opacity-70 transition-opacity">Детали</Link>
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

export const metadata: Metadata = {
  description: 'Креирајте профил или најавете се на вашиот постоечки профил.',
  openGraph: mergeOpenGraph({
    title: 'Профил',
    url: '/account',
  }),
  title: 'Профил',
}
