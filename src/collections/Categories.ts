import { formatSlugCollectionHook } from '@/hooks/formatSlug'
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { revalidateCollection, revalidateDelete } from '@/hooks/revalidateCollection'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Категорија',
    plural: 'Категории',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Содржина',
  },
  hooks: {
    beforeChange: [formatSlugCollectionHook('title')],
    afterChange: [revalidateCollection],
    afterDelete: [revalidateDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Име на категорија',
      admin: {
        description: 'Внесете го името на категоријата (на пр. Маички, Панталони). Ова име ќе се појавува во менито за филтрирање.',
      },
    },
    slugField(),
  ],
}
