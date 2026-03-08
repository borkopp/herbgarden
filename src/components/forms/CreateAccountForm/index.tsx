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

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const message = response.statusText || 'Настана грешка при креирањето на сметката.'
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
        else router.push(`/account?success=${encodeURIComponent('Сметката е успешно креирана')}`)
      } catch (_) {
        clearTimeout(timer)
        setError('Настана грешка со внесените податоци. Ве молиме обидете се повторно.')
      }
    },
    [login, router, searchParams],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Message error={error} />

      <div className="flex flex-col gap-5 mt-2">
        <FormItem>
          <Label htmlFor="email">
            Е-пошта
          </Label>
          <Input
            id="email"
            {...register('email', { required: 'Е-поштата е задолжителна.' })}
            type="email"
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="password">
            Нова лозинка
          </Label>
          <Input
            id="password"
            {...register('password', { required: 'Лозинката е задолжителна.' })}
            type="password"
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="passwordConfirm">
            Потврди лозинка
          </Label>
          <Input
            id="passwordConfirm"
            {...register('passwordConfirm', {
              required: 'Ве молиме потврдете ја вашата лозинка.',
              validate: (value) => value === password.current || 'Лозинките не се совпаѓаат',
            })}
            type="password"
          />
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </FormItem>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <Button disabled={loading} size="lg" type="submit" variant="default" className="w-full">
          {loading ? 'Се обработува...' : 'Креирај сметка'}
        </Button>

        <div className="text-center text-sm text-muted-foreground mt-2 border-t pt-4">
          {'Веќе имате сметка? '}
          <Link href={`/login${allParams}`} className="font-medium hover:underline text-foreground">Најава</Link>
        </div>
      </div>
    </form>
  )
}
