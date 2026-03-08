'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import posthog from 'posthog-js'
import React, { Fragment, useEffect, useState } from 'react'

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
    <Fragment>
      {(error || success) && (
        <div className="prose dark:prose-invert">
          <h1>{error || success}</h1>
          <p>
            Што би сакале да правите следно?
            <Fragment>
              {' '}
              <Link href="/shop">Кликнете овде</Link>
              {` за да купувате.`}
            </Fragment>
            {` За да се најавите повторно, `}
            <Link href="/login">кликнете овде</Link>.
          </p>
        </div>
      )}
    </Fragment>
  )
}
