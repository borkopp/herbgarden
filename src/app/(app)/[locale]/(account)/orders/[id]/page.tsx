import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { ProductItem } from '@/components/ProductItem'
import { AddressItem } from '@/components/addresses/AddressItem'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ArrowLeft01Icon, DeliveryTruck01Icon, Package01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { getDictionary } from '@/i18n/getDictionary'
import type { Locale } from '@/i18n/config'
import { CopyOrderNumber } from './CopyOrderNumber'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string; locale: Locale }>
  searchParams: Promise<{ email?: string }>
}

export default async function Order({ params, searchParams }: PageProps) {
  const { id, locale } = await params
  const t = await getDictionary(locale)
  const { email = '' } = await searchParams
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let order: Order | null = null

  try {
    const {
      docs: [orderResult],
    } = await payload.find({
      collection: 'orders',
      user,
      overrideAccess: !Boolean(user),
      depth: 2,
      where: {
        and: [
          {
            id: {
              equals: id,
            },
          },
          ...(user
            ? [
              {
                customer: {
                  equals: user.id,
                },
              },
            ]
            : []),
          ...(email
            ? [
              {
                customerEmail: {
                  equals: email,
                },
              },
            ]
            : []),
        ],
      },
      select: {
        amount: true,
        currency: true,
        items: true,
        customerEmail: true,
        customer: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        shippingAddress: true,
      },
    })

    const canAccessAsGuest =
      !user &&
      email &&
      orderResult &&
      orderResult.customerEmail &&
      orderResult.customerEmail === email
    const canAccessAsUser =
      user &&
      orderResult &&
      orderResult.customer &&
      (typeof orderResult.customer === 'object'
        ? orderResult.customer.id
        : orderResult.customer) === user.id

    if (orderResult && (canAccessAsGuest || canAccessAsUser)) {
      order = orderResult
    }
  } catch (error) {
    console.error(error)
  }

  if (!order) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-12 w-full max-w-6xl mx-auto py-4">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pb-10 border-b border-black/5">
          <div className="flex flex-col gap-8">
            {user && (
              <Link href="/orders" className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 hover:text-black flex items-center gap-2 transition-all">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
                {t.account.backToAllOrders}
              </Link>
            )}
            <div className="flex flex-col gap-3">
              {/* <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40">Order Summary</span> */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-black uppercase leading-[0.85]">
                {t.cart.order}<br />
                <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #e5e5e5' }}>{t.account.details}</span>
              </h1>
              <p className="text-[11px] text-black/40 font-bold uppercase tracking-widest mt-2">
                {t.account.placedOn} {formatDateTime({ date: order.createdAt, format: 'dd MMMM yyyy' })}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <CopyOrderNumber orderId={order.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 flex flex-col gap-10">
            <div className="bg-white border border-black/5 rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-black/5">
                <HugeiconsIcon icon={Package01Icon} size={20} className="text-black/20" strokeWidth={1.5} />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40">{t.account.orderedProducts}</span>
              </div>

              {order.items && order.items.length > 0 ? (
                <ul className="flex flex-col gap-10">
                  {order.items?.map((item, index) => {
                    if (typeof item.product === 'string') {
                      return null
                    }

                    if (!item.product || typeof item.product !== 'object') {
                      return <div key={index} className="text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 bg-red-50 rounded-2xl">{t.account.productUnavailable}</div>
                    }

                    const variant =
                      item.variant && typeof item.variant === 'object' ? item.variant : undefined

                    return (
                      <li key={item.id} className="group">
                        <ProductItem
                          product={item.product}
                          quantity={item.quantity}
                          variant={variant}
                        />
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="text-center py-10 text-[10px] font-bold uppercase tracking-widest text-black/20">{t.common.clear}</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-8 h-fit">
            <div className="bg-white border border-black/5 rounded-[3rem] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)] flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-black/40">{t.account.currentStatus}</span>
                {order.status ? (
                  <div className="inline-block">
                    <OrderStatus status={order.status} />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-black/40">{t.account.totalAmount}</span>
                {order.amount != null ? (
                  <Price className="text-4xl font-display uppercase tracking-tight text-black" amount={order.amount} />
                ) : (
                  <span className="text-black/20 font-bold uppercase tracking-widest">{t.products.loadingOptions || 'Unknown'}</span>
                )}
              </div>
            </div>

            {order.shippingAddress && (
              <div className="bg-white border border-black/5 rounded-[3rem] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                    <HugeiconsIcon icon={DeliveryTruck01Icon} size={20} className="text-black/20" strokeWidth={1.5} />
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40">{t.account.shippingTo}</span>
                  </div>
                  {/* @ts-expect-error - address issues */}
                  <AddressItem address={order.shippingAddress} hideActions />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, locale } = await params
  const t = await getDictionary(locale)

  return {
    description: `${t.account.details} ${t.cart.order} ${id}.`,
    openGraph: mergeOpenGraph({
      title: `${t.cart.order} ${id}`,
      url: `/${locale}/orders/${id}`,
    }),
    title: `${t.cart.order} ${id}`,
  }
}
