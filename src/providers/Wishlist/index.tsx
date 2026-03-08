'use client'

import type { Product } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type WishlistContextType = {
    wishlistItems: Product[]
    isInWishlist: (productId: number | string) => boolean
    toggleWishlist: (product: Product) => Promise<void>
    isWishlistLoading: boolean
    wishlistHasLoaded: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = 'tinyme_wishlist'

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth()
    const [wishlistItems, setWishlistItems] = useState<Product[]>([])
    const [isWishlistLoading, setIsWishlistLoading] = useState(true)
    const [wishlistHasLoaded, setWishlistHasLoaded] = useState(false)

    // Merge logic (runs once when user logs in)
    useEffect(() => {
        let isCancelled = false

        const syncWishlist = async () => {
            if (!user) {
                // Guest mode: load from localStorage
                try {
                    const localString = window.localStorage.getItem(LOCAL_STORAGE_KEY)
                    if (localString) {
                        setWishlistItems(JSON.parse(localString))
                    } else {
                        setWishlistItems([])
                    }
                } catch (error) {
                    console.error('Error loading wishlist from local storage', error)
                }
                setIsWishlistLoading(false)
                setWishlistHasLoaded(true)
                return
            }

            // User mode
            setIsWishlistLoading(true)

            try {
                // 1. Get current local storage items
                const localString = window.localStorage.getItem(LOCAL_STORAGE_KEY)
                const localItems: Product[] = localString ? JSON.parse(localString) : []

                // 2. Get user's DB wishlist
                // Ensure wishlist is an array and filter out nulls or invalid types
                const dbItems: Product[] = Array.isArray(user.wishlist)
                    ? (user.wishlist.filter(
                        (item) => typeof item === 'object' && item !== null,
                    ) as Product[])
                    : []

                // 3. Merge them (deduplicate by id)
                const mergedMap = new Map<number | string, Product>()

                dbItems.forEach((item) => mergedMap.set(item.id, item))
                localItems.forEach((item) => mergedMap.set(item.id, item))

                const mergedItems = Array.from(mergedMap.values())

                if (!isCancelled) {
                    setWishlistItems(mergedItems)
                    setWishlistHasLoaded(true)
                }

                // 4. Update DB if local items existed and we merged them
                if (localItems.length > 0) {
                    await fetch('/api/users/me', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            wishlist: mergedItems.map((i) => i.id),
                        }),
                    })
                    // Clear local storage after successful merge
                    window.localStorage.removeItem(LOCAL_STORAGE_KEY)
                }
            } catch (error) {
                console.error('Error syncing wishlist:', error)
            } finally {
                if (!isCancelled) {
                    setIsWishlistLoading(false)
                }
            }
        }

        syncWishlist()

        return () => {
            isCancelled = true
        }
    }, [user]) // Re-run when user changes (e.g. login/logout)

    const isInWishlist = useCallback(
        (productId: number | string) => {
            return wishlistItems.some((item) => item.id === productId)
        },
        [wishlistItems],
    )

    const toggleWishlist = useCallback(
        async (product: Product) => {
            setIsWishlistLoading(true)
            const productId = product.id
            const currentlyInWishlist = isInWishlist(productId)

            // Optimistic update
            const newItems = currentlyInWishlist
                ? wishlistItems.filter((item) => item.id !== productId)
                : [...wishlistItems, product]

            setWishlistItems(newItems)

            if (!user) {
                // Guest mode: save to local storage
                window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems))
                setIsWishlistLoading(false)
            } else {
                // User mode: save to DB
                try {
                    await fetch('/api/users/me', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            wishlist: newItems.map((i) => i.id),
                        }),
                    })
                } catch (error) {
                    console.error('Failed to update wishlist on server', error)
                    // Revert optimistic update on failure
                    setWishlistItems(wishlistItems)
                } finally {
                    setIsWishlistLoading(false)
                }
            }
        },
        [isInWishlist, user, wishlistItems],
    )

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                isInWishlist,
                toggleWishlist,
                isWishlistLoading,
                wishlistHasLoaded,
            }}
        >
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => {
    const context = useContext(WishlistContext)
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}
