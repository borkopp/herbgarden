'use client'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { DefaultDocumentIDType } from 'payload'

type Props = {
  gallery: NonNullable<Product['gallery']>
}

export const Gallery: React.FC<Props> = ({ gallery }) => {
  const searchParams = useSearchParams()
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()

  useEffect(() => {
    if (!api) {
      return
    }
  }, [api])

  useEffect(() => {
    const values = Array.from(searchParams.values())

    if (values && api) {
      const index = gallery.findIndex((item) => {
        if (!item.variantOption) return false

        let variantID: DefaultDocumentIDType

        if (typeof item.variantOption === 'object') {
          variantID = item.variantOption.id
        } else variantID = item.variantOption

        return Boolean(values.find((value) => value === String(variantID)))
      })
      if (index !== -1) {
        setCurrent(index)
        api.scrollTo(index, true)
      }
    }
  }, [searchParams, api, gallery])

  return (
    <div>
      {/* Main Image */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-[#f8f5f1] mb-4">
        <Media
          resource={gallery[current].image}
          className="w-full aspect-square flex items-center justify-center p-8"
          imgClassName="w-full h-full object-contain"
        />
      </div>

      {/* Thumbnail Carousel */}
      {gallery.length > 1 && (
        <Carousel setApi={setApi} className="w-full" opts={{ align: 'start', loop: false }}>
          <CarouselContent className="-ml-2 p-2">
            {gallery.map((item, i) => {
              if (typeof item.image !== 'object') return null

              return (
                <CarouselItem
                  className="basis-1/5 pl-2 cursor-pointer"
                  key={`${item.image.id}-${i}`}
                  onClick={() => setCurrent(i)}
                >
                  <div
                    className={`
                      rounded-2xl overflow-hidden bg-[#f8f5f1] p-2 transition-all duration-200
                      ${i === current
                        ? 'ring-2 ring-foreground/80 ring-offset-2'
                        : 'ring-1 ring-border/30 hover:ring-border'
                      }
                    `}
                  >
                    <Media
                      className="w-full aspect-square flex items-center justify-center"
                      imgClassName="w-full h-full object-contain"
                      resource={item.image}
                    />
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  )
}
