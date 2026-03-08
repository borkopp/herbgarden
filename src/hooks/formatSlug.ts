import { formatSlug } from '@/utilities/formatSlug'
import type { CollectionBeforeChangeHook, FieldHook } from 'payload'

export const formatSlugHook =
    (fallback: string): FieldHook =>
        ({ data, operation, originalDoc, siblingData, value }) => {
            if (typeof value === 'string' && value) {
                return formatSlug(value)
            }

            if (siblingData?.generateSlug !== false) {
                const fallbackData = data?.[fallback] || originalDoc?.[fallback]

                if (fallbackData && typeof fallbackData === 'string') {
                    return formatSlug(fallbackData)
                }
            }

            return value
        }

export const formatSlugCollectionHook =
    (fallback: string): CollectionBeforeChangeHook =>
        ({ data }) => {
            if (data?.slug) {
                data.slug = formatSlug(data.slug)
            }

            if (data?.generateSlug !== false && data?.[fallback]) {
                data.slug = formatSlug(data[fallback])
            }

            return data
        }
