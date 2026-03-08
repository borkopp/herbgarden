import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import { Categories } from '@/components/layout/search/Categories'
import { FilterItemDropdown } from '@/components/layout/search/filter/FilterItemDropdown'
import { sorting } from '@/lib/constants'
import { latinToCyrillic } from '@/utilities/transliterate'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { Suspense } from 'react'

export const metadata: Metadata = {
  description: 'Discover lovingly curated baby clothes, toys, and essentials.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const { q: searchValue, sort, category, minPrice, maxPrice } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const whereConditions: any[] = [
    {
      _status: {
        equals: 'published',
      },
    },
  ]

  if (searchValue) {
    const cyrillicSearchValue = latinToCyrillic(searchValue as string)

    whereConditions.push({
      or: [
        {
          title: {
            like: searchValue,
          },
        },
        {
          description: {
            like: searchValue,
          },
        },
        {
          title: {
            like: cyrillicSearchValue,
          },
        },
        {
          description: {
            like: cyrillicSearchValue,
          },
        },
      ],
    })
  }

  if (category) {
    whereConditions.push({
      categories: {
        contains: category,
      },
    })
  }

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInMKD: true,
    },
    ...(sort ? { sort } : { sort: 'title' }),
    where: {
      and: whereConditions,
    },
  })

  return (
    <div className="space-y-12 mb-48">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {searchValue ? `Резултати за "${searchValue}"` : 'Сите производи'}
        </h1>
        <p className="text-neutral-500 text-md">
          Се прикажуваат {products.docs.length} {products.docs.length === 1 ? 'продукт' : 'уникатни рачно изработени производи'}.
        </p>
        {(searchValue || category || sort) && (
          <div className="flex justify-center pt-4">
            <Link href="/shop" className="text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40 px-5 py-2 rounded-xl transition-colors">
              Исчисти ги сите филтри
            </Link>
          </div>
        )}
      </div>

      {/* Filters & Sorting Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border/40 pb-8">
        <div className="flex-1 w-full overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <Categories />
        </div>
        <div className="w-full md:w-auto min-w-[200px]">
          <Suspense fallback={null}>
            <FilterItemDropdown list={sorting} />
          </Suspense>
        </div>
      </div>

      {/* Products Area */}
      <div>
        {products.docs?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-muted/40 flex items-center justify-center mb-6">
              <HugeiconsIcon icon={Search01Icon} size={40} className="text-muted-foreground/40" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Не се пронајдени продукти</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Обидете се да ги прилагодите филтрите или термините за пребарување за да го најдете она што го барате.
            </p>
          </div>
        ) : (
          <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.docs.map((product) => {
              return <ProductGridItem key={product.id} product={product} />
            })}
          </Grid>
        )}
      </div>
    </div>
  )
}
