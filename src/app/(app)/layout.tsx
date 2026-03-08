import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { GoogleAnalytics } from '@/components/Analytics/GoogleAnalytics'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { Metadata } from 'next'
import { M_PLUS_Rounded_1c, Playfair_Display, Roboto } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'

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

const mPlusRounded1c = M_PLUS_Rounded_1c({
  subsets: ['latin'],
  variable: '--font-m-plus-rounded-1c',
  weight: ['800', '700', '500', '400', '300', '100']
})

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['800', '700', '500', '400', '300', '100']
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  weight: ['800', '700', '500', '400']
})

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={`${mPlusRounded1c.variable} ${roboto.variable} ${playfairDisplay.variable}`}
      lang="en"
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
          <AdminBar />
          <LivePreviewListener />

          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main>
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
