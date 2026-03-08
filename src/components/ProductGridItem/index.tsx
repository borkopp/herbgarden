import { Media } from '@/components/Media'
import type { Product } from '@/payload-types'
import Link from 'next/link'
import React from 'react'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInMKD, title, slug } = product

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
  const secondImage =
    gallery?.[1]?.image && typeof gallery[1]?.image !== 'string' ? gallery[1]?.image : false

  return (
    <Link href={`/products/${slug}`} className="group flex flex-col h-full w-full">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-[2rem] bg-transparent mb-8 transition-transform duration-700 ease-out group-hover:scale-[1.02] flex items-center justify-center">
        {image ? (
          <>
            <Media
              className={`transition-opacity duration-700 ease-in-out ${secondImage ? 'group-hover:opacity-0' : ''}`}
              imgClassName="w-full h-auto object-contain transition-transform duration-1000 ease-out group-hover:scale-110"
              resource={image}
            />
            {secondImage && (
              <Media
                className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                imgClassName="w-full h-auto object-contain transition-transform duration-1000 ease-out group-hover:scale-110"
                resource={secondImage}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center bg-black/5 text-[10px] font-bold uppercase tracking-widest text-black/30 w-full aspect-[3/4]">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
        <div className="flex flex-col items-start">
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-2">
            PURE EXTRACT
          </span>
          <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tighter text-black group-hover:text-black/70 transition-colors duration-300">
            {title}
          </h3>
        </div>

        {typeof price === 'number' && (
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-1">
              PRICE
            </span>
            <span className="font-sans text-lg font-bold text-black border-b border-black/10 pb-1 pr-1">
              {price} ДЕН
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
