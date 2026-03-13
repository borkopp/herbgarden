'use client'

import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import type { Page, Product } from '@/payload-types'
import { ArrowRight01Icon, Tick01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { motion, Variants } from 'framer-motion'
import { useLocale } from '@/providers/Locale'
import Link from 'next/link'
import React from 'react'

type ProductVariantsFeatureProps = Extract<Page['layout'][0], { blockType: 'productVariantsFeature' }>

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}


export const ProductVariantsFeatureBlock: React.FC<ProductVariantsFeatureProps> = (props) => {
  const {
    product: productRel,
    customImage,
    tag,
    title,
    description,
    features,
    priceLabel,
    customPrice,
    highlightColor = '#FF7F7F',
  } = props
  const { dict } = useLocale()

  if (!productRel || typeof productRel !== 'object') return null

  const product = productRel as Product
  const displayImage = customImage && typeof customImage === 'object' ? customImage : product.gallery?.[0]?.image
  const displayTitle = title || product.title
  const finalPrice = customPrice || (product.priceInMKD ? `${product.priceInMKD} ДЕН` : '')

  return (
    <section className="container py-16 md:py-32 overflow-hidden">
      <motion.div
        className="flex flex-col items-center text-center max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Top Tag & Title Elements */}
        <div className="flex flex-col items-center mb-10 w-full">
          <motion.span
            variants={itemVariants}
            className="font-bold text-xs tracking-widest uppercase mb-4"
            style={{ color: highlightColor || '#FF7F7F' }}
          >
            {tag || 'SEVEN FLAVOURS'}
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl font-display font-medium leading-[0.9] tracking-tighter uppercase text-black max-w-4xl mx-auto"
          >
            {displayTitle?.replace(' ', '\n') || displayTitle}
          </motion.h2>

          {description && (
            <motion.p
              variants={itemVariants}
              className="text-muted-foreground max-w-2xl leading-relaxed md:text-lg mt-8 whitespace-pre-line font-body mx-auto"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Full-width / Centered Image */}
        <motion.div
          variants={imageVariants}
          className="relative w-full aspect-[16/9] sm:aspect-[21/9]  rounded-[2rem] overflow-hidden bg-muted/20 shadow-xl mb-12"
        >
          {/* Subtle staggered backdrop inside or you can place outside if needed */}
          <div
            className="absolute inset-0 rounded-[2rem] -z-10"
            style={{
              backgroundColor: highlightColor || '#FF7F7F',
              opacity: 0.08
            }}
          />

          {displayImage && typeof displayImage === 'object' ? (
            <Media resource={displayImage} fill imgClassName="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-muted/50 flex items-center justify-center text-muted-foreground/30">
              No Image
            </div>
          )}
        </motion.div>

        {/* Variants / Features */}
        {features && Array.isArray(features) && features.length > 0 && (
          <motion.div variants={itemVariants} className="w-full mb-16 px-4">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 md:gap-3 px-4 py-3 md:px-5 md:py-4 rounded-full"
                >
                  <div
                    className="rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: highlightColor || '#FF7F7F' }}
                  >
                    <HugeiconsIcon icon={Tick01Icon} size={12} color="white" strokeWidth={2.5} />
                  </div>
                  <span className="font-semibold text-xs md:text-sm tracking-wide">{feature.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA & Price */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-8 border-t border-muted-foreground/10 w-full max-w-2xl mx-auto"
        >
          <div className="flex flex-col items-center sm:items-end min-w-[120px]">
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-semibold">
              {priceLabel || dict.common.price}
            </span>
            <span className="text-3xl lg:text-4xl font-sans font-bold text-black mt-1">
              {finalPrice}
            </span>
          </div>

          <div className="flex items-center w-full sm:w-auto px-4 sm:px-0">
            <Button
              asChild
              className="rounded-full bg-black text-white hover:bg-black/80 py-7 px-8 text-xs sm:text-sm font-bold tracking-wider gap-3 transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <Link href={`/products/${product.slug}`}>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
                {dict.common.explore.toUpperCase()}
              </Link>
            </Button>
          </div>
        </motion.div>

      </motion.div>
    </section>
  )
}
