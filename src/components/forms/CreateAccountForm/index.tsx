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
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocale } from '@/providers/Locale'
import { getClientSideURL } from '@/utilities/getURL'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const { dict } = useLocale()
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(`${getClientSideURL()}/api/users`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const message = response.statusText || dict.auth.createAccountError
        setError(message)
        return
      }

      const redirect = searchParams.get('redirect')

      const timer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        await login(data)
        clearTimeout(timer)
        posthog.identify(data.email, { email: data.email })
        posthog.capture('account_created', { email: data.email })
        if (redirect) router.push(redirect)
        else router.push(`/account?success=${encodeURIComponent(dict.auth.accountCreatedSuccess)}`)
      } catch (_) {
        clearTimeout(timer)
        setError(dict.auth.loginError)
      }
    },
    [login, router, searchParams],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Message error={error} className="mb-8" />

      <div className="flex flex-col gap-8">
        <FormItem>
          <div className="mb-3 px-1">
            <Label htmlFor="email" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40">
              {dict.auth.emailAddress}
            </Label>
          </div>
          <Input
            id="email"
            placeholder="entry@herbgarden.mk"
            className="h-14 rounded-2xl placeholder:text-black/30 bg-[#f6f6f6] border-none px-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-black/10 transition-all"
            {...register('email', { required: dict.auth.emailRequired })}
            type="email"
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <div className="mb-3 px-1">
            <Label htmlFor="password" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40">
              {dict.auth.newPassword}
            </Label>
          </div>
          <Input
            id="password"
            placeholder="••••••••"
            className="h-14 rounded-2xl placeholder:text-black/30 bg-[#f6f6f6] border-none px-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-black/10 transition-all"
            {...register('password', { required: dict.auth.passwordRequired })}
            type="password"
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <FormItem>
          <div className="mb-3 px-1">
            <Label htmlFor="passwordConfirm" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40">
              {dict.auth.confirmPassword}
            </Label>
          </div>
          <Input
            id="passwordConfirm"
            placeholder="••••••••"
            className="h-14 rounded-2xl placeholder:text-black/30 bg-[#f6f6f6] border-none px-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-black/10 transition-all"
            {...register('passwordConfirm', {
              required: dict.auth.passwordRequired,
              validate: (value) => value === password.current || dict.auth.passwordsDoNotMatch,
            })}
            type="password"
          />
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </FormItem>
      </div>

      <div className="flex flex-col gap-6 mt-12">
        <Button
          disabled={loading}
          size="lg"
          type="submit"
          variant="default"
          className="w-full h-14 rounded-full bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase"
        >
          {loading ? dict.auth.processing : dict.auth.createAccountButton}
        </Button>

        <div className="relative flex items-center justify-center my-4">
          <span className="w-full border-t border-black/5" />
          <span className="absolute px-6 bg-white text-[9px] font-bold uppercase tracking-[0.3em] text-black/20">
            {dict.auth.or}
          </span>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-bold tracking-widest text-black/40 uppercase mb-4">{dict.auth.alreadyHaveAccount}</p>
          <Link
            href={`/login${allParams}`}
            className="inline-flex items-center justify-center w-full h-14 rounded-full border border-black/5 text-black hover:bg-[#f6f6f6] active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase"
          >
            {dict.auth.login}
          </Link>
        </div>
      </div>
    </form>
  )
}
