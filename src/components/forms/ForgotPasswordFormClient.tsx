'use client'

import dynamic from 'next/dynamic'

export const ForgotPasswordFormClient = dynamic(() => import('@/components/forms/ForgotPasswordForm').then(mod => mod.ForgotPasswordForm), {
    ssr: false,
})
