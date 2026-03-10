import type { ReactNode } from 'react'

import { AccountNav } from '@/components/AccountNav'
import { RenderParams } from '@/components/RenderParams'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="flex flex-col h-full min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      {user && (
        <div className="w-full pt-8 md:pt-12 border-b border-stone-100 dark:border-stone-900 bg-white dark:bg-stone-950 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 md:px-0 w-full">
            <AccountNav user={user} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-8 md:px-0 md:py-12 lg:py-16 max-w-6xl w-full mx-auto @container overflow-x-hidden">
          <RenderParams className="mb-4" />
          <div className="flex flex-col grow">{children}</div>
        </div>
      </main>
    </div>
  )
}
