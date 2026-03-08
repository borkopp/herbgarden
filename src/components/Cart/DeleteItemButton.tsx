'use client'

import type { CartItem } from '@/components/Cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import React from 'react'

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { isLoading, removeItem } = useCart()
  const itemId = item.id

  return (
    <form>
      <button
        aria-label="Отстрани го производот од кошничката"
        className={clsx(
          'ease hover:cursor-pointer flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200',
          {
            'cursor-not-allowed px-0': !itemId || isLoading,
          },
        )}
        disabled={!itemId || isLoading}
        onClick={(e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault()
          if (itemId) removeItem(itemId)
        }}
        type="button"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={16} className="hover:text-accent-3 mx-px text-white dark:text-black" strokeWidth={2} />
      </button>
    </form>
  )
}
