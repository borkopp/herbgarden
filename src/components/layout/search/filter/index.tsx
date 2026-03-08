import type { SortFilterItem } from '@/lib/constants'

import React, { Suspense } from 'react'

import { FilterItem } from './FilterItem'
import { FilterItemDropdown } from './FilterItemDropdown'
export type ListItem = PathFilterItem | SortFilterItem
export type PathFilterItem = { path: string; title: string }

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <React.Fragment>
      {list.map((item: ListItem, i) => (
        <FilterItem item={item} key={i} />
      ))}
    </React.Fragment>
  )
}

export function FilterList({ list, title }: { list: ListItem[]; title?: string }) {
  return (
    <nav>
      {title ? (
        <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">
          {title}
        </h3>
      ) : null}
      <ul className="hidden md:flex md:flex-col gap-1">
        <Suspense fallback={null}>
          <FilterItemList list={list} />
        </Suspense>
      </ul>
      <ul className="md:hidden">
        <Suspense fallback={null}>
          <FilterItemDropdown list={list} />
        </Suspense>
      </ul>
    </nav>
  )
}
