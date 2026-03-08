import { Media } from '@/components/Media'
import type { Product } from '@/payload-types'
import Link from 'next/link'
import React from 'react'

type Props = {
  product: Partial<Product>
}

export const CompactProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInMKD, title, slug } = product

  let price = priceInMKD
  const variants = product.variants?.docs

  let categoryTitle = 'PURE EXTRACT'
  const firstCategory = product.categories?.[0]
  if (firstCategory && typeof firstCategory === 'object' && firstCategory.title) {
    categoryTitle = firstCategory.title
  }

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
  const secondImage =
    gallery?.[1]?.image && typeof gallery[1]?.image !== 'string' ? gallery[1]?.image : false

  return (
    <Link href={`/products/${slug}`} className="group flex flex-col h-full w-full">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl bg-black/5 mb-3 transition-transform duration-700 ease-out group-hover:scale-[1.02] w-full aspect-square">
        {image ? (
          <>
            <Media
              fill
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${secondImage ? 'group-hover:opacity-0' : ''}`}
              imgClassName="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              resource={image}
            />
            {secondImage && (
              <Media
                fill
                className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                imgClassName="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                resource={secondImage}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center bg-black/5 text-[10px] font-bold uppercase tracking-widest text-black/30 w-full h-full">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-black/40 mb-1 truncate w-full">
            {categoryTitle}
          </span>
          <h3 className="font-display text-sm md:text-base uppercase tracking-tight text-black group-hover:text-black/70 transition-colors duration-300 truncate w-full">
            {title}
          </h3>
        </div>

        {typeof price === 'number' && (
          <div className="flex flex-col items-start sm:items-end shrink-0">
            <span className="font-sans text-xs md:text-sm font-bold text-black border-b border-black/10 pb-0.5">
              {price} ДЕН
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
