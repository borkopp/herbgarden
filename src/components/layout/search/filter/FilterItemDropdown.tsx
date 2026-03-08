'use client'

import { ChevronDownIcon } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { ListItem } from '.'

import { FilterItem } from './FilterItem'

export function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [active, setActive] = useState('')
  const [openSelect, setOpenSelect] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false)
      }
    }

    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ('path' in listItem && pathname === listItem.path) ||
        ('slug' in listItem && searchParams.get('sort') === listItem.slug)
      ) {
        setActive(listItem.title)
      }
    })
  }, [pathname, list, searchParams])

  return (
    <div className="relative" ref={ref}>
      <div
        className="flex w-full items-center justify-between rounded-full border border-border/50 bg-muted/30 px-6 py-2.5 text-sm font-medium text-foreground cursor-pointer transition-all duration-200 hover:border-border"
        onClick={() => {
          setOpenSelect(!openSelect)
        }}
      >
        <div>{active || 'Сортирај'}</div>
        <ChevronDownIcon className={`ml-2 h-4 w-4 text-muted-foreground transition-transform duration-200 ${openSelect ? 'rotate-180' : ''}`} />
      </div>
      {openSelect && (
        <div
          className="absolute right-0 z-40 min-w-[200px] mt-2 rounded-2xl bg-background border border-border p-2 shadow-xl"
          onClick={() => {
            setOpenSelect(false)
          }}
        >
          <ul className="flex flex-col gap-1">
            {list.map((item: ListItem, i) => (
              <FilterItem item={item} key={i} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
