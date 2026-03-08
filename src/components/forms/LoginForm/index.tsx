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

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
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
        setError('Настана грешка со внесените податоци. Ве молиме обидете се повторно.')
      }
    },
    [login, router],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Message className="classes.message" error={error} />
      <div className="flex flex-col gap-5">
        <FormItem>
          <Label htmlFor="email">Е-пошта</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: 'Е-поштата е задолжителна.' })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Лозинка</Label>
            <Link href={`/forgot-password${allParams}`} className="text-xs font-medium hover:underline opacity-80">Заборавена лозинка?</Link>
          </div>
          <Input
            id="password"
            type="password"
            {...register('password', { required: 'Ве молиме внесете лозинка.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <Button className="w-full" disabled={isLoading} size="lg" type="submit" variant="default">
          {isLoading ? 'Се обработува...' : 'Најава'}
        </Button>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className=" px-2 text-muted-foreground/80">
              или
            </span>
          </div>
        </div>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href={`/create-account${allParams}`}>
            Креирај сметка
          </Link>
        </Button>
      </div>
    </form>
  )
}
