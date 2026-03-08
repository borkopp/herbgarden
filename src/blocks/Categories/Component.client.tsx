'use client'

import { Media } from '@/components/Media'
import type { Page } from '@/payload-types'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

type CategoriesBlockProps = Extract<Page['layout'][0], { blockType: 'categories' }>

type CategoriesClientProps = Omit<CategoriesBlockProps, 'items'> & {
    items?: (NonNullable<CategoriesBlockProps['items']>[0] & { count?: number })[]
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

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 100, damping: 12 },
    },
}

export const CategoriesClient: React.FC<CategoriesClientProps> = (props) => {
    const { title, subtitle, items } = props

    return (
        <section className="container py-24 overflow-hidden">
            {title && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-4"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-playfair text-zinc-900 dark:text-zinc-50 text-center md:text-left mb-2">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-zinc-600 dark:text-zinc-400 text-center md:text-left">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <Link
                        href="/shop"
                        className="hidden md:flex items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium transition-colors uppercase tracking-widest text-sm"
                    >
                        Погледни ги сите
                    </Link>
                </motion.div>
            )}

            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 xl:gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {items?.map((item, index) => {
                    const { image, category } = item
                    const categoryTitle = typeof category === 'object' ? category?.title : 'Untitled'
                    const categoryId = typeof category === 'object' ? category?.id : '#'

                    return (
                        <motion.div key={index} variants={itemVariants} className="h-full">
                            <Link
                                href={`/shop?category=${categoryId}`}
                                className="group block relative h-full outline-none"
                            >
                                <div className="relative aspect-[3/4] md:aspect-[4/5] w-full rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl group">
                                    {/* Full background image */}
                                    {image && typeof image === 'object' && (
                                        <Media resource={image} imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" className="absolute inset-0 w-full h-full" />
                                    )}

                                    {/* Bottom label box */}
                                    <div className="absolute bottom-4 left-4 right-4 bg-[#F6F5F3] opacity-95 dark:bg-zinc-800/95 px-5 py-3 md:px-6 md:py-2.5 rounded-[1rem] overflow-hidden">
                                        <div className="flex flex-col items-start transform transition-transform duration-500  group-hover:translate-y-0">
                                            <span className="font-serif text-xl md:text-2xl text-zinc-900 dark:text-zinc-50 tracking-wide">
                                                {categoryTitle}
                                            </span>
                                            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out w-full">
                                                <div className="overflow-hidden">
                                                    <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                        {item.count || 0} Производи
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )
                })}
            </motion.div>

            {title && (
                <div className="mt-10 flex justify-center md:hidden">
                    <Link
                        href="/shop"
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium transition-colors uppercase tracking-widest text-sm"
                    >
                        Погледни ги сите
                    </Link>
                </div>
            )}
        </section>
    )
}
