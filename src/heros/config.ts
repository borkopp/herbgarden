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
  localized: true,
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpactTitle',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Low Impact (title)',
          value: 'lowImpactTitle',
        },
      ],
      required: true,
    },
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
        condition: (_, siblingData) => siblingData?.type === 'highImpact',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      admin: {
        description: 'The small text above the title',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'The text below the title',
      },
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
        description:
          'Changes the overall font color for the hero text. Used instead of rich text inline colors.',
        condition: (_, siblingData) => siblingData?.type === 'highImpact',
      },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      label: 'Dark Overlay Percentage (%)',
      defaultValue: 20,
      admin: {
        description: 'How dark the image should be (0-100). Higher is darker.',
        condition: (_, siblingData) => siblingData?.type === 'highImpact',
      },
      min: 0,
      max: 100,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Upload an image or a video for the hero background.',
        condition: (_, siblingData) => siblingData?.type === 'highImpact',
      },
    },
  ],
  label: false,
}
