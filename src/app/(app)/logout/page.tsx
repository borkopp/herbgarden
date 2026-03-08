import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { LogoutPageClient } from './LogoutPageClient'

export default async function Logout() {
  return (
    <div className="container max-w-lg my-16">
      <LogoutPageClient />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Одјавени сте.',
  openGraph: mergeOpenGraph({
    title: 'Одјава',
    url: '/logout',
  }),
  title: 'Одјава',
}
