import { Banner } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Добредојдовте во Tiny Me администрацијата! ✨</h4>
      </Banner>

      <div className={`${baseClass}__grid`}>
        <div className={`${baseClass}__card`}>
          <h5>📦 Производи</h5>
          <p>
            Овде можете да додавате нови производи во вашата продавница. При креирање на производ,
            задолжително доделете му категорија за да можат купувачите полесно да го најдат.
          </p>
          <Link href="/admin/collections/products">
            Оди до производи <ArrowIcon />
          </Link>
        </div>

        <div className={`${baseClass}__card`}>
          <h5>📂 Категории</h5>
          <p>
            Организирајте ги производите во групи (на пр. Пелени, Обиколки). Откако ќе креирате категорија,
            таа може да биде истакната во главното мени на сајтот преку делот за Навигација.
          </p>
          <Link href="/admin/collections/categories">
            Уреди категории <ArrowIcon />
          </Link>
        </div>

        <div className={`${baseClass}__card`}>
          <h5>🧭 Навигација (Мени)</h5>
          <p>
            Управувајте со линковите во главното мени. Можете да додадете директни линкови до
            вашите најважни страници или да истакнете специфични категории на производи.
          </p>
          <Link href="/admin/globals/header">
            Уреди мени <ArrowIcon />
          </Link>
        </div>

        <div className={`${baseClass}__card`}>
          <h5>📄 Страници</h5>
          <p>
            Уредувајте ги содржините на статичните страници како Почетна, За нас или листата на производи.
            Секоја страница може да се гради со различни блокови на содржина.
          </p>
          <Link href="/admin/collections/pages">
            Види страници <ArrowIcon />
          </Link>
        </div>
      </div>

      <div className={`${baseClass}__footer`}>
        Совет: Можете да ја посетите вашата{' '}
        <Link href="/" target="_blank">
          веб-страница во секое време
        </Link>{' '}
        за да ја проверите содржината во живо.
      </div>
    </div>
  )
}

