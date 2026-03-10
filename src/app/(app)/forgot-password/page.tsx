import type { Metadata } from 'next'
import Link from 'next/link'

import { ForgotPasswordFormClient } from '@/components/forms/ForgotPasswordFormClient'
import { Logo } from '@/components/Logo/Logo'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default async function ForgotPasswordPage() {
  return (
    <div className="container min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 md:py-24">
      <div className="w-full max-w-[440px] bg-white dark:bg-stone-950 border border-stone-200/60 dark:border-stone-800 rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all">
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="mb-8 hover:opacity-70 transition-opacity">
            <Logo />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-center text-stone-900 dark:text-stone-100">Заборавена лозинка</h1>
          <p className="text-sm text-stone-500 mt-3 text-center">
            Внесете ја вашата е-пошта подолу за да ја вратите лозинката
          </p>
        </div>
        <ForgotPasswordFormClient />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Внесете ја вашата е-пошта за да ја вратите лозинката.',
  openGraph: mergeOpenGraph({
    title: 'Заборавена лозинка',
    url: '/forgot-password',
  }),
  title: 'Заборавена лозинка',
}
