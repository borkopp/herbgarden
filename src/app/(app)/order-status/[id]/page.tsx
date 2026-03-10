import { TrackPurchase } from '@/components/Analytics/TrackPurchase'
import { Media } from '@/components/Media'
import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Address } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'
import { CheckmarkCircle01Icon, DeliveryTruck01Icon, MapPinIcon, Package01Icon, ShoppingBag01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import configPromise from '@payload-config'
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
        <div className="min-h-screen bg-white py-12 md:py-32 animate-in fade-in duration-1000">
            <TrackPurchase order={order} />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="mb-20 md:mb-32">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="flex-1">
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-6 block">
                                THANK YOU
                            </span>
                            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.85] tracking-tighter text-black uppercase">
                                ORDER<br />
                                <span className="text-transparent" style={{ WebkitTextStroke: '2px #e5e5e5' }}>CONFIRMED</span>
                            </h1>

                        </div>
                        <div className="shrink-0 flex flex-col items-center md:items-end gap-4 p-8 bg-[#f6f6f6] rounded-[2rem] min-w-[240px]">
                            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white mb-2 shadow-2xl shadow-black/10">
                                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={32} strokeWidth={1.5} />
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-black/40 mb-1">Order ID</p>
                                <p className="text-xl font-bold text-black uppercase tracking-tighter">#{order.id.toString().slice(-6).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                    {/* Left: Progress & Items */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-16">

                        {/* Summary Card */}
                        <div className="p-10 bg-[#f6f6f6] rounded-[2.5rem]">
                            <div className="flex flex-wrap justify-between items-start gap-8 mb-12 pb-8 border-b border-black/5">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-black/40 mb-2">Order Status</p>
                                    <div className="inline-flex">
                                        <OrderStatus status={order.status || 'pending'} className="text-[10px] uppercase font-bold tracking-widest px-6 py-2.5 bg-white rounded-full border border-black/5 shadow-sm" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-black/40 mb-2">Order Date</p>
                                    <p className="text-xs font-bold text-black uppercase tracking-widest leading-none">
                                        {formatDateTime({ date: order.createdAt, format: 'dd MMMM yyyy' })}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-3 text-black">
                                    <HugeiconsIcon icon={ShoppingBag01Icon} size={20} strokeWidth={1.5} />
                                    <h3 className="text-xs font-bold uppercase tracking-widest">Your Items</h3>
                                </div>
                                <ul className="space-y-8">
                                    {items.map((item, index) => {
                                        if (!item.product || typeof item.product !== 'object') return null
                                        const product = item.product
                                        const image = (product as any).gallery?.[0]?.image || product.meta?.image
                                        const variant = item.variant && typeof item.variant === 'object' ? item.variant : null

                                        let price = (product as any).priceInMKD
                                        if (variant && (variant as any).priceInMKD) {
                                            price = (variant as any).priceInMKD
                                        }

                                        return (
                                            <li key={item.id || index} className="flex gap-6 items-center">
                                                <div className="w-20 h-20 rounded-[1.5rem] bg-white overflow-hidden shrink-0 relative border border-black/5 shadow-sm group">
                                                    {image && typeof image !== 'string' ? (
                                                        <Media resource={image} fill imgClassName="object-contain p-4 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                            <HugeiconsIcon icon={Package01Icon} size={24} strokeWidth={1.5} />
                                                        </div>
                                                    )}
                                                    <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#f6f6f6]">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col justify-center gap-1.5 overflow-hidden">
                                                    <p className="text-[11px] font-bold text-black uppercase tracking-widest leading-tight truncate">
                                                        {product.title}
                                                    </p>
                                                    {variant && (
                                                        <p className="text-[9px] uppercase tracking-[0.15em] text-black/40 font-bold">
                                                            {(variant as any).options?.map((opt: any) => typeof opt === 'object' ? opt.label : '').join(' • ')}
                                                        </p>
                                                    )}
                                                    <Price amount={price} className="text-[11px] font-bold text-black" />
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>

                                <div className="pt-8 border-t border-black/5 space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-black/40">
                                        <span>Subtotal</span>
                                        <Price amount={order.amount || 0} className="text-black" />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-black/40">
                                        <span>Logistics</span>
                                        {isFreeShipping ? (
                                            <span className="text-black uppercase tracking-widest">Free</span>
                                        ) : (
                                            <Price amount={150} className="text-black" />
                                        )}
                                    </div>
                                    <div className="pt-6 flex justify-between items-center text-xl font-display text-black uppercase tracking-widest">
                                        <span>Total</span>
                                        <Price amount={(order.amount || 0) + (isFreeShipping ? 0 : 150)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Logistics & Next Steps */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-12">

                        {/* Shipping Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-black">
                                <HugeiconsIcon icon={MapPinIcon} size={20} strokeWidth={1.5} />
                                <h3 className="text-xs font-bold uppercase tracking-widest">Shipping Address</h3>
                            </div>
                            {shippingAddress ? (
                                <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm space-y-4">
                                    <p className="text-[11px] font-bold text-black uppercase tracking-widest">
                                        {shippingAddress.firstName} {shippingAddress.lastName}
                                    </p>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-black/40 leading-relaxed space-y-1">
                                        <p>{shippingAddress.addressLine1}</p>
                                        <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
                                        {shippingAddress.country && <p>{shippingAddress.country}</p>}
                                        <p className="pt-2 text-black/60 flex items-center gap-2">
                                            CONTACT: {shippingAddress.phone}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-stone-500 italic text-[10px] uppercase font-bold tracking-widest">No address specified.</p>
                            )}
                        </div>

                        {/* Payment Confirmation */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-black">
                                <HugeiconsIcon icon={DeliveryTruck01Icon} size={20} strokeWidth={1.5} />
                                <h3 className="text-xs font-bold uppercase tracking-widest">Payment Method</h3>
                            </div>
                            <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
                                <p className="text-[11px] font-bold text-black uppercase tracking-widest mb-2">
                                    Cash on Delivery
                                </p>
                                <p className="text-[10px] font-medium leading-relaxed text-black/40">
                                    You will pay the courier in cash when you receive your order.
                                </p>
                            </div>
                        </div>

                        {/* CTA / Support */}
                        <div className="pt-8 space-y-4">
                            <Button asChild className="w-full h-16 rounded-full bg-black text-white hover:bg-black/90 text-[10px] font-bold uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98]">
                                <Link href="/shop">Continue Shopping</Link>
                            </Button>
                            <p className="text-[9px] uppercase tracking-widest text-black/30 font-bold text-center px-4 leading-relaxed">
                                Order status is updated in real-time. Contact us if you have any questions.
                            </p>
                        </div>

                    </div>
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
