'use client'

import type { Product } from '@/payload-types'

import { createUrl } from '@/utilities/createUrl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function VariantSelector({ product }: { product: Product }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const variants = product.variants?.docs
  const variantTypes = product.variantTypes
  const hasVariants = Boolean(product.enableVariants && variants?.length && variantTypes?.length)

  if (!hasVariants) {
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      {variantTypes?.map((type) => {
        if (!type || typeof type !== 'object') {
          return null
        }

        const options = type.options?.docs

        if (!options || !Array.isArray(options) || !options.length) {
          return null
        }

        return (
          <dl key={type.id}>
            <dt className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/50 mb-4">{type.label}</dt>
            <dd className="flex flex-wrap gap-2">
              {options?.map((option) => {
                if (!option || typeof option !== 'object') {
                  return null
                }

                const optionID = option.id
                const optionKeyLowerCase = type.name

                const optionSearchParams = new URLSearchParams(searchParams.toString())
                optionSearchParams.delete('variant')
                optionSearchParams.delete('image')
                optionSearchParams.set(optionKeyLowerCase, String(optionID))

                const currentOptions = Array.from(optionSearchParams.values())

                let isAvailableForSale = true

                if (variants) {
                  const matchingVariant = variants
                    .filter((variant) => typeof variant === 'object')
                    .find((variant) => {
                      if (!variant.options || !Array.isArray(variant.options)) return false

                      return variant.options.every((variantOption) => {
                        if (typeof variantOption !== 'object')
                          return currentOptions.includes(String(variantOption))

                        return currentOptions.includes(String(variantOption.id))
                      })
                    })

                  if (matchingVariant) {
                    optionSearchParams.set('variant', String(matchingVariant.id))

                    if (matchingVariant.inventory && matchingVariant.inventory > 0) {
                      isAvailableForSale = true
                    } else {
                      isAvailableForSale = false
                    }
                  }
                }

                const optionUrl = createUrl(pathname, optionSearchParams)

                const isActive =
                  Boolean(isAvailableForSale) &&
                  searchParams.get(optionKeyLowerCase) === String(optionID)

                return (
                  <button
                    aria-disabled={!isAvailableForSale}
                    className={`
                      relative px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border
                      ${isActive
                        ? 'bg-black text-white border-black shadow-md'
                        : isAvailableForSale
                          ? 'bg-transparent text-black border-black/10 hover:border-black/30 hover:bg-stone-50'
                          : 'bg-transparent text-black/20 border-black/5 cursor-not-allowed line-through'
                      }
                    `}
                    disabled={!isAvailableForSale}
                    key={option.id}
                    onClick={() => {
                      router.replace(`${optionUrl}`, {
                        scroll: false,
                      })
                    }}
                    title={`${option.label} ${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </dd>
          </dl>
        )
      })}
    </div>
  )
}
