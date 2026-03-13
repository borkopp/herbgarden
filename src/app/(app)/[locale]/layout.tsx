import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { GoogleAnalytics } from '@/components/Analytics/GoogleAnalytics'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { Metadata } from 'next'
import { Comfortaa, Nunito } from 'next/font/google'
import { locales, type Locale, defaultLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { LocaleProvider } from '@/providers/Locale'
import { Suspense } from 'react'
import './globals.css'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://yourdomain.com'),
  title: {
    default: 'Herb Garden',
    template: '%s | Herb Garden',
  },
  description: 'Најубавата облека и додатоци за вашите најмили.',
  openGraph: {
    type: 'website',
    locale: 'mk_MK',
    url: '/',
    siteName: 'Herb Garden',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const comfortaa = Comfortaa({
  subsets: ['latin'],
  variable: '--font-comfortaa',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = (locales.includes(localeParam as Locale) ? localeParam : defaultLocale) as Locale
  const dict = await getDictionary(locale)

  return (
    <html
      className={`${comfortaa.variable} ${nunito.variable}`}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <LocaleProvider dict={dict} locale={locale}>
            <AdminBar />
            <LivePreviewListener />

            <Suspense fallback={null}>
              <Header locale={locale} />
            </Suspense>
            <main>
              <Suspense fallback={null}>{children}</Suspense>
            </main>
            <Footer locale={locale} />
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  )
}
