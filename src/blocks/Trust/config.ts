import type { Block } from 'payload'
import { linkGroup } from '@/fields/linkGroup'

export const Trust: Block = {
  slug: 'trust',
  interfaceName: 'TrustBlock',
  fields: [
    {
      name: 'tag',
      type: 'text',
      localized: true,
      defaultValue: 'OFFICIAL PARTNER',
      label: 'Top Tag',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      defaultValue: 'Вашиот извор за чист Kratom',
      label: 'Title',
    },
    {
      name: 'text',
      type: 'textarea',
      localized: true,
      defaultValue: 'HerbGarden е официјален партнер на светскиот лидер BigTrea. Ви го носиме најчистиот, лабораториски верификуван Kratom директно во Македонија. Без адитиви, без компромис – само чиста ботаничка моќ.',
      label: 'Description Text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
      required: true,
    },
    {
      name: 'badges',
      type: 'array',
      localized: true,
      label: 'Trust Badges',
      minRows: 1,
      maxRows: 4,
      defaultValue: [
        { icon: 'lab', label: '100% Lab Tested' },
        { icon: 'gmp', label: 'GMP Certified' },
        { icon: 'pure', label: 'Pure Botanical' },
      ],
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Laboratory', value: 'lab' },
            { label: 'GMP / Shield', value: 'gmp' },
            { label: 'Botanical / Leaf', value: 'pure' },
            { label: 'Safety / Check', value: 'safe' },
          ],
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'image-left',
      label: 'Layout Alignment',
      options: [
        { label: 'Image Left, Text Right', value: 'image-left' },
        { label: 'Image Right, Text Left', value: 'image-right' },
      ],
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Trust Blocks',
    singular: 'Trust Block',
  },
}
