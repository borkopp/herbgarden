export type SortFilterItem = {
  reverse: boolean
  slug: null | string
  title: string
}

export const defaultSort: SortFilterItem = {
  slug: null,
  reverse: false,
  title: 'Азбучно А-Ш',
}

export const sorting: SortFilterItem[] = [
  defaultSort,
  { slug: '-createdAt', reverse: true, title: 'Најнови' },
  { slug: 'priceInMKD', reverse: false, title: 'Цена: од најниска' }, // asc
  { slug: '-priceInMKD', reverse: true, title: 'Цена: од највисока' },
]
