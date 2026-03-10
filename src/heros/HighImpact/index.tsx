'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { motion, Variants } from 'framer-motion'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, subtitle, title, description, media, overlayOpacity }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  const words = (title || 'PURE BOTANICAL ESSENCE').split(' ')

  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const fadeInUpVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <section className="min-h-[calc(100vh-100px)] flex items-center justify-center px-6 relative overflow-hidden bg-white">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {media && typeof media === 'object' && (
          <Media 
            fill 
            imgClassName="object-cover" 
            videoClassName="object-cover"
            priority 
            resource={media} 
          />
        )}
      </div>

      {/* Background Overlay (White with configurable opacity) */}
      <div
        className="absolute inset-0 z-[1] bg-white"
        style={{ opacity: (overlayOpacity ?? 100) / 100 }}
      />

      {/* Background Accents */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#4ADE80] opacity-[0.03] blur-[100px] rounded-full z-[2]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#FB7185] opacity-[0.03] blur-[100px] rounded-full z-[2]" />

      {/* Bottom Gradient Fade to White */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-[3]" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {subtitle && (
            <motion.span
              variants={fadeInUpVariants}
              className="font-display text-xs tracking-[0.4em] text-black/30 uppercase mb-8 block"
            >
              {subtitle}
            </motion.span>
          )}

          <h1 className="text-7xl font-display md:text-9xl font-semibold leading-[0.85] tracking-tighter mb-12 text-black">
            {words.map((word, i) => (
              <React.Fragment key={i}>
                <motion.span
                  variants={fadeInUpVariants}
                  className={`inline-block ${i === 1 ? 'text-black/10' : ''}`}
                >
                  {word}
                </motion.span>
                {i < words.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>

          {description && (
            <motion.p
              variants={fadeInUpVariants}
              className="font-body text-lg md:text-xl text-black/60 leading-relaxed-extra max-w-2xl mx-auto mb-12 whitespace-pre-line"
            >
              {description}
            </motion.p>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <motion.div
              variants={fadeInUpVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
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
            </motion.div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-display text-[10px] tracking-widest text-black/20 uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-black/20 to-transparent" />
      </motion.div>
    </section>
  )
}
