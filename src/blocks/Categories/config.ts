import type { Block } from 'payload'

export const Categories: Block = {
    slug: 'categories',
    imageURL: '/categories.png',
    imageAltText: 'Categories Block',
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Section Title',
            defaultValue: 'Browse by Category',
        },
        {
            name: 'subtitle',
            type: 'text',
            label: 'Subtitle',
            defaultValue: 'Everything you need for their first years.',
        },
        {
            name: 'items',
            type: 'array',
            label: 'Categories',
            minRows: 3,
            maxRows: 6,
            required: true,
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                    label: 'Category Image',
                    admin: {
                        description: 'Please upload a PNG image without background.',
                    },
                },
                {
                    name: 'category',
                    type: 'relationship',
                    relationTo: 'categories',
                    required: true,
                    label: 'Select Category',
                },
            ],
        },
    ],
    labels: {
        plural: 'Categories Blocks',
        singular: 'Categories Block',
    },
}
