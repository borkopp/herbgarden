'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { useRouter } from 'next/navigation'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useLocale } from '@/providers/Locale'
import { getClientSideURL } from '@/utilities/getURL'

type FormData = {
  email: string
  name: User['name']
  password: string
  passwordConfirm: string
}

export const AccountForm: React.FC = () => {
  const { setUser, user } = useAuth()
  const [changePassword, setChangePassword] = useState(false)
  const { dict: t } = useLocale()

  const {
    formState: { errors, isLoading, isSubmitting, isDirty },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const router = useRouter()

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        const response = await fetch(`${getClientSideURL()}/api/users/${user.id}`, {
          // Make sure to include cookies with fetch
          body: JSON.stringify(data),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        })

        if (response.ok) {
          const json = await response.json()
          setUser(json.doc)
          toast.success(t.account.successfullyUpdated)
          setChangePassword(false)
          reset({
            name: json.doc.name,
            email: json.doc.email,
            password: '',
            passwordConfirm: '',
          })
        } else {
          toast.error(t.account.problemUpdating)
        }
      }
    },
    [user, setUser, reset, t],
  )

  useEffect(() => {
    if (user === null) {
      router.push(
        `/login?error=${encodeURIComponent(
          t.account.loginWarning,
        )}&redirect=${encodeURIComponent('/account')}`,
      )
    }

    // Once user is loaded, reset form to have default values
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        passwordConfirm: '',
      })
    }
  }, [user, router, reset, changePassword, t])

  return (
    <form className="max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
      {!changePassword ? (
        <Fragment>
          <div className="mb-12">
            <p className="text-[11px] font-bold tracking-[0.05em] text-black/40 uppercase leading-relaxed">
              {t.account.changeDetails}
              <button
                className="text-black underline underline-offset-4 hover:text-black/60 transition-colors bg-transparent border-none p-0 cursor-pointer"
                onClick={() => setChangePassword(!changePassword)}
                type="button"
              >
                {t.account.clickHere}
              </button>
              {t.account.changePassword}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <FormItem>
              <Label htmlFor="name" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-3 block px-1">
                {t.account.name}
              </Label>
              <Input
                id="name"
                {...register('name', { required: t.account.nameRequired })}
                type="text"
                className="h-14 rounded-2xl bg-[#f6f6f6] border-none px-6 focus-visible:ring-1 focus-visible:ring-black/5"
              />
              {errors.name && <FormError message={errors.name.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="email" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-3 block px-1">
                {t.account.email}
              </Label>
              <Input
                id="email"
                {...register('email', { required: t.account.emailRequired })}
                type="email"
                className="h-14 rounded-2xl bg-[#f6f6f6] border-none px-6 focus-visible:ring-1 focus-visible:ring-black/5"
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="mb-12">
            <p className="text-[11px] font-bold tracking-[0.05em] text-black/40 uppercase leading-relaxed">
              {t.account.changePasswordLabel + ': '}
              <button
                className="text-black underline underline-offset-4 hover:text-black/60 transition-colors bg-transparent border-none p-0 cursor-pointer"
                onClick={() => setChangePassword(!changePassword)}
                type="button"
              >
                {t.account.cancel}
              </button>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <FormItem>
              <Label htmlFor="password" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-3 block px-1">
                {t.account.password}
              </Label>
              <Input
                id="password"
                {...register('password', { required: t.account.newPasswordRequired })}
                type="password"
                className="h-14 rounded-2xl bg-[#f6f6f6] border-none px-6 focus-visible:ring-1 focus-visible:ring-black/5"
              />
              {errors.password && <FormError message={errors.password.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="passwordConfirm" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-3 block px-1">
                {t.account.confirmPasswordLabel}
              </Label>
              <Input
                id="passwordConfirm"
                {...register('passwordConfirm', {
                  required: t.account.confirmPasswordRequired,
                  validate: (value) => value === password.current || t.account.passwordsDoNotMatch,
                })}
                type="password"
                className="h-14 rounded-2xl bg-[#f6f6f6] border-none px-6 focus-visible:ring-1 focus-visible:ring-black/5"
              />
              {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
            </FormItem>
          </div>
        </Fragment>
      )}

      <div className="flex justify-start">
        <Button
          disabled={isLoading || isSubmitting || (!isDirty && !changePassword)}
          type="submit"
          className="h-14 px-12 rounded-full bg-black text-white hover:bg-stone-800 transition-all font-bold text-[10px] tracking-[0.2em] uppercase"
        >
          {isLoading || isSubmitting
            ? t.account.processing + '...'
            : changePassword
              ? t.account.changePasswordButton
              : t.account.updateAccountButton}
        </Button>
      </div>
    </form>
  )
}
