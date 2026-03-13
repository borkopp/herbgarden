import Link from 'next/link'

import { LoginForm } from '@/components/forms/LoginForm'
import { LogoIcon } from '@/components/Logo/Logo'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { getDictionary } from '@/i18n/getDictionary'

export default async function Login({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale as any)
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent(dict.account.alreadyLoggedIn)}`)
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
              {dict.auth.welcomeBack.split(' ')[0]}<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #e5e5e5' }}>{dict.auth.welcomeBack.split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>

          <div className="bg-white border border-black/5 rounded-[3rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)]">
            <LoginForm />
          </div>

          <div className="mt-12 text-center text-black/40 text-[9px] font-bold uppercase tracking-widest">
            {dict.auth.secureDataNote}
          </div>
        </div>
      </div>
    </div>
  )
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale as any)

  return {
    description: dict.auth.loginDesc,
    openGraph: {
      title: dict.auth.login,
      url: '/login',
    },
    title: dict.auth.login,
  }
}
