'use client'

import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Product } from '@/payload-types'
import {
  ArrowRight01Icon,
  CreditCardIcon,
  Delete02Icon,
  MinusSignIcon,
  PlusSignIcon,
  ShoppingBag01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import { useMemo } from 'react'

import { LoadingSpinner } from '@/components/LoadingSpinner'

import { useLocale } from '@/providers/Locale'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
}

export function CartPage() {
  const { cart, decrementItem, incrementItem, removeItem, isLoading } = useCart()
  const { dict: t, locale } = useLocale()

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

  const cartTotalMKD = useMemo(() => {
    if (!cart?.items?.length) return 0
    return cart.items.reduce((total, item) => {
      const product = item.product
      const variant = item.variant

      let price = 0
      if (typeof product === 'object' && product !== null) {
        price = (product as Product).priceInMKD || 0
      }

      const isVariant = Boolean(variant) && typeof variant === 'object'
      if (isVariant && variant) {
        price = (variant as any).priceInMKD || price
      }

      return total + price * (item.quantity || 1)
    }, 0)
  }, [cart])

  const shippingCost = cartTotalMKD >= 3000 ? 0 : 150
  const totalWithShipping = cartTotalMKD + shippingCost

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 rounded-full bg-stone-50 flex items-center justify-center mb-8"
        >
          <HugeiconsIcon
            icon={ShoppingBag01Icon}
            size={40}
            className="text-stone-300"
            strokeWidth={1.5}
          />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-display uppercase tracking-widest text-black mb-4"
        >
          {t.cart.extractionChamberEmpty}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-black/40 text-sm font-medium max-w-xs mb-10 leading-relaxed"
        >
          {t.cart.exploreEssences}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            asChild
            className="rounded-full bg-black text-white hover:bg-black/90 px-10 py-6 text-xs font-bold tracking-widest uppercase"
          >
            <Link href={`/${locale}/shop`}>{t.cart.goToLaboratory}</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      {/* Page Header */}
      <motion.div
        key="cart-header"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mb-16 md:mb-24"
      >
        <motion.span
          variants={itemVariants}
          className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-6 block"
        >
          {t.cart.sensoryMaintenance}
        </motion.span>
        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.85] tracking-tighter text-black uppercase"
        >
          {t.cart.my}
          <br />
          <span className="text-transparent" style={{ WebkitTextStroke: '2px #e5e5e5' }}>
            {t.cart.selection}
          </span>
        </motion.h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-12">
          <AnimatePresence mode="popLayout">
            {cart?.items?.map((item, index) => {
              if (typeof item.product === 'object' && item.product) {
                const {
                  product,
                  product: { meta, title, gallery, slug },
                  quantity,
                  variant,
                } = item

                if (!quantity) return null

                let image = gallery?.[0]?.image || meta?.image
                let price = (product as Product)?.priceInMKD

                const isVariant = Boolean(variant) && typeof variant === 'object'
                if (isVariant) {
                  price = (variant as any)?.priceInMKD
                  const imageVariant = (product as Product).gallery?.find((g: any) => {
                    if (!g.variantOption) return false
                    const variantOptionID =
                      typeof g.variantOption === 'object' ? g.variantOption.id : g.variantOption
                    return (variant as any)?.options?.some((option: any) =>
                      typeof option === 'object'
                        ? option.id === variantOptionID
                        : option === variantOptionID,
                    )
                  })
                  if (imageVariant && typeof imageVariant.image !== 'string')
                    image = imageVariant.image
                }

                return (
                  <motion.div
                    key={`${product.id}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="group"
                  >
                    <div className="flex flex-col sm:flex-row gap-8 pb-12 border-b border-black/5 relative">
                      {/* Product Image */}
                      <div className="relative w-full sm:w-48 aspect-square rounded-[2rem] bg-[#f6f6f6] overflow-hidden shrink-0 transition-transform duration-700 group-hover:scale-[1.02]">
                        {image && typeof image !== 'string' && (
                          <Media
                            fill
                            imgClassName="object-contain p-8 mix-blend-multiply"
                            resource={image}
                          />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-2 block">
                                {t.cart.pureExtract}
                              </span>
                              <Link href={`/${locale}/products/${slug}`} className="block group">
                                <h3 className="text-3xl md:text-3xl font-display uppercase tracking-tighter text-black group-hover:text-black/60 transition-colors">
                                  {title}
                                </h3>
                              </Link>
                              {variant && typeof variant === 'object' && (
                                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/40 mt-2">
                                  {(variant as any).options
                                    ?.map((option: any) =>
                                      typeof option === 'object' ? option.label : null,
                                    )
                                    .join(' • ')}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => item.id && removeItem(item.id)}
                              className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all group/delete"
                            >
                              <HugeiconsIcon icon={Delete02Icon} size={18} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-row items-end justify-between mt-8">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-6 bg-[#f6f6f6] rounded-full px-6 py-3 border border-black/5">
                            <button
                              disabled={isLoading || quantity <= 1}
                              onClick={() => item.id && decrementItem(item.id)}
                              className="text-black/40 hover:text-black disabled:opacity-30 transition-colors p-1"
                            >
                              <HugeiconsIcon icon={MinusSignIcon} size={16} strokeWidth={2.5} />
                            </button>
                            <span className="text-sm font-bold min-w-[1ch] text-center">
                              {quantity}
                            </span>
                            <button
                              disabled={isLoading}
                              onClick={() => item.id && incrementItem(item.id)}
                              className="text-black/40 hover:text-black disabled:opacity-30 transition-colors p-1"
                            >
                              <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Item Price */}
                          <div className="text-right">
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-1 block">
                              {t.cart.investment}
                            </span>
                            <Price
                              as="span"
                              className="text-xl font-bold text-black font-sans"
                              amount={(price || 0) * quantity}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              }
              return null
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-12 xl:col-span-5 lg:sticky lg:top-16">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#f6f6f6] rounded-[2.5rem] p-10 md:p-12"
          >
            <h3 className="text-xl font-display uppercase tracking-widest text-black mb-12">
              {t.cart.summary}
            </h3>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                  {t.cart.subtotal}
                </span>
                <Price amount={cartTotalMKD} className="font-bold text-black" />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                  {t.cart.logistics}
                </span>
                {cartTotalMKD >= 3000 ? (
                  <span className="text-black font-bold text-[10px] uppercase tracking-widest">
                    {t.cart.complimentary}
                  </span>
                ) : (
                  <Price amount={150} className="font-bold text-black" />
                )}
              </div>

              <div className="pt-8 border-t border-black/5">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-display uppercase tracking-widest text-black">
                    {t.cart.total}
                  </span>
                  <Price
                    as="span"
                    className="text-2xl font-display text-black font-bold"
                    amount={totalWithShipping}
                  />
                </div>
              </div>

              <div className="pt-12">
                <Button
                  asChild
                  className="w-full h-16 rounded-full bg-black text-white hover:bg-black/90 text-xs font-bold tracking-widest uppercase gap-3 shadow-xl shadow-black/10 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link href={`/${locale}/checkout`}>
                    {t.cart.secureCheckout}
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2.5} />
                  </Link>
                </Button>
              </div>

              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-3 text-black/40">
                  <HugeiconsIcon icon={CreditCardIcon} size={16} strokeWidth={1.5} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em]">
                    {t.cart.encryptedTransactions}
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed text-black/30 font-medium">
                  {t.cart.molecularIntegrityNote}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
