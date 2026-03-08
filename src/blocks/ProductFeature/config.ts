import type { Block } from 'payload'

export const ProductFeature: Block = {
  slug: 'productFeature',
  interfaceName: 'ProductFeatureBlock',
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Selected Product',
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
      admin: {
        description: 'Choose which side the image should be displayed on desktop',
      },
    },
    {
      name: 'customImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Custom Image',
      admin: {
        description: 'Overrides the default product image',
      },
      required: false,
    },
    {
      name: 'ingredientFocus',
      type: 'group',
      label: 'Ingredient Focus Card',
      fields: [
        {
          name: 'subtitle',
          type: 'text',
          defaultValue: 'INGREDIENT FOCUS',
          label: 'Subtitle',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Sliced Watermelon & Hibiscus',
          label: 'Title',
        },
      ],
    },
    {
      name: 'tag',
      type: 'text',
      defaultValue: 'PRODUCT BETA',
      label: 'Top Tag',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Custom Title',
      admin: {
        description: 'Overrides the default product title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Custom Description',
      admin: {
        description: 'Overrides the default product description',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features List',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'highlightColor',
      type: 'text',
      defaultValue: '#FF7F7F',
      label: 'Highlight Color',
      admin: {
        description: 'Hex code for the highlight color representing the product accents (e.g., #FF7F7F)',
      },
    },
    {
      name: 'priceLabel',
      type: 'text',
      defaultValue: 'INVESTMENT',
      label: 'Price Label',
    },
    {
      name: 'customPrice',
      type: 'text',
      label: 'Custom Price (e.g. $52.00)',
      admin: {
        description: 'Overrides the default product price. Example: $52.00',
      },
    },
  ],
  labels: {
    plural: 'Product Features',
    singular: 'Product Feature',
  },
}
