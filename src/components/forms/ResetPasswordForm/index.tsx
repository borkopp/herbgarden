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
            <div className="text-center py-4">
                <div className="bg-destructive/10 text-destructive p-4 rounded-2xl mb-6">
                    Невалиден токен
                </div>
                <p className="text-sm text-muted-foreground mb-8">
                    Линкот за ресетирање на лозинката е невалиден или веќе е искористен.
                </p>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/forgot-password">Побарај нов линк</Link>
                </Button>
            </div>
        )
    }

    return (
        <div>
            {!success && (
                <form className="text-left" onSubmit={handleSubmit(onSubmit)}>
                    <Message className="mb-6" error={error} />

                    <div className="flex flex-col gap-5">
                        <FormItem>
                            <Label htmlFor="password">
                                Нова лозинка
                            </Label>
                            <Input
                                id="password"
                                {...register('password', { required: 'Ве молиме внесете нова лозинка.' })}
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
                                    validate: (value) => value === password || 'Лозинките не се совпаѓаат',
                                })}
                                type="password"
                            />
                            {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
                        </FormItem>
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                        <Button disabled={isLoading} size="lg" type="submit" variant="default" className="w-full">
                            {isLoading ? 'Се обработува...' : 'Ресетирај лозинка'}
                        </Button>
                    </div>
                </form>
            )}
            {success && (
                <div className="text-center py-4">
                    <div className="bg-green-100/30 text-green-600 dark:text-green-400 p-4 rounded-2xl mb-6">
                        Лозинката е успешно променета
                    </div>
                    <p className="text-sm text-muted-foreground mb-8">
                        Вашата лозинка е ажурирана. Ќе бидете пренасочени кон страницата за најава за неколку секунди.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/login">Најави се сега</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
