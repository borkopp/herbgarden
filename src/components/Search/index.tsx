'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { createUrl } from '@/utilities/createUrl'
import { AnimatePresence, motion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
  className?: string
}

export const Search: React.FC<Props> = ({ className }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(searchParams?.get('q') || '')
  }, [searchParams])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newParams = new URLSearchParams(searchParams.toString())

    if (query) {
      newParams.set('q', query)
    } else {
      newParams.delete('q')
    }

    router.push(createUrl('/shop', newParams))
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <div ref={searchContainerRef} className={cn("flex items-center", className)}>
      <Button
        variant="nav"
        size="clear"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center hover:cursor-pointer p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      >
        <HugeiconsIcon icon={Search01Icon} size={20} className="text-stone-700 dark:text-stone-300" strokeWidth={1.5} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 w-full bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-sm z-50 px-4 py-4 md:px-8"
          >
            <div className="container mx-auto">
              <form onSubmit={onSubmit} className="relative flex items-center w-full max-w-3xl mx-auto">
                <HugeiconsIcon icon={Search01Icon} size={20} className="absolute left-4 text-stone-400" strokeWidth={1.5} />
                <input
                  ref={inputRef}
                  autoComplete="off"
                  className="w-full rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 md:bg-stone-100/50 dark:bg-stone-800/50 px-12 py-3 text-base md:text-lg text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-primary/30 transition-all duration-200 shadow-inner"
                  value={query}
                  onChange={handleInputChange}
                  name="search"
                  placeholder="Пребарај производи..."
                  type="text"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="absolute right-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.5} />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
