'use client'

import { toast } from '@payloadcms/ui'
import React, { Fragment, MouseEvent, useCallback, useState } from 'react'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    Базата е наполнета! Сега можете да ја{' '}
    <a target="_blank" href="/">
      посетите вашата веб-страница
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('Базата на податоци веќе е наполнета.')
        return
      }
      if (loading) {
        toast.info('Полнењето на базата е во тек.')
        return
      }
      if (error) {
        toast.error(`Настана грешка, ве молиме освежете ја страницата и обидете се повторно.`)
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            try {
              fetch('/next/seed', { method: 'POST', credentials: 'include' })
                .then((res) => {
                  if (res.ok) {
                    resolve(true)
                    setSeeded(true)
                  } else {
                    reject('An error occurred while seeding.')
                  }
                })
                .catch((error) => {
                  reject(error)
                })
            } catch (error) {
              reject(error)
            }
          }),
          {
            loading: 'Се полни со податоци...',
            success: <SuccessMessage />,
            error: 'Настана грешка при полнење на базата.',
          },
        )
      } catch (err) {
        setError(err)
      }
    },
    [loading, seeded, error],
  )

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        Seed your database
      </button>
      {message}
    </Fragment>
  )
}
