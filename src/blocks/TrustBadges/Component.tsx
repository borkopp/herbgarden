'use client'

import type { Page } from '@/payload-types'
import { motion, Variants } from 'framer-motion'
import { Ban, FlaskConical, Globe, Leaf, ShieldCheck, CheckCircle2, LucideIcon } from 'lucide-react'
import React from 'react'

type TrustBadgesProps = Extract<Page['layout'][0], { blockType: 'trustBadges' }>

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

const iconMap: Record<string, LucideIcon> = {
  lab: FlaskConical,
  pure: Leaf,
  origin: Globe,
  sealed: ShieldCheck,
  'no-additives': Ban,
  gmp: CheckCircle2,
  safe: ShieldCheck,
}

export const TrustBadgesBlock: React.FC<TrustBadgesProps> = (props) => {
  const { badges, backgroundColor = 'white' } = props

  const bgClasses = {
    white: 'bg-white',
    'light-green': 'bg-[#8BA888]/5',
    dark: 'bg-[#1a1a1a] text-white',
  }

  return (
    <section className={`py-12 md:py-16 ${bgClasses[backgroundColor as keyof typeof bgClasses] || bgClasses.white}`}>
      <div className="container">
        <motion.div
          className="flex flex-wrap justify-center items-center gap-x-8 gap-y-10 md:gap-x-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {badges?.map((badge, idx) => {
            const Icon = iconMap[badge.icon as string] || CheckCircle2
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex items-center gap-3 md:gap-4 group"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  backgroundColor === 'dark' 
                    ? 'bg-white/10 text-[#8BA888] group-hover:bg-[#8BA888] group-hover:text-white' 
                    : 'bg-[#8BA888]/10 text-[#8BA888] group-hover:bg-[#8BA888] group-hover:text-white'
                }`}>
                  <Icon className="size-5 md:size-6" strokeWidth={1.5} />
                </div>
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] leading-tight max-w-[120px] transition-colors duration-300 ${
                  backgroundColor === 'dark' ? 'text-white/70 group-hover:text-white' : 'text-black/60 group-hover:text-black'
                }`}>
                  {badge.label}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
