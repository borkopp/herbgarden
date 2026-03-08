'use client'
import type { Product, Variant } from '@/payload-types'

import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import { RichText } from '@/components/RichText'
import { Suspense } from 'react'

import { StockIndicator } from '@/components/product/StockIndicator'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { Truck } from 'lucide-react'
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
    <div className="flex flex-col gap-8">
      {/* Category breadcrumb */}
      {/* {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <span
              key={i}
              className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      )} */}

      {/* Title & Price */}
      <div className="flex justify-between gap-3">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
          {product.title}
        </h1>
        <div className="text-2xl font-semibold text-foreground/80">
          {hasVariants ? (
            <Price highestAmount={highestAmount} lowestAmount={lowestAmount} />
          ) : (
            <Price amount={amount} />
          )}
        </div>
      </div>

      {/* Description */}
      {product.description ? (
        <div className="text-muted-foreground leading-relaxed">
          <RichText data={product.description} enableGutter={false} />
        </div>
      ) : null}

      {/* Divider */}
      <div className="h-px bg-border/60" />

      {/* Variant Selector */}
      {hasVariants && (
        <>
          <Suspense fallback={null}>
            <VariantSelector product={product} />
          </Suspense>
          <div className="h-px bg-border/60" />
        </>
      )}

      {/* Stock Indicator */}
      <Suspense fallback={null}>
        <StockIndicator product={product} />
      </Suspense>

      {/* Add to Cart */}
      <Suspense fallback={null}>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="flex-1">
            <AddToCart product={product} />
          </div>
          <WishlistButton product={product} className="w-full sm:w-14" />
        </div>
        <div className="flex items-center justify-center -mt-2 sm:mt-0 text-neutral-400 gap-2">
          <Truck className="size-5 shrink-0" />
          <p className="text-xs leading-relaxed">
            Бесплатна достава за нарачки над 3000 денари
          </p>
        </div>
      </Suspense>
    </div>
  )
}
