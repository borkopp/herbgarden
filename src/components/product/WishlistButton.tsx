'use client'

import { Button } from '@/components/ui/button'
import { Product } from '@/payload-types'
import { useWishlist } from '@/providers/Wishlist'
import { cn } from '@/utilities/cn'
import { HugeiconsIcon } from '@hugeicons/react'
import { FavouriteIcon } from '@hugeicons/core-free-icons'
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
                'shrink-0 h-14 w-14 rounded-full transition-all duration-300',
                isWishlisted
                    ? 'bg-black border-black text-white hover:bg-black/90 hover:border-black/90'
                    : 'bg-transparent border border-black/10 text-black hover:border-black/30 hover:bg-stone-50',
                className
            )}
            onClick={handleToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={isWishlisted ? 'Отстрани од омилени' : 'Додај во омилени'}
        >
            <HugeiconsIcon
                icon={FavouriteIcon}
                size={20}
                strokeWidth={1.5}
                className={cn(
                    'transition-all duration-300',
                    isWishlisted || isHovered ? 'scale-110' : 'scale-100',
                    isWishlisted ? 'fill-current text-white' : 'text-black/40'
                )}
            />
            <span className='md:hidden block text-foreground'>Додај во омилени</span>
            <span className="sr-only">
                {isWishlisted ? 'Отстрани од омилени' : 'Додај во омилени'}
            </span>
        </Button>
    )
}
