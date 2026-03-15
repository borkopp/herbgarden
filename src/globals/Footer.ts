import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Footer Description',
    },
    {
      name: 'columns',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'navItems',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Facebook', value: 'facebook' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      localized: true,
      label: 'Copyright Text',
    },
    {
      name: 'bottomNavItems',
      type: 'array',
      localized: true,
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
  ],
}
