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
    <div className="flex flex-col md:flex-row h-full min-h-screen bg-stone-50 dark:bg-stone-950 text-slate-900 dark:text-slate-100">
      {user && (
        <aside className="w-full md:w-72 md:sticky md:top-0 h-auto md:h-screen overflow-y-auto bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col p-6 shrink-0 z-20">
          <AccountNav user={user} className="mt-8 md:mt-0" />
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-4 md:p-8 @container overflow-x-hidden">
          <RenderParams className="mb-4" />
          <div className="flex flex-col grow">{children}</div>
        </div>
      </main>
    </div>
  )
}
