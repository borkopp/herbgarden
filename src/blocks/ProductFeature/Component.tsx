'use client'

import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import type { Page, Product } from '@/payload-types'
import { trackGAEvent } from '@/utilities/analytics'
import { ArrowRight01Icon, Tick01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'
import posthog from 'posthog-js'
import React, { useCallback } from 'react'
import { toast } from 'sonner'

type ProductFeatureProps = Extract<Page['layout'][0], { blockType: 'productFeature' }>

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

function FeatureAddToCart({ product }: { product: Product }) {
  const { addItem, isLoading } = useCart()

  const addToCart = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      addItem({
        product: product.id,
      }).then(() => {
        trackGAEvent('add_to_cart', {
          currency: 'MKD',
          value: product.priceInMKD,
          items: [
            {
              item_id: product.id,
              item_name: product.title,
              price: product.priceInMKD,
              quantity: 1,
            },
          ],
        })
        posthog.capture('product_added_to_cart', {
          product_id: product.id,
          product_name: product.title,
          product_slug: product.slug,
          price: product.priceInMKD,
          currency: 'MKD',
        })
        toast.success('Производот е додаден во кошничка.')
      })
    },
    [addItem, product],
  )

  const disabled = typeof product.inventory === 'number' && product.inventory === 0

  return (
    <Button
      onClick={addToCart}
      disabled={disabled || isLoading}
      className="rounded-full bg-black text-white hover:bg-black/80 py-7 text-xs sm:text-sm font-bold tracking-wider gap-3 transition-transform hover:scale-105 active:scale-95"
    >
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
      {disabled && !isLoading ? 'OUT OF STOCK' : isLoading ? 'ADDING...' : 'BUY NOW'}
    </Button>
  )
}

export const ProductFeatureBlock: React.FC<ProductFeatureProps> = (props) => {
  const {
    product: productRel,
    customImage,
    ingredientFocus,
    tag,
    title,
    description,
    features,
    priceLabel,
    customPrice,
    highlightColor = '#FF7F7F',
    alignment = 'image-left',
  } = props

  if (!productRel || typeof productRel !== 'object') return null

  const product = productRel as Product
  const displayImage = customImage && typeof customImage === 'object' ? customImage : product.gallery?.[0]?.image
  const displayTitle = title || product.title
  const finalPrice = customPrice || (product.priceInMKD ? `${product.priceInMKD} ДЕН` : '')

  const isImageRight = alignment === 'image-right'

  return (
    <section className="container py-16 md:py-32 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Image with floating card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={imageVariants}
          className={`relative w-full max-w-xl mx-auto lg:max-w-none ${isImageRight ? 'lg:order-last' : ''}`}
        >
          {/* Subtle staggered backdrop */}
          <div
            className="absolute -inset-4 rounded-[2.5rem] -z-10 translate-x-2 translate-y-4 md:translate-x-6 md:translate-y-8"
            style={{
              backgroundColor: highlightColor || '#FF7F7F',
              opacity: 0.08
            }}
          />

          <div className="relative aspect-square md:aspect-[4/4] rounded-[2rem] overflow-hidden bg-muted/20 shadow-xl">
            {displayImage && typeof displayImage === 'object' ? (
              <Media resource={displayImage} fill imgClassName="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-muted/50 flex items-center justify-center text-muted-foreground/30">
                No Image
              </div>
            )}
          </div>

          {/* Floating Ingredient Card */}
          {ingredientFocus && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className={`absolute -bottom-6 ${isImageRight ? 'left-0 md:-left-6' : 'right-0 md:-right-6'} bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl border flex flex-col items-start min-w-[200px] z-10`}
            >
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1 whitespace-nowrap">
                {ingredientFocus.subtitle || 'INGREDIENT FOCUS'}
              </span>
              <span className="text-sm font-bold text-black whitespace-nowrap">
                {ingredientFocus.title}
              </span>
            </motion.div>
          )}

          {/* Decorative Circle SVG (top left) */}
          {/* <div className="absolute -top-12 -left-12 opacity-20 hidden md:block w-32 h-32 overflow-visible animate-[spin_30s_linear_infinite]">
            <svg viewBox="0 0 100 100" width="100" height="100">
              <defs>
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
              </defs>
              <text fontSize="10" letterSpacing="2" fill="currentColor">
                <textPath href="#circlePath" startOffset="0%">
                  PURE BOTANICAL EXTRACT •
                </textPath>
              </text>
            </svg>
          </div> */}
        </motion.div>

        {/* Content */}
        <motion.div
          className={`flex flex-col items-center text-center ${isImageRight ? 'lg:items-start lg:text-left' : 'lg:items-end lg:text-right'}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Tag */}
          <motion.span
            variants={itemVariants}
            className="font-bold text-xs tracking-widest uppercase mb-4"
            style={{ color: highlightColor || '#FF7F7F' }}
          >
            {tag || 'PRODUCT BETA'}
          </motion.span>

          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl font-display font-medium leading-[0.9] tracking-tighter mb-6 uppercase text-black"
          >
            {displayTitle?.replace(' ', '\n') || displayTitle}
          </motion.h2>

          {/* Description */}
          {description && (
            <motion.p
              variants={itemVariants}
              className="text-muted-foreground max-w-lg leading-relaxed md:text-lg mb-10 whitespace-pre-line font-body"
            >
              {description}
            </motion.p>
          )}

          {/* Features */}
          {features && Array.isArray(features) && features.length > 0 && (
            <motion.div variants={itemVariants} className={`flex flex-col gap-4 mb-12 ${isImageRight ? 'items-center lg:items-start' : 'items-center lg:items-end'}`}>
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  {isImageRight && (
                    <div
                      className="rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: highlightColor || '#FF7F7F' }}
                    >
                      <HugeiconsIcon icon={Tick01Icon} size={16} color="white" strokeWidth={2} />
                    </div>
                  )}
                  <span className="font-semibold text-sm md:text-base">{feature.label}</span>
                  {!isImageRight && (
                    <div
                      className="rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: highlightColor || '#FF7F7F' }}
                    >
                      <HugeiconsIcon icon={Tick01Icon} size={16} color="white" strokeWidth={2} />
                    </div>
                  )}
                </div>
              ))}

              <Link
                href={`/products/${product.slug}`}
                className="mt-4 relative font-body uppercase tracking-widest font-bold text-[10px] pt-4 text-black/40 hover:text-black overflow-hidden group transition-colors"
              >
                <span className="relative inline-block">
                  View Details
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black transform translate-y-[2px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
                </span>
              </Link>
            </motion.div>
          )}

          {/* CTA & Price Action Area */}
          <motion.div variants={itemVariants} className={`flex flex-col-reverse sm:flex-row items-center gap-10 pt-8 border-t border-muted-foreground/10 lg:w-full ${isImageRight ? 'lg:justify-start flex-row-reverse' : 'lg:justify-end'}`}>
            <div className={`flex flex-col sm:flex-row items-center gap-10 ${isImageRight ? 'flex-row-reverse' : ''}`}>
              <FeatureAddToCart product={product} />
            </div>

            <div className={`flex flex-col items-center ${isImageRight ? 'lg:items-start' : 'lg:items-end'} min-w-[120px]`}>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-semibold">
                {priceLabel || 'PRICE'}
              </span>
              <span className="text-3xl font-sans font-bold text-black mt-1">
                {finalPrice}
              </span>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
