'use client'

import { Button } from '@/components/ui/button'
import { Product } from '@/payload-types'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import posthog from 'posthog-js'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

export function QuickAddToCartButton({ product }: { product: Partial<Product> }) {
    const { addItem, isLoading } = useCart()
    const [isAdding, setIsAdding] = useState(false)

    const hasVariants = product.enableVariants && product.variants?.docs?.length && product.variants.docs.length > 0;

    const handleAddToCart = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            e.stopPropagation()

            if (hasVariants) return

            try {
                setIsAdding(true)
                await addItem({
                    product: product.id!,
                })
                posthog.capture('product_quick_added_to_cart', {
                    product_id: product.id,
                    product_name: product.title,
                    product_slug: product.slug,
                    price: product.priceInMKD,
                    currency: 'MKD',
                })
                toast.success('Производот е додаден во кошничка.')
            } catch (error) {
                posthog.captureException(error)
                toast.error('Грешка при додавање во кошничка.')
            } finally {
                setIsAdding(false)
            }
        },
        [addItem, product.id, hasVariants],
    )

    const isAddingOrLoading = isAdding

    if (hasVariants) {
        return (
            <Button
                asChild
                className="w-full rounded-2xl bg-white/90 text-black hover:bg-white hover:text-black shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-105"
            >
                <Link href={`/products/${product.slug}`} onClick={(e) => e.stopPropagation()}>
                    Додај во кошничка
                </Link>
            </Button>
        )
    }

    // disabled based on inventory?
    const isOutOfStock = product.inventory === 0

    return (
        <Button
            onClick={handleAddToCart}
            disabled={isAddingOrLoading || isOutOfStock}
            className="w-full rounded-2xl bg-white/90 text-black hover:bg-white hover:text-black shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-105"
        >
            <ShoppingBag className="w-4 h-4 mr-2 text-primary" />
            {isOutOfStock ? 'Нема на залиха' : (isAddingOrLoading ? 'Додавање...' : 'Додај во кошничка')}
        </Button>
    )
}
