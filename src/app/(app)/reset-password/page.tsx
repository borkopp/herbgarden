import type { Metadata } from 'next'
import Link from 'next/link'

import { ResetPasswordFormClient } from '@/components/forms/ResetPasswordFormClient'
import { Logo } from '@/components/Logo/Logo'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default async function ResetPasswordPage() {
    return (
        <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-20 px-4">
            <div className="w-full max-w-[480px]">
                {/* Entrance Animation Wrapper */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <Link href="/" className="mb-12 hover:opacity-70 transition-opacity">
                            <Logo />
                        </Link>

                        <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-6 block">
                            SECURITY PROTOCOL
                        </span>

                        <h1 className="font-display text-5xl md:text-6xl leading-[0.85] tracking-tighter text-black uppercase mb-6">
                            RESET<br />
                            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #e5e5e5' }}>PASSWORD</span>
                        </h1>

                        <p className="text-black/60 text-xs md:text-sm leading-relaxed max-w-[280px] font-medium mx-auto">
                            Finalize the reset protocol by establishing your new secure laboratory credentials.
                        </p>
                    </div>

                    <div className="bg-white border border-black/5 rounded-[3rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)]">
                        <ResetPasswordFormClient />
                    </div>

                    <div className="mt-12 text-center text-black/40 text-[9px] font-bold uppercase tracking-widest">
                        SECURE ACCESS SYSTEM VERSION 2.5
                    </div>
                </div>
            </div>
        </div>
    )
}

export const metadata: Metadata = {
    description: 'Поставете нова лозинка за вашата сметка.',
    openGraph: mergeOpenGraph({
        title: 'Ресетирање на лозинка',
        url: '/reset-password',
    }),
    title: 'Ресетирање на лозинка',
}
