'use client'

import { Media } from '@/components/Media'
import type { HowItWorksBlock } from '@/payload-types'
import { motion, type Variants } from 'framer-motion'
import React from 'react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  },
}

export const HowItWorksBlockComponent: React.FC<HowItWorksBlock> = (props) => {
  const { title, steps } = props

  return (
    <section className="container py-24 md:py-32 overflow-hidden bg-white">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="max-w-6xl mx-auto flex flex-col items-center"
      >
        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-5xl font-display font-medium tracking-tight text-black mb-16 md:mb-24 text-center">
          {title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 w-full">
          {steps?.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="flex flex-col items-center text-center group">
              {/* Image Container */}
              <div className="relative w-full aspect-square bg-[#f9f9f9] rounded-sm mb-10 overflow-hidden flex items-center justify-center">
                {step.image && typeof step.image === 'object' ? (
                  <Media
                    resource={step.image}
                    fill
                    imgClassName="object-cover rounded-2xl mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-black/30 text-xs tracking-widest uppercase">No Image</span>
                )}
              </div>

              {/* Text Content */}
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-4 block">
                {step.tagline}
              </span>

              <h3 className="text-xl font-medium text-black mb-4 font-display">
                {step.title}
              </h3>

              <p className="text-black/60 text-sm leading-relaxed max-w-xs font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
