'use client'

import type { Page } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { motion } from 'framer-motion'
import React, { useEffect } from 'react'

export const LowImpactTitleHero: React.FC<Page['hero']> = ({ subtitle, title, description }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  const words = (title || '').split(' ')

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl border-b border-border/50 mx-auto w-full bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {subtitle && (
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-6 block">
            {subtitle}
          </span>
        )}
        <h1 className="font-display text-5xl md:text-7xl lg:text-[7rem] leading-[0.85] tracking-tighter text-black uppercase">
          {words.map((word, i) => (
            <React.Fragment key={i}>
              <span
                className={i === 1 ? 'text-transparent' : ''}
                style={i === 1 ? { WebkitTextStroke: '2px #e5e5e5' } : {}}
              >
                {word}
              </span>
              {i < words.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
        {description && (
          <p className="mt-8 text-black/60 text-xs md:text-sm leading-relaxed max-w-lg font-medium">
            {description}
          </p>
        )}
      </motion.div>
    </section>
  )
}
