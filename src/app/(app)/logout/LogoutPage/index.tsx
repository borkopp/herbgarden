'use client'

import { LogoIcon } from '@/components/Logo/Logo'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import posthog from 'posthog-js'
import React, { useEffect, useState } from 'react'

export const LogoutPage: React.FC = (props) => {
  const { logout } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        posthog.capture('user_logged_out')
        posthog.reset()
        await logout()
        setSuccess('Успешно се одјавивте.')
      } catch (_) {
        setError('Веќе сте одјавени.')
      }
    }

    void performLogout()
  }, [logout])

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-[480px]">
        {/* Entrance Animation Wrapper */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          {(error || success) && (
            <div className="text-center">
              <div className="flex flex-col items-center mb-16">
                <div className="w-20 h-20 flex items-center justify-center mb-4">
                  <LogoIcon />
                </div>

                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-6 block">
                  SESSION TERMINATED
                </span>

                <h1 className="font-display text-5xl md:text-6xl leading-[0.85] tracking-tighter text-black uppercase mb-8">
                  SUCCESSFULLY<br />
                  <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #e5e5e5' }}>LOGGED OUT</span>
                </h1>

                <p className="text-black/60 text-xs md:text-sm leading-relaxed max-w-[320px] font-medium mx-auto mb-16">
                  Your secure session has been finalized. Your sensory data is safely stored in our system.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <Button asChild className="h-14 rounded-full bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild variant="outline" className="h-14 rounded-full border-black/5 text-black hover:bg-[#f6f6f6] active:scale-[0.98] transition-all text-[10px] font-bold tracking-[0.2em] uppercase">
                    <Link href="/shop">Shop</Link>
                  </Button>
                </div>
              </div>

              <div className="mt-12 text-black/40 text-[9px] font-bold uppercase tracking-widest">
                YOUR DATA IS SAFE WITH US
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
