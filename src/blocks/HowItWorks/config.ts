import type { Block } from 'payload'

export const HowItWorks: Block = {
  slug: 'howItWorks',
  interfaceName: 'HowItWorksBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'How it Works',
      label: 'Main Title',
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 3,
      label: 'Steps',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'tagline',
          type: 'text',
          required: true,
          defaultValue: 'STEP 01',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: 'How it Works Blocks',
    singular: 'How it Works Block',
  },
}
