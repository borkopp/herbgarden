import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Навигација (Мени)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'highlightCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Истакнати категории',
      admin: {
        description: 'Изберете категории кои сакате да се појават горе во менито.',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Линкови во менито',
      labels: {
        singular: 'Линк',
        plural: 'Линкови',
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        description: 'Овде можете да ги дефинирате главните линкови кои ќе се појавуваат во горниот дел на веб-страницата. Максималниот број на ставки е 6.',
      },
    },

  ],
}

