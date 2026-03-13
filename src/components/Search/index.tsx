'use client'

import { CompactProductGridItem } from '@/components/ProductGridItem/compact'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { Product } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { Cancel01Icon, Loading01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocale } from '@/providers/Locale'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

const DEBOUNCE_DELAY = 300 // ms

export function Search() {
  const { dict } = useLocale()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Product[]>([])
  const [dropdownTop, setDropdownTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown and collapse when clicking outside
  useOutsideClick(containerRef, () => {
    setIsOpen(false)
    setIsExpanded(false)
  })

  // Calculate dropdown position based on header
  useEffect(() => {
    const calculatePosition = () => {
      // Find the sticky header container
      const header = containerRef.current?.closest('.sticky') || containerRef.current?.closest('.relative')
      if (header) {
        const rect = header.getBoundingClientRect()
        setDropdownTop(rect.bottom)
      }
    }

    calculatePosition()
    window.addEventListener('resize', calculatePosition)
    return () => window.removeEventListener('resize', calculatePosition)
  }, [isOpen])

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      // Small delay to ensure animation starts before focus
      setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
    }
  }, [isExpanded])

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [query])

  // Fetch products when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/products?where[or][0][title][like]=${encodeURIComponent(debouncedQuery)}&where[or][1][description][like]=${encodeURIComponent(debouncedQuery)}&where[or][2][meta.description][like]=${encodeURIComponent(debouncedQuery)}&where[or][3][variants.title][like]=${encodeURIComponent(debouncedQuery)}&limit=8&depth=1`,
        )
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setResults(data.docs || [])
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [debouncedQuery])

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (value.trim()) {
      setIsOpen(true)
      setIsLoading(true) // Show loading immediately for better UX
    } else {
      setResults([])
    }
  }, [])

  // Handle enter key to navigate to shop page
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && query.trim()) {
        setIsOpen(false)
        router.push(`/shop?q=${encodeURIComponent(query.trim())}`)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        setIsExpanded(false)
        inputRef.current?.blur()
      }
    },
    [query, router],
  )

  // Handle clear search
  const handleClear = useCallback(() => {
    setQuery('')
    setDebouncedQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }, [])

  // Handle focus
  const handleFocus = useCallback(() => {
    if (query.trim()) {
      setIsOpen(true)
    }
  }, [query])

  // Handle icon button click
  const handleExpandClick = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const showDropdown = isOpen && query.trim().length > 0

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative flex items-center">
        {/* Responsive Search Bar Container */}
        <motion.div
          animate={{
            width: isExpanded ? (typeof window !== 'undefined' && window.innerWidth >= 1024 ? '208px' : '160px') : '36px',
          }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="relative"
        >
          <div
            className={cn(
              'relative h-9 flex items-center rounded-full transition-all duration-300',
              'focus-within:outline-none',
              isExpanded
                ? 'bg-white dark:bg-black shadow-sm border border-black/10 dark:border-white/20'
                : 'bg-transparent border-transparent',
              showDropdown && 'border-black/20 dark:border-white/30 ring-1 ring-black/5 dark:ring-white/5',
            )}
          >
            {/* Search Icon */}
            <motion.div
              animate={{
                x: isExpanded ? 10 : 10,
              }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute flex items-center justify-center pointer-events-none"
            >
              <HugeiconsIcon icon={Search01Icon} size={16} className="text-neutral-500 transition-colors" />
            </motion.div>

            {/* Input field */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder={dict.search.placeholder}
              style={{ outline: 'none', boxShadow: 'none' }}
              className={cn(
                'w-full h-full pl-9 pr-10 text-xs bg-transparent',
                'placeholder:text-neutral-400',
                'outline-none focus:outline-none focus-visible:outline-none',
                'border-0 focus:border-0 focus:ring-0',
                'transition-opacity duration-200',
                !isExpanded && 'opacity-0 pointer-events-none',
              )}
            />

            {/* Clear button */}
            <AnimatePresence>
              {query && isExpanded && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 p-1 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={14} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Clickable overlay when collapsed */}
            {!isExpanded && (
              <button
                type="button"
                onClick={handleExpandClick}
                className="absolute inset-0 cursor-pointer rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 group"
                aria-label={dict.common.search}
              >
                <span className="sr-only">{dict.common.search}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 z-50"
            style={{ top: dropdownTop || 64 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="w-full bg-white dark:bg-black border-b border-primary/10 shadow-xl rounded-b-[2rem] overflow-hidden"
            >
              <div className="container max-w-[90rem] py-8">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-8 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-widest uppercase text-black/40">
                      {isLoading ? (
                        <span className="flex items-center gap-3">
                          <HugeiconsIcon icon={Loading01Icon} size={16} className="animate-spin" />
                          {dict.search.searching}
                        </span>
                      ) : results.length > 0 ? (
                        dict.search.resultsCount
                          .replace('{count}', String(results.length))
                          .replace('{resultsText}', results.length === 1 ? dict.products.result : dict.products.results)
                          .replace('{query}', debouncedQuery)
                      ) : (
                        `${dict.search.noResultsFor} "${debouncedQuery}"`
                      )}
                    </span>
                  </div>
                  {query.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false)
                        router.push(`/shop?q=${encodeURIComponent(query.trim())}`)
                      }}
                      className="text-xs font-bold tracking-widest uppercase text-black hover:opacity-60 transition-opacity"
                    >
                      {dict.search.viewAllResults}
                    </button>
                  )}
                </div>

                {/* Products Grid */}
                {!isLoading && results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                  >
                    {results.slice(0, 6).map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.05 * index,
                          duration: 0.3,
                          ease: [0.32, 0.72, 0, 1],
                        }}
                        onClick={() => setIsOpen(false)}
                        className="cursor-pointer"
                      >
                        <CompactProductGridItem product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 * i }}
                        className="space-y-4 animate-pulse"
                      >
                        <div className="aspect-square bg-black/5 rounded-[2rem]" />
                        <div className="space-y-2">
                          <div className="h-3 bg-black/5 rounded w-1/4" />
                          <div className="h-4 bg-black/5 rounded w-3/4" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {!isLoading && results.length === 0 && debouncedQuery && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="py-20 text-center"
                  >
                    <HugeiconsIcon icon={Search01Icon} size={48} className="mx-auto text-black/10 mb-6" />
                    <p className="text-xl font-display uppercase tracking-tight text-black mb-2">{dict.search.noProductsFound}</p>
                    <p className="text-sm text-black/40 font-semibold tracking-wide">
                      {dict.search.tryDifferentTerm}{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false)
                          router.push('/shop')
                        }}
                        className="underline hover:text-black transition-colors"
                      >
                        {dict.search.browseAll}
                      </button>
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
            {/* Overlay backdrop - starts from dropdown, not from top */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 bottom-0 -z-10 bg-black/20 backdrop-blur-sm"
              style={{ top: dropdownTop || 64 }}
              onClick={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
