'use client'

import { ProductGridItem } from '@/components/ProductGridItem'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/providers/Wishlist'
import { HeartOff } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const WishlistClient: React.FC = () => {
    const { wishlistItems, toggleWishlist, isWishlistLoading, wishlistHasLoaded } = useWishlist()

    if (!wishlistHasLoaded || isWishlistLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <p className="text-stone-500 animate-pulse">Се вчитуваат омилените производи...</p>
            </div>
        )
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm p-12 flex flex-col items-center justify-center text-center gap-4">
                <div className="size-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                    <HeartOff className="size-8" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100">Вашата листа е празна</h3>
                    <p className="text-stone-500 mt-1 max-w-sm">Сè уште немате додадено производи во омилени.</p>
                </div>
                <Button asChild className="mt-4 px-8 rounded-full">
                    <Link href="/shop">Започнете со купување</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
            {wishlistItems.map((product) => {
                return (
                    <div key={product.id} className="group relative">
                        <ProductGridItem product={product} />

                        {/* Remove button overlay over ProductGridItem */}
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                toggleWishlist(product)
                            }}
                            className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center text-stone-400 hover:text-rose-500 hover:bg-white dark:hover:bg-stone-800 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
                            title="Отстрани"
                        >
                            <HeartOff className="size-4" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
