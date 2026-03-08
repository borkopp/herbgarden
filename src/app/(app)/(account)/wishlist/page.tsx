import configPromise from '@payload-config'
import { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import { WishlistClient } from './page.client'

export const metadata: Metadata = {
    title: 'Омилени производи | TinyMe',
    description: 'Погледнете ги вашите омилени производи.',
}

export default async function WishlistPage() {
    const headers = await getHeaders()
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers })

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Омилени производи</h1>
                    <p className="text-stone-500 mt-1">
                        Листа на сите производи кои сте ги зачувале.
                    </p>
                </div>
            </div>

            <WishlistClient />
        </div>
    )
}
