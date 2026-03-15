import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  admin: {
    group: 'Содржина',
  },
  labels: {
    plural: 'Медија',
    singular: 'Медија',
  },
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Алтернативен текст (Alt Text)',
      admin: {
        description:
          'Ова е краток опис на сликата кој им помага на пребарувачите (како Google) подобро да ја разберат содржината. Исто така, овој текст се чита од апликации за лица со оштетен вид.',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Наслов/Запис под сликата (опционално, нема потреба)',
      admin: {
        description:
          'Текст кој ќе се прикаже директно под сликата на веб-страницата. Најчесто се користи за кратко објаснување или наведување на изворот на сликата.',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
  },
}
