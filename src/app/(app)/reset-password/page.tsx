import type { Metadata } from 'next'
import Link from 'next/link'

import { ResetPasswordFormClient } from '@/components/forms/ResetPasswordFormClient'
import { Logo } from '@/components/Logo/Logo'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default async function ResetPasswordPage() {
    return (
        <div className="container min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 md:py-24">
            <div className="w-full max-w-[440px] bg-white dark:bg-stone-950 border border-stone-200/60 dark:border-stone-800 rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all">
                <div className="flex flex-col items-center mb-10">
                    <Link href="/" className="mb-8 hover:opacity-70 transition-opacity">
                        <Logo />
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-center text-stone-900 dark:text-stone-100">Нова лозинка</h1>
                    <p className="text-sm text-stone-500 mt-3 text-center">
                        Внесете ја вашата нова лозинка подолу
                    </p>
                </div>
                <ResetPasswordFormClient />
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
