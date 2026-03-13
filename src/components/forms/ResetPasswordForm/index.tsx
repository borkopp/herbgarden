'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { AlertCircleIcon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useLocale } from '@/providers/Locale'

type FormData = {
    password: string
    passwordConfirm: string
}

export const ResetPasswordForm: React.FC = () => {
    const { dict } = useLocale()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const { resetPassword } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const {
        formState: { errors, isLoading },
        handleSubmit,
        register,
        watch,
    } = useForm<FormData>()

    const password = watch('password')

    const onSubmit = useCallback(async (data: FormData) => {
        if (!token) {
            setError(dict.auth.invalidToken)
            return
        }

        try {
            await resetPassword({
                password: data.password,
                passwordConfirm: data.passwordConfirm,
                token,
            })
            setSuccess(true)
            setError('')
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (err) {
            setError(dict.auth.resetPasswordError)
        }
    }, [resetPassword, token, router])

    if (!token) {
        return (
            <div className="text-center py-6">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6 border border-red-100">
                        <HugeiconsIcon icon={AlertCircleIcon} size={32} strokeWidth={1.5} />
                    </div>
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-4">{dict.auth.invalidProtocol}</span>
                    <h2 className="font-display text-3xl text-black uppercase tracking-tight mb-4">{dict.auth.error}</h2>
                    <p className="text-black/60 text-xs leading-relaxed max-w-[280px] font-medium mx-auto">
                        {dict.auth.resetTokenError}
                    </p>
                </div>
                <Button asChild className="w-full h-14 rounded-full bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase">
                    <Link href="/forgot-password">{dict.auth.requestNewLink}</Link>
                </Button>
            </div>
        )
    }

    return (
        <div>
            {!success && (
                <form className="text-left" onSubmit={handleSubmit(onSubmit)}>
                    <Message className="mb-8" error={error} />

                    <div className="flex flex-col gap-8">
                        <FormItem>
                            <div className="mb-3 px-1">
                                <Label htmlFor="password" title="password" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40">
                                    {dict.auth.newPassword}
                                </Label>
                            </div>
                            <Input
                                id="password"
                                placeholder="••••••••"
                                className="h-14 rounded-2xl bg-[#f6f6f6] border-none px-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-black/10 transition-all"
                                {...register('password', { required: dict.auth.passwordRequired })}
                                type="password"
                            />
                            {errors.password && <FormError message={errors.password.message} />}
                        </FormItem>

                        <FormItem>
                            <div className="mb-3 px-1">
                                <Label htmlFor="passwordConfirm" title="passwordConfirm" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40">
                                    {dict.auth.confirmPassword}
                                </Label>
                            </div>
                            <Input
                                id="passwordConfirm"
                                placeholder="••••••••"
                                className="h-14 rounded-2xl bg-[#f6f6f6] border-none px-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-black/10 transition-all"
                                {...register('passwordConfirm', {
                                    required: dict.auth.passwordRequired,
                                    validate: (value) => value === password || dict.auth.passwordsDoNotMatch,
                                })}
                                type="password"
                            />
                            {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
                        </FormItem>
                    </div>

                    <div className="flex flex-col gap-4 mt-12">
                        <Button
                            disabled={isLoading}
                            size="lg"
                            type="submit"
                            variant="default"
                            className="w-full h-14 rounded-full bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase"
                        >
                            {isLoading ? dict.auth.processing : dict.auth.resetPasswordButton}
                        </Button>
                    </div>
                </form>
            )}
            {success && (
                <div className="text-center py-6">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white mb-6 shadow-2xl shadow-black/10">
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={32} strokeWidth={1.5} />
                        </div>
                        <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-4">{dict.auth.protocolSuccess}</span>
                        <h2 className="font-display text-3xl text-black uppercase tracking-tight mb-4">{dict.auth.updated}</h2>
                        <p className="text-black/60 text-xs leading-relaxed max-w-[280px] font-medium mx-auto">
                            {dict.auth.redirectingToLogin}
                        </p>
                    </div>

                    <Button asChild className="w-full h-14 rounded-full bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase">
                        <Link href="/login">{dict.auth.returnToAccess}</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
