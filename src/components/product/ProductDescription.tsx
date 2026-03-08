'use client'
import type { Product, Variant } from '@/payload-types'

import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import { RichText } from '@/components/RichText'
import { Suspense } from 'react'

import { StockIndicator } from '@/components/product/StockIndicator'
import { DeliveryTruck01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { VariantSelector } from './VariantSelector'
import { WishlistButton } from './WishlistButton'

export function ProductDescription({ product }: { product: Product }) {
  const { currency } = useCurrency()
  let amount = 0,
    lowestAmount = 0,
    highestAmount = 0
  const priceField = `priceIn${currency.code}` as keyof Product
  const hasVariants = product.enableVariants && Boolean(product.variants?.docs?.length)

  if (hasVariants) {
    const priceField = `priceIn${currency.code}` as keyof Variant
    const variantsOrderedByPrice = product.variants?.docs
      ?.filter((variant) => variant && typeof variant === 'object')
      .sort((a, b) => {
        if (
          typeof a === 'object' &&
          typeof b === 'object' &&
          priceField in a &&
          priceField in b &&
          typeof a[priceField] === 'number' &&
          typeof b[priceField] === 'number'
        ) {
          return a[priceField] - b[priceField]
        }

        return 0
      }) as Variant[]

    const lowestVariant = variantsOrderedByPrice[0][priceField]
    const highestVariant = variantsOrderedByPrice[variantsOrderedByPrice.length - 1][priceField]
    if (
      variantsOrderedByPrice &&
      typeof lowestVariant === 'number' &&
      typeof highestVariant === 'number'
    ) {
      lowestAmount = lowestVariant
      highestAmount = highestVariant
    }
  } else if (product[priceField] && typeof product[priceField] === 'number') {
    amount = product[priceField]
  }

  // Extract category names
  const categories =
    product.categories
      ?.filter((cat) => typeof cat === 'object')
      .map((cat) => (typeof cat === 'object' ? cat.title : '')) || []

  return (
    <div className="flex flex-col">
      {/* Category Tag */}
      {categories.length > 0 && (
        <span className="font-bold text-[10px] tracking-widest uppercase text-black/40 block mb-4">
          {categories.join(' • ')}
        </span>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-display font-medium leading-[0.9] tracking-tighter uppercase text-black mb-6">
        {product.title}
      </h1>

      {/* Price */}
      <div className="text-3xl font-sans font-bold text-black mb-8">
        {hasVariants ? (
          <Price highestAmount={highestAmount} lowestAmount={lowestAmount} />
        ) : (
          <Price amount={amount} />
        )}
      </div>

      {/* Description */}
      {product.description ? (
        <div className="text-muted-foreground leading-relaxed md:text-lg mb-10 font-body">
          <RichText data={product.description} enableGutter={false} />
        </div>
      ) : null}

      {/* Divider */}
      <div className="h-px bg-border/60 mb-8" />

      {/* Variant Selector */}
      {hasVariants && (
        <>
          <Suspense fallback={null}>
            <VariantSelector product={product} />
          </Suspense>
        </>
      )}

      {/* Stock Indicator */}
      <Suspense fallback={null}>
        <StockIndicator product={product} />
      </Suspense>

      {/* Add to Cart */}
      <Suspense fallback={null}>
        <div className="flex flex-col sm:flex-row gap-4 items-stretch mt-8 mb-6">
          <div className="flex-1">
            <AddToCart product={product} />
          </div>
          <WishlistButton product={product} className="w-full sm:w-14" />
        </div>
        <div className="flex items-center justify-center text-black/50 gap-3 pt-6 border-t border-border/60">
          <HugeiconsIcon icon={DeliveryTruck01Icon} size={18} className="shrink-0" strokeWidth={1.5} />
          <p className="text-[10px] tracking-widest uppercase font-semibold">
            Бесплатна достава за нарачки над 3000 денари
          </p>
        </div>
      </Suspense>
    </div>
  )
}
