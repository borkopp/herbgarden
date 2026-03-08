import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { Content } from '@/blocks/Content/config'
import { FormBlock } from '@/blocks/Form/config'
import { Instagram } from '@/blocks/Instagram/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { HowItWorks } from '@/blocks/HowItWorks/config'
import { ProductFeature } from '@/blocks/ProductFeature/config'
import { ProductVariantsFeature } from '@/blocks/ProductVariantsFeature/config'
import { hero } from '@/heros/config'
import { formatSlugCollectionHook } from '@/hooks/formatSlug'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Страница',
    plural: 'Страници',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOrPublishedStatus,
    update: adminOnly,
  },
  admin: {
    group: 'Содржина',
    description: 'Управувајте со статични страници на веб-сајтот (на пр. Почетна, За нас, Контакт).',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Наслов на страницата',
      admin: {
        description: 'Ова е внатрешниот наслов на страницата кој се користи за нејзино препознавање во овој панел.',
      },
    },
    {
      name: 'publishedOn',
      type: 'date',
      label: 'Датум на објавување',
      admin: {
        description: 'Изберете датум кога сакате оваа страница да биде официјално објавена.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Главен Дел (Hero)',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: 'Распоред на содржина (Layout)',
              blocks: [Content, FormBlock, Instagram, ProductFeature, CallToAction, HowItWorks, ProductVariantsFeature],
              required: true,
              admin: {
                description: 'Додадете различни блокови на содржина за да ја изградите вашата страница.',
              },
            },
          ],
          label: 'Содржина',
        },
        {
          name: 'meta',
          label: 'Оптимизација (SEO)',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
    beforeChange: [formatSlugCollectionHook('title')],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
}
