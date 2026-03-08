import { cyrillicToLatin } from './transliterate'

export const formatSlug = (val: string): string =>
    cyrillicToLatin(val)
        .replace(/\s+/g, '-') // Replace all whitespace with a single dash
        .replace(/[^\w-]+/g, '') // Remove all non-word characters except dashes
        .replace(/^-+|-+$/g, '') // Remove leading and trailing dashes
        .toLowerCase()
