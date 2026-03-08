'use client'

import { Button } from '@/components/ui/button'
import { Product } from '@/payload-types'
import { useWishlist } from '@/providers/Wishlist'
import { cn } from '@/utilities/cn'
import { Heart } from 'lucide-react'
import posthog from 'posthog-js'
import React, { useState } from 'react'

export const WishlistButton: React.FC<{
    product: Product
    className?: string
}> = ({ product, className }) => {
    const { toggleWishlist, isInWishlist } = useWishlist()
    // Optimistic local state for immediate feedback
    const [isHovered, setIsHovered] = useState(false)
    const isWishlisted = isInWishlist(product.id)

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(product)
        posthog.capture(isWishlisted ? 'product_unwishlisted' : 'product_wishlisted', {
            product_id: product.id,
            product_name: product.title,
            product_slug: product.slug,
            price: product.priceInMKD,
            currency: 'MKD',
        })
    }

    return (
        <Button
            variant="outline"
            size="icon"
            className={cn(
                'shrink-0 h-14 w-14 rounded-full border-border/60 transition-all duration-300',
                isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100 hover:border-rose-300 dark:bg-rose-500/10 dark:border-rose-500/20 dark:hover:bg-rose-500/20'
                    : 'hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:border-rose-500/20',
                className
            )}
            onClick={handleToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={isWishlisted ? 'Отстрани од омилени' : 'Додај во омилени'}
        >
            <Heart
                className={cn(
                    'size-5 transition-all duration-300',
                    isWishlisted || isHovered ? 'scale-110' : 'scale-100',
                    isWishlisted ? 'fill-current text-rose-500' : 'text-stone-400 dark:text-stone-500'
                )}
            />
            <span className='md:hidden block text-foreground'>Додај во омилени</span>
            <span className="sr-only">
                {isWishlisted ? 'Отстрани од омилени' : 'Додај во омилени'}
            </span>
        </Button>
    )
}
