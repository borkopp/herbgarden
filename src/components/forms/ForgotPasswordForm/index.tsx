'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
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
          <Message className="mb-8" error={error} />

          <div className="flex flex-col gap-8">
            <FormItem>
              <div className="mb-3 px-1">
                <Label htmlFor="email" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40">
                  Email Address
                </Label>
              </div>
              <Input
                id="email"
                placeholder="entry@herbgarden.mk"
                className="h-14 rounded-2xl placeholder:text-black/30 bg-[#f6f6f6] border-none px-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-black/10 transition-all"
                {...register('email', { required: 'Ве молиме внесете ја вашата е-пошта.' })}
                type="email"
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>
          </div>

          <div className="flex flex-col gap-6 mt-12">
            <Button
              type="submit"
              variant="default"
              className="w-full h-14 rounded-full bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase"
              size="lg"
            >
              Reset Password
            </Button>

            <div className="relative flex items-center justify-center my-4">
              <span className="w-full border-t border-black/5" />
              <span className="absolute px-6 bg-white text-[9px] font-bold uppercase tracking-[0.3em] text-black/20">
                or
              </span>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full h-14 rounded-full border border-black/5 text-black hover:bg-[#f6f6f6] active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </form>
      )}
      {success && (
        <div className="text-center py-6">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white mb-6 shadow-2xl shadow-black/10">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-4">RESET INITIATED</span>
            <h2 className="font-display text-3xl text-black uppercase tracking-tight mb-4">Success</h2>
            <p className="text-black/60 text-xs leading-relaxed max-w-[280px] font-medium mx-auto">
              Please check your laboratory email for the secure reset protocol link.
            </p>
          </div>

          <Button asChild className="w-full h-14 rounded-full bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase">
            <Link href="/login">Return to Login</Link>
          </Button>
        </div>
      )}
    </Fragment>
  )
}
