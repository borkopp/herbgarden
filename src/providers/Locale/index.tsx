'use client'

import { type Locale } from '@/i18n/config'
import { type Dictionary } from '@/i18n/dictionaries/en'
import { createContext, useCallback, useContext, useEffect, type ReactNode } from 'react'

type LocaleContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  dict: Dictionary
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale
  dict: Dictionary
  children: ReactNode
}) {
  // Keep <html lang> in sync with the current locale
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback(
    (newLocale: Locale) => {
      // Set cookie for persistence
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;samesite=lax`

      // Navigate to the new locale path
      const currentPath = window.location.pathname
      const segments = currentPath.split('/')
      // Replace locale segment (index 1) with new locale
      segments[1] = newLocale
      window.location.href = segments.join('/')
    },
    [],
  )

  return <LocaleContext.Provider value={{ locale, setLocale, dict }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
