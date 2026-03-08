import type { Block } from 'payload'

export const ProductVariantsFeature: Block = {
  slug: 'productVariantsFeature',
  interfaceName: 'ProductVariantsFeatureBlock',
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Selected Product',
    },
    {
      name: 'customImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Main Custom Image (Optional)',
      admin: {
        description: 'Overrides the default product image',
      },
      required: false,
    },
    {
      name: 'tag',
      type: 'text',
      defaultValue: 'ALL 7 FLAVOURS',
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
      label: 'Variants / Features List',
      minRows: 1,
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
      defaultValue: 'BUNDLE PRICE',
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
    plural: 'Product Variants Features',
    singular: 'Product Variants Feature (Centered)',
  },
}
