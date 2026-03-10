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

type FormData = {
    password: string
    passwordConfirm: string
}

export const ResetPasswordForm: React.FC = () => {
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
            setError('Невалиден или истечен токен.')
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
            setError('Настана грешка при ресетирање на лозинката. Ве молиме обидете се повторно.')
        }
    }, [resetPassword, token, router])

    if (!token) {
        return (
            <div className="text-center py-6">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6 border border-red-100">
                        <HugeiconsIcon icon={AlertCircleIcon} size={32} strokeWidth={1.5} />
                    </div>
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-4">INVALID PROTOCOL</span>
                    <h2 className="font-display text-3xl text-black uppercase tracking-tight mb-4">Error</h2>
                    <p className="text-black/60 text-xs leading-relaxed max-w-[280px] font-medium mx-auto">
                        The reset token is invalid or has expired. Please request a new security link.
                    </p>
                </div>
                <Button asChild className="w-full h-14 rounded-full bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase">
                    <Link href="/forgot-password">Request New Link</Link>
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
                                    New Password
                                </Label>
                            </div>
                            <Input
                                id="password"
                                placeholder="••••••••"
                                className="h-14 rounded-2xl bg-[#f6f6f6] border-none px-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-black/10 transition-all"
                                {...register('password', { required: 'Ве молиме внесете нова лозинка.' })}
                                type="password"
                            />
                            {errors.password && <FormError message={errors.password.message} />}
                        </FormItem>

                        <FormItem>
                            <div className="mb-3 px-1">
                                <Label htmlFor="passwordConfirm" title="passwordConfirm" className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40">
                                    Confirm Password
                                </Label>
                            </div>
                            <Input
                                id="passwordConfirm"
                                placeholder="••••••••"
                                className="h-14 rounded-2xl bg-[#f6f6f6] border-none px-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-black/10 transition-all"
                                {...register('passwordConfirm', {
                                    required: 'Ве молиме потврдете ја вашата лозинка.',
                                    validate: (value) => value === password || 'Лозинките не се совпаѓаат',
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
                            {isLoading ? 'Processing...' : 'Finalize Reset'}
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
                        <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-4">PROTOCOL SUCCESS</span>
                        <h2 className="font-display text-3xl text-black uppercase tracking-tight mb-4">Updated</h2>
                        <p className="text-black/60 text-xs leading-relaxed max-w-[280px] font-medium mx-auto">
                            Your security credentials have been updated. You will be redirected to the login terminal shortly.
                        </p>
                    </div>

                    <Button asChild className="w-full h-14 rounded-full bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase">
                        <Link href="/login">Return to Access</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
