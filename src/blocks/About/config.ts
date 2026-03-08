import type { Block } from 'payload'

export const About: Block = {
    slug: 'about',
    imageURL: '/about.png',
    imageAltText: 'About Block',
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Title',
            defaultValue: "Со љубов за најмалите",
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Description',
            defaultValue: "Herb Garden е роден од долгогодишното искуство, довербата на родителите и искрената грижа за најмалите. Со локално производство и внимателно избрани материјали, создаваме повеќекратни пелени што се безбедни, практични и нежни кон природата.",
            required: true,
        },
        {
            name: 'avatars',
            type: 'upload',
            relationTo: 'media',
            hasMany: true, // Allow multiple selections for avatars
            label: 'Avatars',
            maxRows: 4, // Limit to a reasonable number to show
        },
        {
            name: 'avatarCountLabel',
            type: 'text',
            label: 'Avatar Count Label',
            defaultValue: '4k+',
            admin: {
                description: 'The text to show in the last circle (e.g., 4k+)',
            },
        },
        {
            name: 'avatarBottomLabel',
            type: 'text',
            label: 'Avatar Bottom Label',
            defaultValue: 'Среќни бебина',
            admin: {
                description: 'The text to show below the avatars (e.g., Happy Kids)',
            },
        }
    ],
    labels: {
        plural: 'About Blocks',
        singular: 'About Block',
    },
}
