'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { motion } from 'framer-motion'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, subtitle, title, description }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    // Current design is light background, so we want the header to be 'light' (dark text)
    setHeaderTheme('light')
  })

  const words = (title || 'PURE BOTANICAL ESSENCE').split(' ')

  return (
    <section className="min-h-[calc(100vh-100px)] flex items-center justify-center  px-6 relative overflow-hidden bg-white">
      {/* Background Accents */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#4ADE80] opacity-[0.03] blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#FB7185] opacity-[0.03] blur-[100px] rounded-full" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-display text-xs tracking-[0.4em] text-black/30 uppercase mb-8 block">
            {subtitle}
          </span>
          <h1 className="text-7xl font-display md:text-9xl font-semibold leading-[0.85] tracking-tighter mb-12 text-black">
            {words.map((word, i) => (
              <React.Fragment key={i}>
                <span className={i === 1 ? 'text-black/10' : ''}>{word}</span>
                {i < words.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          {description && (
            <p className="font-body text-lg md:text-2xl text-black/60 leading-relaxed-extra max-w-2xl mx-auto mb-12 whitespace-pre-line">
              {description}
            </p>
          )}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {links.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="inline"
                  className="relative font-body uppercase tracking-widest font-bold text-sm pb-1 text-black overflow-hidden group"
                  label={null}
                >
                  <span className="relative inline-block">
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black transform translate-y-[2px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
                  </span>
                </CMSLink>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-display text-[10px] tracking-widest text-black/20 uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-black/20 to-transparent" />
      </motion.div>
    </section>
  )
}
