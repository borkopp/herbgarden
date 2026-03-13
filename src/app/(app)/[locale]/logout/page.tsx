import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { LogoutPageClient } from './LogoutPageClient'
import { getDictionary } from '@/i18n/getDictionary'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{
    locale: Locale
  }>
}

export default async function Logout({ params }: Props) {
  return (
    <div className="container max-w-lg my-16">
      <LogoutPageClient />
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getDictionary(locale)

  return {
    description: t.account.loggedOutSuccess,
    openGraph: mergeOpenGraph({
      title: t.account.logout,
      url: `/${locale}/logout`,
    }),
    title: t.account.logout,
  }
}
