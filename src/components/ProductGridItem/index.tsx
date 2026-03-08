import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { WishlistButton } from '@/components/product/WishlistButton'
import Link from 'next/link'
import React from 'react'
import { QuickAddToCartButton } from './QuickAddToCartButton'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInMKD, title, categories } = product
  const badgeText = (product as any).badgeText
  const badgeColor = (product as any).badgeColor || 'bg-white/90 text-muted-foreground'


  let price = priceInMKD

  const variants = product.variants?.docs

  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (
      variant &&
      typeof variant === 'object' &&
      variant?.priceInMKD &&
      typeof variant.priceInMKD === 'number'
    ) {
      price = variant.priceInMKD
    }
  }

  const image =
    gallery?.[0]?.image && typeof gallery[0]?.image !== 'string' ? gallery[0]?.image : false

  // Second image
  const secondImage =
    gallery?.[1]?.image && typeof gallery[1]?.image !== 'string' ? gallery[1]?.image : false

  return (
    <div className="group relative flex flex-col h-full w-full">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#f8f5f1] transition-all duration-300 ease-out">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10 block">
          {image ? (
            <>
              <Media
                className={`absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-500 ease-in-out ${secondImage ? 'group-hover:opacity-0' : ''}`}
                imgClassName="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                resource={image}
                width={400}
                height={400}
              />
              {secondImage && (
                <Media
                  className="absolute inset-0 flex items-center justify-center p-6 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                  imgClassName="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                  resource={secondImage}
                  width={400}
                  height={400}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-muted-foreground/20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </Link>

        {/* Category Badge */}
        {badgeText && (
          <span className={`absolute top-3 left-3 px-3 py-1.5 rounded-full shadow-sm text-xs font-medium backdrop-blur-sm z-20 ${badgeColor}`}>
            {badgeText}
          </span>
        )}

        {/* Floating Actions Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/20 to-transparent flex flex-col justify-between p-3">
          <div className="flex justify-end pointer-events-auto">
            <WishlistButton
              product={product as Product}
              className="h-10 w-10 border-none shadow-md bg-white/90 hover:bg-white text-muted-foreground backdrop-blur-sm"
            />
          </div>
          <div className="pointer-events-auto translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 mb-2 px-2">
            <QuickAddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-center items-center mt-4 px-1">
        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="text-md font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-200 line-clamp-2">
            {title}
          </h3>
        </Link>

        {typeof price === 'number' && (
          <div className="pl-2">
            <Price
              amount={price}
              className="text-sm font-semibold text-foreground whitespace-nowrap"
              as="span"
            />
          </div>
        )}
      </div>
    </div>
  )
}
