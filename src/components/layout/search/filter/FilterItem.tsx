'use client'

import type { SortFilterItem as SortFilterItemType } from '@/lib/constants'

import { createUrl } from '@/utilities/createUrl'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import type { ListItem, PathFilterItem as PathFilterItemType } from '.'

function PathFilterItem({ item }: { item: PathFilterItemType }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = pathname === item.path
  const newParams = new URLSearchParams(searchParams.toString())
  const DynamicTag = active ? 'p' : Link

  newParams.delete('q')

  return (
    <li key={item.title}>
      <DynamicTag
        className={`
          block w-full px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
          ${active
            ? 'bg-foreground text-background shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }
        `}
        href={createUrl(item.path, newParams)}
      >
        {item.title}
      </DynamicTag>
    </li>
  )
}

function SortFilterItem({ item }: { item: SortFilterItemType }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('sort') === item.slug
  const q = searchParams.get('q')
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug }),
    }),
  )
  const DynamicTag = active ? 'p' : Link

  return (
    <li key={item.title}>
      <DynamicTag
        className={`
          block w-full px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap
          ${active
            ? 'bg-primary text-background shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }
        `}
        href={href}
        prefetch={!active ? false : undefined}
      >
        {item.title}
      </DynamicTag>
    </li>
  )
}

export function FilterItem({ item }: { item: ListItem }) {
  return 'path' in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />
}
