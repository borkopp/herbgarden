import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { ProductItem } from '@/components/ProductItem'
import { AddressItem } from '@/components/addresses/AddressItem'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { ChevronLeftIcon, PackageIcon, TruckIcon } from 'lucide-react'
import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { CopyOrderNumber } from './CopyOrderNumber'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ email?: string }>
}

export default async function Order({ params, searchParams }: PageProps) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { id } = await params
  const { email = '' } = await searchParams

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
    <div className=" mx-auto w-full px-4 md:px-4 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="flex flex-col gap-2">
          {user && (
            <Button asChild variant="ghost" className="-ml-3 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-start max-w-fit mb-2">
              <Link href="/orders">
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                Сите нарачки
              </Link>
            </Button>
          )}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-bold tracking-tight">Детали за нарачката</h1>
            <p className="text-stone-500 text-sm">
              Нарачано на{' '}
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                <time dateTime={order.createdAt}>
                  {formatDateTime({ date: order.createdAt, format: 'dd MMMM yyyy' })}
                </time>
              </span>
            </p>
          </div>
        </div>
        <CopyOrderNumber orderId={order.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="p-6 md:p-8 bg-white border border-stone-200 rounded-3xl">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-200">
              <PackageIcon className="w-6 h-6 text-primary/70" />
              <h2 className="text-xl font-bold text-stone-900">Производи</h2>
            </div>

            {order.items && order.items.length > 0 ? (
              <ul className="flex flex-col gap-8">
                {order.items?.map((item, index) => {
                  if (typeof item.product === 'string') {
                    return null
                  }

                  if (!item.product || typeof item.product !== 'object') {
                    return <div key={index} className="text-red-500 text-sm italic">Овој производ повеќе не е достапен.</div>
                  }

                  const variant =
                    item.variant && typeof item.variant === 'object' ? item.variant : undefined

                  return (
                    <li key={item.id}>
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
              <div className="text-center py-6 text-stone-500 italic">Нема производи.</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8 h-fit">
          <div className="p-6 md:p-8 bg-white border border-stone-200 rounded-3xl flex flex-col gap-6">
            <div className="flex flex-col gap-2 pb-6 border-b border-stone-200">
              <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">Статус</p>
              {order.status ? <OrderStatus className="mt-1 font-bold text-sm bg-primary/20 p-2 px-3 text-primary text-center" status={order.status} /> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">Вкупно</p>
              {order.amount != null ? (
                <Price className="text-3xl font-bold text-stone-900 mt-1" amount={order.amount} />
              ) : (
                <span className="text-stone-400 mt-2">Непознато</span>
              )}
            </div>
          </div>

          {order.shippingAddress && (
            <div className="p-6 md:p-8 bg-white border border-stone-200 rounded-3xl">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <TruckIcon className="w-5 h-5 text-primary/70" />
                  <h2 className="text-lg font-bold text-stone-900">Достава до</h2>
                </div>
                {/* @ts-expect-error - address issues */}
                <AddressItem address={order.shippingAddress} hideActions />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  return {
    description: `Детали за нарачка ${id}.`,
    openGraph: mergeOpenGraph({
      title: `Нарачка ${id}`,
      url: `/orders/${id}`,
    }),
    title: `Нарачка ${id}`,
  }
}
