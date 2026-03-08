'use client'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { CallToActionBlock } from '@/payload-types'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { motion } from 'framer-motion'
import React from 'react'

export const CallToActionBlockComponent: React.FC<CallToActionBlock> = (props) => {
  const { image, title, text, link } = props

  return (
    <section className="container py-16 md:py-24 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
        {/* Left Side: Image */}
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[4/3] md:aspect-[3/2] lg:aspect-[16/9] rounded-3xl overflow-hidden bg-muted/20 md:col-span-3"
        >
          {image && typeof image === 'object' ? (
            <Media resource={image} fill imgClassName="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-muted/50 flex items-center justify-center text-muted-foreground/30">
              No Image
            </div>
          )}
        </motion.div>

        {/* Right Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-col items-start md:col-span-2"
        >
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight uppercase text-black mb-6">
            {title}
          </h2>

          <p className="text-muted-foreground leading-relaxed md:text-lg mb-10 max-w-md font-medium">
            {text}
          </p>

          {link && (
            <CMSLink
              {...link}
              appearance="default"
              className="rounded-full bg-black text-white hover:bg-black/80 py-6 px-8 text-xs sm:text-sm font-bold tracking-wider gap-3 transition-transform hover:scale-105 active:scale-95 inline-flex items-center"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
            </CMSLink>
          )}
        </motion.div>
      </div>
    </section>
  )
}
