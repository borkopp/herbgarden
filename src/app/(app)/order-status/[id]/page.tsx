import { TrackPurchase } from '@/components/Analytics/TrackPurchase'
import { Media } from '@/components/Media'
import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Address } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'
import configPromise from '@payload-config'
import { CheckCircle2, MapPin, Package, ShoppingBag, Truck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function OrderStatusPage({ params }: PageProps) {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })

    let order
    try {
        const { docs } = await payload.find({
            collection: 'orders',
            depth: 2,
            where: {
                id: {
                    equals: id,
                },
            },
            overrideAccess: true, // Bypass access control to allow anyone with the link to see the status
        })
        order = docs[0]
    } catch (error) {
        console.error('Error fetching order', error)
    }

    if (!order) {
        notFound()
    }

    const items = order.items || []
    const shippingAddress = order.shippingAddress as Address | undefined | null
    const isFreeShipping = order.amount != null && order.amount >= 3000

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 md:py-24 animate-in fade-in duration-700">
            <TrackPurchase order={order} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 mb-6 shadow-xl shadow-green-500/10">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
                        Ви благодариме!
                    </h1>
                    <p className="text-lg text-stone-500 font-medium max-w-lg mx-auto">
                        Вашата нарачка е успешно примена и се процесира. Наскоро ќе ја добиете на вашата адреса.
                    </p>
                </div>

                {/* Status Card */}
                <div className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden mb-8">
                    <div className="p-8 md:p-10 border-b border-stone-100 dark:border-stone-800 bg-primary/5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-1">Број на нарачка</p>
                                <p className="text-2xl font-black text-stone-900 dark:text-stone-100">#{order.id}</p>
                                <p className="text-sm text-stone-500 mt-2 font-medium">
                                    Нарачано на{' '}
                                    <time dateTime={order.createdAt}>
                                        {formatDateTime({ date: order.createdAt, format: 'dd MMMM yyyy' })}
                                    </time>
                                </p>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-2">Моментален статус</p>
                                <div className="inline-flex">
                                    <OrderStatus status={order.status || 'pending'} className="text-sm px-6 py-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100 dark:divide-stone-800">
                        {/* Products List */}
                        <div className="p-8 md:p-10 flex flex-col gap-6">
                            <div className="flex items-center gap-3 text-stone-900 dark:text-stone-100">
                                <ShoppingBag className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-bold">Производи</h3>
                            </div>
                            <ul className="space-y-6">
                                {items.map((item, index) => {
                                    if (!item.product || typeof item.product !== 'object') return null
                                    const product = item.product
                                    const image = product.meta?.image || (product as any).gallery?.[0]?.image
                                    const variant = item.variant && typeof item.variant === 'object' ? item.variant : null

                                    let price = (product as any).priceInMKD
                                    if (variant && (variant as any).priceInMKD) {
                                        price = (variant as any).priceInMKD
                                    }

                                    return (
                                        <li key={item.id || index} className="flex gap-4 group">
                                            <div className="w-20 h-20 rounded-2xl bg-stone-100 dark:bg-stone-800 overflow-hidden shrink-0 relative border border-stone-200 dark:border-stone-700">
                                                {image && typeof image !== 'string' ? (
                                                    <Media resource={image} fill imgClassName="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                                                        <Package className="w-6 h-6" />
                                                    </div>
                                                )}
                                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex flex-col justify-center gap-1">
                                                <p className="font-bold text-stone-900 dark:text-stone-100 leading-tight">
                                                    {product.title}
                                                </p>
                                                {variant && (
                                                    <p className="text-xs uppercase tracking-widest text-stone-500 font-bold">
                                                        {(variant as any).options?.map((opt: any) => typeof opt === 'object' ? opt.label : '').join(' • ')}
                                                    </p>
                                                )}
                                                <Price amount={price} className="text-sm font-black text-primary" />
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>

                            <div className="mt-auto pt-6 border-t border-stone-100 dark:border-stone-800">
                                <div className="flex justify-between items-center mb-2 text-stone-500 text-sm font-medium">
                                    <span>Вкупно производи</span>
                                    <Price amount={order.amount || 0} />
                                </div>
                                <div className="flex justify-between items-center mb-4 text-stone-500 text-sm font-medium">
                                    <span>Достава</span>
                                    {isFreeShipping ? (
                                        <span className="text-green-500 font-bold uppercase tracking-widest text-xs">Бесплатна</span>
                                    ) : (
                                        <span>150 ден</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tight">Вкупно <span className="text-xs text-stone-400 ml-1 font-medium">(со вклучен ДДВ)</span></span>
                                    <Price amount={(order.amount || 0) + (isFreeShipping ? 0 : 150)} className="text-2xl font-black text-stone-900 dark:text-stone-100" />
                                </div>
                            </div>
                        </div>

                        {/* Shipping & Payment Info */}
                        <div className="p-8 md:p-10 flex flex-col gap-10 bg-stone-50/50 dark:bg-stone-900/50">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-stone-900 dark:text-stone-100">
                                    <MapPin className="w-6 h-6 text-primary" />
                                    <h3 className="text-xl font-bold">Адреса за достава</h3>
                                </div>
                                {shippingAddress ? (
                                    <div className="text-stone-600 dark:text-stone-400 font-medium leading-relaxed bg-white dark:bg-stone-950 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
                                        <p className="font-bold text-stone-900 dark:text-stone-100 text-lg mb-2">
                                            {shippingAddress.firstName} {shippingAddress.lastName}
                                        </p>
                                        <p>{shippingAddress.addressLine1}</p>
                                        <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
                                        {shippingAddress.country && <p>{shippingAddress.country}</p>}
                                        <p className="mt-3 text-stone-500 flex items-center gap-2">
                                            <span className="font-bold uppercase tracking-widest text-xs text-stone-400">ТЕЛ:</span> {shippingAddress.phone}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-stone-500 italic">Не е наведена адреса за достава.</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-stone-900 dark:text-stone-100">
                                    <Truck className="w-6 h-6 text-primary" />
                                    <h3 className="text-xl font-bold">Начин на плаќање</h3>
                                </div>
                                <div className="bg-white dark:bg-stone-950 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
                                    <p className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                        Плаќање при достава
                                    </p>
                                    <p className="text-sm text-stone-500 mt-2">
                                        (Ќе платите во готово на курирот при подигнување на пратката)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Button asChild size="lg" className="rounded-full px-10 h-14 font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                        <Link href="/shop">Продолжи со купување</Link>
                    </Button>
                </div>

            </div>
        </div>
    )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    return {
        title: `Статус на нарачка #${id} | Herb Garden`,
        description: `Проверете го статусот на вашата нарачка #${id}`,
    }
}
