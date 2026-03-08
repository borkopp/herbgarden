import type { CollectionConfig } from 'payload'
import fs from 'fs'
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
    plural: 'Слики',
    singular: 'Слика',
  },
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'removeBackground',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/RemoveBackgroundButton',
        },
      },
    },
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
        description: 'Текст кој ќе се прикаже директно под сликата на веб-страницата. Најчесто се користи за кратко објаснување или наведување на изворот на сликата.',
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
  endpoints: [
    {
      path: '/:id/remove-bg',
      method: 'post',
      handler: async (req) => {
        const { id } = req.routeParams || {}
        if (!id) return Response.json({ error: 'Missing ID' }, { status: 400 })
        
        const removeBgApiKey = process.env.REMOVE_BG_API_KEY
        if (!removeBgApiKey) {
          return Response.json({ error: 'remove.bg API Key - Process env REMOVE_BG_API_KEY is not configured.' }, { status: 500 })
        }

        try {
          const doc = await req.payload.findByID({
            collection: 'media',
            id: id as string,
          })

          if (!doc || !doc.filename) return Response.json({ error: 'Media not found' }, { status: 404 })

          const filePath = path.resolve(dirname, '../../public/media', doc.filename)
          if (!fs.existsSync(filePath)) {
            return Response.json({ error: 'File not found on disk' }, { status: 404 })
          }

          const fileData = fs.readFileSync(filePath)

          const formData = new FormData()
          const blob = new Blob([fileData], { type: doc.mimeType || 'image/jpeg' })
          formData.append('image_file', blob, doc.filename)
          formData.append('size', 'auto')

          const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
              'X-Api-Key': removeBgApiKey,
            },
            body: formData,
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.error('remove.bg error:', errorText)
            return Response.json({ error: 'Failed to process image with remove.bg' }, { status: 500 })
          }

          const arrayBuffer = await response.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          
          await req.payload.update({
            collection: 'media',
            id: id as string,
            data: {},
            file: {
              data: buffer,
              mimetype: 'image/png',
              name: `no-bg-${doc.filename.split('.')[0]}.png`,
              size: buffer.length,
            },
            req,
            overrideAccess: true, // Internal endpoint
          })

          return Response.json({ success: true })
        } catch (error: any) {
          console.error(error)
          return Response.json({ error: error.message || 'Internal server error' }, { status: 500 })
        }
      }
    }
  ],
}

