import type { Block } from 'payload'

export const ProductCarousel: Block = {
    slug: 'productCarousel',
    interfaceName: 'ProductCarouselBlock',
    labels: {
        singular: 'Product Carousel',
        plural: 'Product Carousels',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Section Title',
            defaultValue: 'Featured Products',
        },
        {
            name: 'subtitle',
            type: 'text',
            label: 'Subtitle',
        },
        {
            name: 'populateBy',
            type: 'select',
            defaultValue: 'category',
            options: [
                {
                    label: 'Category',
                    value: 'category',
                },
                {
                    label: 'Manual Selection',
                    value: 'selection',
                },
            ],
        },
        {
            name: 'categories',
            type: 'relationship',
            admin: {
                condition: (_, siblingData) => siblingData.populateBy === 'category',
            },
            hasMany: true,
            label: 'Categories To Show',
            relationTo: 'categories',
        },
        {
            name: 'limit',
            type: 'number',
            admin: {
                condition: (_, siblingData) => siblingData.populateBy === 'category',
                step: 1,
            },
            defaultValue: 10,
            label: 'Limit',
        },
        {
            name: 'selectedDocs',
            type: 'relationship',
            admin: {
                condition: (_, siblingData) => siblingData.populateBy === 'selection',
            },
            hasMany: true,
            label: 'Selection',
            relationTo: ['products'],
        },
    ],
}
