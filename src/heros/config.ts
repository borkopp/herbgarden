import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'contentAlignment',
      type: 'select',
      defaultValue: 'center',
      label: 'Content Alignment',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      required: true,
      admin: {
        width: '50%',
      }
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'textColor',
      type: 'text',
      label: 'Main Text Color (Hex code or exact CSS color)',
      defaultValue: '#FFFFFF',
      admin: {
        description: 'Changes the overall font color for the hero text. Used instead of rich text inline colors.',
      },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      label: 'Dark Overlay Percentage (%)',
      defaultValue: 20,
      admin: {
        description: 'How dark the image should be (0-100). Higher is darker.',
      },
      min: 0,
      max: 100,
    },
    {
      name: 'media',
      type: 'upload',

      relationTo: 'media',
      required: false,
    },
  ],
  label: false,
}
