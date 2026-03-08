'use client'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Lens } from '@/components/ui/magnifying-lens'
import { DefaultDocumentIDType } from 'payload'

type Props = {
  gallery: NonNullable<Product['gallery']>
}

export const Gallery: React.FC<Props> = ({ gallery }) => {
  const searchParams = useSearchParams()
  const [current, setCurrent] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const [isOpen, setIsOpen] = useState(false)
  const [isHoveringLens, setIsHoveringLens] = useState(false)

  // Carousel API effect
  useEffect(() => {
    if (!api) {
      return
    }
  }, [api])

  // Sync component state with search params (variant selected)
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

  // Navigation handlers
  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrent((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
  }, [gallery.length])

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrent((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
  }, [gallery.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          setIsOpen(false)
          break
        case 'ArrowLeft':
          handlePrev()
          break
        case 'ArrowRight':
          handleNext()
          break
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleNext, handlePrev])

  return (
    <div>
      {/* Main Image */}
      <div
        className="relative w-full overflow-hidden rounded-[2rem] bg-stone-50 mb-6 cursor-zoom-in group"
        onClick={() => setIsOpen(true)}
      >
        <Lens
          hovering={isHoveringLens}
          setHovering={setIsHoveringLens}
          zoomFactor={2}
          lensSize={450}
        >
          <Media
            resource={gallery[current].image}
            className="w-full aspect-square flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            imgClassName="w-full h-full object-cover"
          />
        </Lens>
        {/* Overlay hover text/icon */}
        <div className="absolute inset-x-0 bottom-6 bg-transparent flex justify-center pointer-events-none z-[60]">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-black px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-xl backdrop-blur-md">
            Зголеми слика
          </span>
        </div>
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
                      rounded-2xl overflow-hidden bg-stone-50 transition-all duration-300
                      ${i === current
                        ? 'ring-2 ring-black ring-offset-2'
                        : 'ring-1 ring-black/5 hover:ring-black/20 hover:scale-[1.02]'
                      }
                    `}
                  >
                    <Media
                      className="w-full aspect-square flex items-center justify-center"
                      imgClassName="w-full h-full object-cover"
                      resource={item.image}
                    />
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      )}

      {/* Full Screen Modal View */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-stone-50/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setIsOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
              className="absolute top-6 right-6 md:top-10 md:right-10 z-[60] p-4 bg-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 text-black cursor-pointer"
              aria-label="Затвори"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={24} strokeWidth={2} />
            </button>

            {/* Navigation Left */}
            {gallery.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-[60] p-4 rounded-full bg-white shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 text-black cursor-pointer"
                aria-label="Претходна слика"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={24} strokeWidth={2} />
              </button>
            )}

            {/* Large Image Wrapper */}
            <div className="relative w-full max-w-7xl aspect-square md:aspect-auto md:h-full flex items-center justify-center cursor-default" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full relative"
                >
                  <Media
                    resource={gallery[current].image}
                    className="w-full h-full flex items-center justify-center p-8 md:p-0"
                    imgClassName="w-full h-full object-contain max-h-[85vh] drop-shadow-2xl"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Right */}
            {gallery.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-[60] p-4 rounded-full bg-white shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 text-black cursor-pointer"
                aria-label="Следна слика"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={24} strokeWidth={2} />
              </button>
            )}

            {/* Pagination Indicators - Bottom */}
            {gallery.length > 1 && (
              <div className="absolute bottom-6 md:bottom-12 z-[60] flex items-center gap-3">
                {gallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrent(idx)
                    }}
                    className={`transition-all duration-300 rounded-full bg-black cursor-pointer ${idx === current ? 'w-8 h-1.5 opacity-100' : 'w-1.5 h-1.5 opacity-20 hover:opacity-50'}`}
                    aria-label={`Show image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
