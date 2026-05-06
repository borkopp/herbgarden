import type { Block } from 'payload'

export const TrustBadges: Block = {
  slug: 'trustBadges',
  interfaceName: 'TrustBadgesBlock',
  fields: [
    {
      name: 'badges',
      type: 'array',
      localized: true,
      label: 'Trust Badges',
      minRows: 1,
      maxRows: 5,
      defaultValue: [
        { icon: 'lab', label: 'Third-party lab tested' },
        { icon: 'pure', label: '100% natural' },
        { icon: 'origin', label: 'Indonesian origin' },
        { icon: 'sealed', label: 'Sealed packaging' },
        { icon: 'no-additives', label: 'No additives' },
      ],
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Laboratory / Flask', value: 'lab' },
            { label: 'Botanical / Leaf', value: 'pure' },
            { label: 'Origin / Globe', value: 'origin' },
            { label: 'Sealed / Shield', value: 'sealed' },
            { label: 'No Additives / Ban', value: 'no-additives' },
            { label: 'GMP / Check', value: 'gmp' },
            { label: 'Safety / Shield', value: 'safe' },
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
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Green', value: 'light-green' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
  labels: {
    plural: 'Trust Badges Strips',
    singular: 'Trust Badges Strip',
  },
}
