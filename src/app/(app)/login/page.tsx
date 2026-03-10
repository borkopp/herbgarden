import type { Metadata } from 'next'

import Link from 'next/link'

import { LoginForm } from '@/components/forms/LoginForm'
import { LogoIcon } from '@/components/Logo/Logo'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function Login() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('Веќе сте најавени.')}`)
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-[480px]">
        {/* Entrance Animation Wrapper */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <div className="flex flex-col items-center mb-10 text-center">
            <Link href="/" className="mb-4 hover:opacity-70 transition-opacity">
              <LogoIcon />
            </Link>

            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-6 block">
              HERB GARDEN
            </span>

            <h1 className="font-display text-5xl md:text-6xl leading-[0.85] tracking-tighter text-black uppercase">
              WELCOME<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #e5e5e5' }}>BACK</span>
            </h1>
          </div>

          <div className="bg-white border border-black/5 rounded-[3rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)]">
            <LoginForm />
          </div>

          <div className="mt-12 text-center text-black/40 text-[9px] font-bold uppercase tracking-widest">
            YOUR DATA IS STORED SECURELY WITH US
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Најавете се или креирајте сметка за да започнете.',
  openGraph: {
    title: 'Најава',
    url: '/login',
  },
  title: 'Најава',
}
