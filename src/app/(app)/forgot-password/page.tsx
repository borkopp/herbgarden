import type { Metadata } from 'next'
import Link from 'next/link'

import { ForgotPasswordFormClient } from '@/components/forms/ForgotPasswordFormClient'
import { Logo } from '@/components/Logo/Logo'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default async function ForgotPasswordPage() {
  return (
    <div className="container min-h-[calc(100vh-16rem)] flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-card/10 backdrop-blur-md border border-border/50 rounded-3xl p-8 sm:p-10 shadow-sm transition-all text-center">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
          <h1 className="text-2xl font-medium tracking-tight">Заборавена лозинка</h1>
          <p className="text-sm text-muted-foreground mt-2">
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
