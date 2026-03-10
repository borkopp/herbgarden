import configPromise from '@payload-config'
import { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import { WishlistClient } from './page.client'

export const metadata: Metadata = {
    title: 'Омилени производи | Herb Garden',
    description: 'Погледнете ги вашите омилени производи.',
}

export default async function WishlistPage() {
    const headers = await getHeaders()
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers })

    return (
        <div className="flex flex-col gap-12 w-full max-w-6xl mx-auto py-4">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
                <div className="mb-10">
                    {/* <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mb-3 block">Saved Items</span> */}
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-black uppercase leading-[0.85]">
                        My<br />
                        <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #e5e5e5' }}>Wishlist</span>
                    </h1>
                </div>

                <div className="bg-white border border-black/5 rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)]">
                    <WishlistClient />
                </div>
            </div>
        </div>
    )
}
