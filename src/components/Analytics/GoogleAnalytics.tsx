'use client'

import React from 'react'
import Script from 'next/script'

export const GoogleAnalytics: React.FC<{ ga_id: string }> = ({ ga_id }) => {
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${ga_id}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${ga_id}');
        `}
      </Script>
    </>
  )
}
