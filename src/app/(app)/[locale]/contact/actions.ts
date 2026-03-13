'use server'

import { contactForm } from '@/utilities/emails'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

interface ContactSubmission {
    name: string
    email: string
    subject: string
    message: string
}

export async function sendContactEmail(
    data: ContactSubmission,
): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config: configPromise })

        await payload.sendEmail({
            to: process.env.RESEND_DEFAULT_ADMIN_EMAIL || 'borko.petrevski@gmail.com',
            subject: contactForm.subject(data.name, data.subject),
            html: contactForm.render(data),
            replyTo: data.email,
        })

        return { success: true }
    } catch (error: any) {
        console.error('Error sending contact email:', error)
        return {
            success: false,
            error: error?.message || 'Грешка при испраќање на пораката.',
        }
    }
}
