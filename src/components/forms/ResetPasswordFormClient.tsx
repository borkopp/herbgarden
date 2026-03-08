'use client'

import dynamic from 'next/dynamic'

export const ResetPasswordFormClient = dynamic(() => import('@/components/forms/ResetPasswordForm').then(mod => mod.ResetPasswordForm), {
    ssr: false,
})
