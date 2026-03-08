import type { Block } from 'payload'

export const Instagram: Block = {
    slug: 'instagram',
    interfaceName: 'InstagramBlock',
    labels: {
        singular: 'Instagram Feed',
        plural: 'Instagram Feeds',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Title',
            defaultValue: 'Следете нè на Instagram',
        },
        {
            name: 'subtitle',
            type: 'text',
            label: 'Subtitle',
            defaultValue: 'Придружете се на нашата заедница и следете ги последните моменти, производи и инспирации.',
        },
        {
            name: 'handle',
            type: 'text',
            label: 'Instagram Handle (e.g. @herbgarden.mk)',
            defaultValue: '@herbgarden.mk',
        },
        {
            name: 'profileLink',
            type: 'text',
            label: 'Instagram Profile URL',
            defaultValue: 'https://www.instagram.com/herbgarden.mk',
        },
        {
            name: 'postCount',
            type: 'number',
            label: 'Number of Posts to Display',
            defaultValue: 6,
            min: 3,
            max: 12,
            admin: {
                step: 1,
            },
        },
    ],
}
