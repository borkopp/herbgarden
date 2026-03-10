import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'

import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { Logo } from '@/components/Logo/Logo'
import { redirect } from 'next/navigation'

export default async function CreateAccount() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('Веќе сте најавени.')}`)
  }

  return (
    <div className="container min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 md:py-24">
      <div className="w-full max-w-[440px] bg-white dark:bg-stone-950 border border-stone-200/60 dark:border-stone-800 rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all">
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="mb-8 hover:opacity-70 transition-opacity">
            <Logo />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-center text-stone-900 dark:text-stone-100">Креирај сметка</h1>
          <p className="text-sm text-stone-500 mt-3 text-center">
            Регистрирајте се за да станете дел од Herb Garden
          </p>
        </div>
        <CreateAccountForm />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Креирајте сметка или најавете се на вашата постоечка сметка.',
  openGraph: mergeOpenGraph({
    title: 'Креирај сметка',
    url: '/create-account',
  }),
  title: 'Креирај сметка',
}
