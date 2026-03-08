'use client'
import React, { useCallback, useMemo } from 'react'

import { Category } from '@/payload-types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
  category: Category
}

export const CategoryItem: React.FC<Props> = ({ category }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = useMemo(() => {
    return searchParams.get('category') === String(category.id)
  }, [category.id, searchParams])

  const setQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (isActive) {
      params.delete('category')
    } else {
      params.set('category', String(category.id))
    }

    const newParams = params.toString()

    router.push(pathname + '?' + newParams)
  }, [category.id, isActive, pathname, router, searchParams])

  return (
    <button
      onClick={() => setQuery()}
      className={`
        px-5 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap
        ${isActive
          ? 'bg-primary/10 text-primary'
          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
        }
      `}
    >
      {category.title}
    </button>
  )
}

export const CategoryAllItem: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = useMemo(() => {
    return !searchParams.get('category')
  }, [searchParams])

  const setQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    const newParams = params.toString()
    router.push(pathname + (newParams ? '?' + newParams : ''))
  }, [pathname, router, searchParams])

  return (
    <button
      onClick={() => setQuery()}
      className={`
        px-5 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap
        ${isActive
          ? 'bg-primary/10 text-primary'
          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
        }
      `}
    >
      Сите
    </button>
  )
}
