import type { Locale } from '@/i18n/config'
import type { Dictionary } from './dictionaries/en'

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
    en: () => import('./dictionaries/en').then((mod) => mod.default),
    mk: () => import('./dictionaries/mk').then((mod) => mod.default),
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
    return dictionaries[locale]()
}
