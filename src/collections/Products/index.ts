import { Content } from '@/blocks/Content/config'
import { formatSlugCollectionHook } from '@/hooks/formatSlug'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { DefaultDocumentIDType, slugField, Where } from 'payload'

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  labels: {
    singular: 'Производ',
    plural: 'Производи',
  },
  hooks: {
    ...defaultCollection?.hooks,
    beforeChange: [...(defaultCollection?.hooks?.beforeChange || []), formatSlugCollectionHook('title')],
  },
  admin: {
    ...defaultCollection?.admin,
    defaultColumns: ['title', 'priceInMKD', 'inventory', '_status'],
    livePreview: {
      url: ({ data, locale, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          locale,
          req,
        }),
    },
    preview: (data, { locale, req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        locale,
        req,
      }),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    ...defaultCollection?.defaultPopulate,
    title: true,
    slug: true,
    variantOptions: true,
    variants: true,
    enableVariants: true,
    gallery: true,
    priceInMKD: true,
    inventory: true,
    meta: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Наслов на производ',
      admin: {
        description:
          'Ова е главното име на производот кое ќе се појавува на страната. Треба да биде јасно и препознатливо за купувачите.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'description',
              type: 'richText',
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: 'Детален опис',
              admin: {
                description:
                  'Овде внесете го главниот опис на производот. Најдобро е да бидат неколку јасни реченици кои ќе го опишат производот, неговата намена и слично.',
              },
              required: false,
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Галерија со слики',
              labels: {
                singular: 'Слика',
                plural: 'Слики',
              },
              admin: {
                description:
                  'Додадете слики од производот. Првата слика вообичаено се користи како главна (Thumbnail) на страната.',
              },
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Избери слика',
                },
                {
                  name: 'variantOption',
                  type: 'relationship',
                  relationTo: 'variantOptions',
                  label: 'Поврзи со варијанта',
                  admin: {
                    description:
                      'Доколку производот има варијанти (на пр. бои), овде можете да ја поврзете оваа слика со специфична опција.',
                    condition: (data) => {
                      return data?.enableVariants === true && data?.variantTypes?.length > 0
                    },
                  },
                  filterOptions: ({ data }) => {
                    if (data?.enableVariants && data?.variantTypes?.length) {
                      const variantTypeIDs = data.variantTypes.map((item: any) => {
                        if (typeof item === 'object' && item?.id) {
                          return item.id
                        }
                        return item
                      }) as DefaultDocumentIDType[]

                      if (variantTypeIDs.length === 0)
                        return {
                          variantType: {
                            in: [],
                          },
                        }

                      const query: Where = {
                        variantType: {
                          in: variantTypeIDs,
                        },
                      }

                      return query
                    }

                    return {
                      variantType: {
                        in: [],
                      },
                    }
                  },
                },
              ],
            },

            {
              name: 'layout',
              type: 'blocks',
              localized: true,
              label: 'Дополнителни блокови (најчесто не се користат)',
              blocks: [Content],
              admin: {
                description:
                  'Дополнителни блокови за содржина кои ќе се прикажат под главниот опис. Користете ги за истакнување на детални информации (табели итн.)',
              },
            },
          ],
          label: 'Содржина',
        },
        {
          fields: [
            ...defaultCollection.fields.map((field) => {
              if (field && 'name' in field) {
                if (field.name === 'priceInMKD') {
                  const f = field as any
                  return {
                    ...f,
                    label: 'Цена (ден)',
                    admin: {
                      ...f.admin,
                      description: 'Внесете ја продажната цена на производот во македонски денари.',
                    },
                  }
                }
                if (field.name === 'priceInMKDEnabled') {
                  const f = field as any
                  return {
                    ...f,
                    label: 'Овозможи цена',
                    admin: {
                      ...f.admin,
                      description:
                        'Вклучете ја оваа опција за производот да има цена и да може да се купи.',
                    },
                  }
                }
                if (field.name === 'inventory') {
                  const f = field as any
                  return {
                    ...f,
                    label: 'Залиха',
                    admin: {
                      ...f.admin,
                      description:
                        'Количина достапна во магацин. Доколку е 0, ќе се прикаже како "Распродадено".',
                    },
                  }
                }
                if (field.name === 'enableVariants') {
                  const f = field as any
                  return {
                    ...f,
                    label: 'Овозможи варијанти',
                    admin: {
                      ...f.admin,
                      description:
                        'Штиклирајте го ова ако производот доаѓа во различни големини, бои или верзии.',
                    },
                  }
                }
                if (field.name === 'variantTypes') {
                  const f = field as any
                  return {
                    ...f,
                    label: 'Типови на варијанти',
                    admin: {
                      ...f.admin,
                      description:
                        'Изберете кои типови на варијанти ги има овој производ (на пр. Боја или Големина).',
                    },
                  }
                }
                if (field.name === 'variants') {
                  const f = field as any
                  return {
                    ...f,
                    label: 'Варијанти',
                    admin: {
                      ...f.admin,
                      description:
                        'Табела со сите генерирано варијанти на овој производ за секоја комбинација на бои и големини.',
                    },
                  }
                }
              }
              return field
            }),
            {
              name: 'relatedProducts',
              type: 'relationship',
              label: 'Слични производи',
              admin: {
                description:
                  'Изберете производи кои се слични или често се купуваат заедно за да им бидат препорачани на купувачите.',
              },
              filterOptions: ({ id }) => {
                if (id) {
                  return {
                    id: {
                      not_in: [id],
                    },
                  }
                }

                // ID comes back as undefined during seeding so we need to handle that case
                return {
                  id: {
                    exists: true,
                  },
                }
              },
              hasMany: true,
              relationTo: 'products',
            },
          ],
          label: 'Детали за производ',
        },
        {
          name: 'meta',
          label: 'SEO (Оптимизација)',
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
    {
      name: 'categories',
      type: 'relationship',
      label: 'Категории',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
        description: 'Изберете во кои категории спаѓа овој производ.',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    {
      name: 'badgeText',
      label: 'Текст на значка',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Краток текст врз сликата (на пр. "Ново", "Акција").',
      },
    },
    {
      name: 'badgeColor',
      label: 'Боја на значката',
      type: 'select',
      admin: {
        position: 'sidebar',
        description: 'Изберете ја бојата на позадината за значката.',
      },
      options: [
        { label: 'Стандардна (Бела)', value: 'bg-white/90 text-muted-foreground' },
        { label: 'Примарна', value: 'bg-primary text-primary-foreground' },
        { label: 'Црвена (Внимание)', value: 'bg-destructive text-destructive-foreground' },
        { label: 'Зелена', value: 'bg-green-500 text-white' },
        { label: 'Сина', value: 'bg-blue-500 text-white' },
        { label: 'Жолта', value: 'bg-yellow-500 text-white' },
      ],
      defaultValue: 'bg-white/90 text-muted-foreground',
    },
    slugField(),
  ],
})
