'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useLocale } from '@/providers/Locale'

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
  const { dict } = useLocale()
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<null | string>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)
        posthog.identify(data.email, { email: data.email })
        posthog.capture('user_logged_in', { email: data.email })
        if (redirect?.current) router.push(redirect.current)
        else router.push('/account')
      } catch (_) {
        setError(dict.auth.loginError)
      }
    },
    [login, router],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Message className="mb-8" error={error} />
      <div className="flex flex-col gap-8">
        <FormItem>
          <div className="flex items-center justify-between mb-3 px-1">
            <Label htmlFor="email" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40">
              {dict.auth.emailAddress}
            </Label>
          </div>
          <Input
            id="email"
            type="email"
            placeholder="entry@herbgarden.mk"
            className="h-14 rounded-2xl placeholder:text-black/30 bg-[#f6f6f6] border-none px-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-black/10 transition-all"
            {...register('email', { required: dict.auth.emailRequired })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <div className="flex items-center justify-between mb-3 px-1">
            <Label htmlFor="password" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40">
              {dict.auth.password}
            </Label>
            <Link href={`/forgot-password${allParams}`} className="text-[9px] font-bold tracking-[0.1em] uppercase text-black/20 hover:text-black transition-colors">
              {dict.auth.resetPasswordLink}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-14 rounded-2xl placeholder:text-black/30 bg-[#f6f6f6] border-none px-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-black/10 transition-all"
            {...register('password', { required: dict.auth.passwordRequired })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>
      </div>

      <div className="flex flex-col gap-6 mt-12">
        <Button
          className="w-full h-14 rounded-full bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase"
          disabled={isLoading}
          size="lg"
          type="submit"
        >
          {isLoading ? dict.auth.processing : dict.auth.loginButton}
        </Button>

        <div className="relative flex items-center justify-center my-4">
          <span className="w-full border-t border-black/5" />
          <span className="absolute px-6 bg-white text-[9px] font-bold uppercase tracking-[0.3em] text-black/20">
            {dict.auth.or}
          </span>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-bold tracking-widest text-black/40 uppercase mb-4">{dict.auth.newHere}</p>
          <Link
            href={`/create-account${allParams}`}
            className="inline-flex items-center justify-center w-full h-14 rounded-full border border-black/5 text-black hover:bg-[#f6f6f6] active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase"
          >
            {dict.auth.createAccount}
          </Link>
        </div>
      </div>
    </form>
  )
}
