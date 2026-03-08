'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { motion } from 'framer-motion'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero'] & { textColor?: string | null, overlayOpacity?: number | null }> = ({ links, media, richText, contentAlignment = 'center', textColor = '#FFFFFF', overlayOpacity = 20 }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative flex items-center justify-center text-white"
      data-theme="dark"
      style={{ color: textColor || '#000000' }}
    >
      <div className={`container mb-8 z-10 relative flex items-center ${contentAlignment === 'left' ? 'justify-start' :
        contentAlignment === 'right' ? 'justify-end' :
          'justify-center'
        }`}>
        <div className={`max-w-[40.5rem] ${contentAlignment === 'left' ? 'text-left' :
          contentAlignment === 'right' ? 'text-right' :
            'text-center'
          }`}>
          {richText && (
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <RichText className="mb-6 font-playfair" data={richText} enableGutter={false} />
            </motion.div>
          )}
          {Array.isArray(links) && links.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className={`flex gap-4 ${contentAlignment === 'left' ? 'justify-start' :
                contentAlignment === 'right' ? 'justify-end' :
                  'justify-center'
                }`}
            >
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink size={'lg'} className='rounded-full text-md transition-transform hover:scale-105' {...link} />
                  </li>
                )
              })}
            </motion.ul>
          )}
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none bg-black z-0" style={{ opacity: (overlayOpacity ?? 20) / 100 }} />
      <div
        className="min-h-[80vh] select-none"
      >
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
      </div>
      <div className="absolute bottom-0 w-full overflow-hidden leading-[0] transform translate-y-[1px] z-20 text-white">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] md:h-[100px] fill-[#FAF9F6] rotate-180"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    </div>
  )
}
