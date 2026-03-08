import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Suspense } from 'react'

import { CategoryAllItem, CategoryItem } from './Categories.client'

async function CategoryList() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    sort: 'title',
  })

  return (
    <div className="flex flex-row w-max md:w-auto md:flex-wrap gap-2 pr-4 md:pr-0">
      <CategoryAllItem />
      {categories.docs.map((category) => {
        return <CategoryItem key={category.id} category={category} />
      })}
    </div>
  )
}

export function Categories() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-row gap-2 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-muted/40 shrink-0" />
          ))}
        </div>
      }
    >
      <CategoryList />
    </Suspense>
  )
}
