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
    <div className="container min-h-[calc(100vh-16rem)] flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-card/10 backdrop-blur-md border border-border/50 rounded-3xl p-8 sm:p-10 shadow-sm transition-all">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
          <h1 className="text-2xl font-medium tracking-tight">Креирај сметка</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Регистрирајте се за да станете дел од Tiny Me
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
