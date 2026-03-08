'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'


type FormData = {
  email: string
}

export const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(async (data: FormData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
      {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    )

    if (response.ok) {
      setSuccess(true)
      setError('')
    } else {
      setError(
        'Настана проблем при обидот да ви испратиме е-пошта за ресетирање на лозинката. Ве молиме обидете се повторно.',
      )
    }
  }, [])

  return (
    <Fragment>
      {!success && (
        <form className="text-left" onSubmit={handleSubmit(onSubmit)}>
          <Message className="mb-6" error={error} />

          <div className="flex flex-col gap-5">
            <FormItem>
              <Label htmlFor="email">
                Е-пошта
              </Label>
              <Input
                id="email"
                {...register('email', { required: 'Ве молиме внесете ја вашата е-пошта.' })}
                type="email"
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <Button type="submit" variant="default" className="w-full" size="lg">
              Испрати барање
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-2 border-t pt-4">
              {'Сакате да се вратите? '}
              <Link href="/login" className="font-medium hover:underline text-foreground">Најава</Link>
            </div>
          </div>
        </form>
      )}
      {success && (
        <div className="text-center py-4">
          <div className="bg-green-100/30 text-green-600 dark:text-green-400 p-4 rounded-2xl mb-6">
            Барањето е успешно испратено
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            Проверете ја вашата е-пошта за линк кој ќе ви овозможи безбедно да ја ресетирате вашата лозинка.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Врати се на најава</Link>
          </Button>
        </div>
      )}
    </Fragment>
  )
}
