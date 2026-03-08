'use client'
import { ProductGridItem } from '@/components/ProductGridItem'
import type { Product } from '@/payload-types'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'

import { A11y, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type ProductCarouselClientProps = {
    title?: string | null
    subtitle?: string | null
    products: Product[]
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

export const ProductCarouselClient: React.FC<ProductCarouselClientProps> = ({ title, subtitle, products }) => {
    const [isLocked, setIsLocked] = useState(false)

    if (!products?.length) return null

    return (
        <section className="container py-12 md:py-24 overflow-visible">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col md:flex-row items-center md:items-end justify-between mb-8 md:mb-12 gap-4"
            >
                <div className="flex-1">
                    {title && (
                        <h2 className="text-3xl md:text-4xl font-playfair text-zinc-900 dark:text-zinc-50 text-center md:text-left mb-2">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="text-zinc-600 dark:text-zinc-400 text-center md:text-left text-balance">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Custom Navigation Buttons - Desktop Only, Hidden if items fit on screen */}
                <div className={`hidden md:flex items-center gap-3 ml-4 transition-opacity duration-300 ${isLocked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <button
                        className="product-carousel-prev flex items-center justify-center w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 hover:enabled:bg-primary hover:enabled:text-white hover:enabled:border-primary transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:enabled:scale-110 transition-transform" />
                    </button>
                    <button
                        className="product-carousel-next flex items-center justify-center w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 hover:enabled:bg-primary hover:enabled:text-white hover:enabled:border-primary transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6 group-hover:enabled:scale-110 transition-transform" />
                    </button>
                </div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="w-full relative"
            >
                <Swiper
                    modules={[Navigation, Pagination, A11y]}
                    spaceBetween={16}
                    slidesPerView={1.2}
                    centeredSlides={true}
                    grabCursor={true}
                    onUpdate={(swiper: SwiperType) => {
                        setIsLocked(swiper.isLocked)
                    }}
                    navigation={{
                        prevEl: '.product-carousel-prev',
                        nextEl: '.product-carousel-next',
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    breakpoints={{
                        480: {
                            slidesPerView: 2.2,
                            spaceBetween: 16,
                            centeredSlides: true,
                        },
                        768: {
                            slidesPerView: 3.2,
                            spaceBetween: 24,
                            centeredSlides: true,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 24,
                            centeredSlides: false,
                        },
                        1280: {
                            slidesPerView: 5,
                            spaceBetween: 32,
                            centeredSlides: false,
                        }
                    }}
                    className="!pb-12 product-carousel-swiper"
                    style={{
                        // @ts-ignore
                        '--swiper-pagination-color': '#d39d1f', // Default dark color for better visibility
                        '--swiper-pagination-bullet-inactive-color': '#d4d4d8',
                        '--swiper-pagination-bullet-inactive-opacity': '1',
                        '--swiper-pagination-bullet-size': '8px',
                        '--swiper-pagination-bullet-horizontal-gap': '6px'
                    }}
                >
                    {products.map((product, i) => (
                        <SwiperSlide key={`${product.slug}-${i}`} className="h-auto">
                            <div className="h-full pb-2">
                                <ProductGridItem product={product} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Mobile-only pagination styles / override for desktop hidden */}
                <style jsx global>{`
                    @media (min-width: 768px) {
                        .product-carousel-swiper .swiper-pagination {
                            display: none !important;
                        }
                    }
                    .product-carousel-swiper .swiper-pagination-bullet-active {
                        width: 24px;
                        border-radius: 4px;
                        transition: all 0.3s ease;
                        background: #d39d1f !important;
                    }
                    /* Ensure Swiper disabled state matches our button implementation */
                    .product-carousel-prev.swiper-button-disabled,
                    .product-carousel-next.swiper-button-disabled {
                        opacity: 0.3;
                        cursor: not-allowed;
                        pointer-events: none;
                    }
                `}</style>
            </motion.div>
        </section>
    )
}
