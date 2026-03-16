'use client'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { Page } from '@/payload-types'
import { motion, Variants } from 'framer-motion'
import { CheckCircle2, FlaskConical, Leaf, LeafIcon, ShieldCheck } from 'lucide-react'
import React from 'react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}

type TrustProps = Extract<Page['layout'][0], { blockType: 'trust' }>

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
}

const iconMap: Record<string, any> = {
  lab: FlaskConical,
  gmp: ShieldCheck,
  pure: Leaf,
  safe: CheckCircle2,
}

export const TrustBlock: React.FC<TrustProps> = (props) => {
  const { tag, title, text, image, badges, links, alignment = 'image-left' } = props

  const isImageRight = alignment === 'image-right'

  return (
    <section className="container py-20 md:py-32 overflow-hidden bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
        {/* Content Side */}
        <motion.div
          className={`flex flex-col ${isImageRight ? 'lg:order-first items-start text-left' : 'lg:order-last items-start text-left'}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {tag && (
            <motion.span
              variants={itemVariants}
              className="font-bold text-[10px] md:text-xs tracking-[0.25em] uppercase mb-6 text-[#8BA888]"
            >
              {tag}
            </motion.span>
          )}

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-display font-medium leading-[1.05] tracking-tighter mb-8 uppercase text-black"
          >
            {title}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-muted-foreground max-w-xl leading-relaxed md:text-lg mb-10 font-medium"
          >
            {text}
          </motion.p>

          {/* Links / Buttons */}
          {links && Array.isArray(links) && links.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row flex-wrap gap-4 mb-16"
            >
              {links.map((linkItem, i) => (
                <CMSLink
                  key={i}
                  {...linkItem.link}
                  className={`rounded-full px-8 h-14 text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center ${linkItem.link.appearance === 'default'
                    ? 'bg-black text-white hover:bg-black/80 hover:scale-105 active:scale-95 shadow-lg shadow-black/5'
                    : 'bg-transparent border border-black/10 text-black hover:border-black/30 hover:bg-black/5'
                    }`}
                />
              ))}
            </motion.div>
          )}

          {/* Badges Grid */}
          <div className="grid grid-cols-3 gap-6 md:gap-10 w-full">
            {badges?.map((badge, idx) => {
              const Icon = iconMap[badge.icon as string] || CheckCircle2
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex flex-col items-start gap-5"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#8BA888]/5 flex items-center justify-center text-[#8BA888]">
                    <Icon className="size-6 md:size-8" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] leading-tight text-black/60">
                    {badge.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Image Side */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={imageVariants}
          className={`relative w-full max-w-xl mx-auto lg:max-w-none ${isImageRight ? 'lg:order-last' : 'lg:order-first'}`}
        >
          {/* Subtle staggered decoration */}
          <div className="absolute -inset-4 rounded-[2rem] bg-[#8BA888]/5 -z-10 translate-x-2 translate-y-3" />

          <div className="relative aspect-[4/5] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-muted/20 shadow-xl group">
            {image && typeof image === 'object' ? (
              <Media resource={image} fill imgClassName="object-cover transition-transform duration-1000 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 bg-muted/50 flex items-center justify-center text-muted-foreground/30">
                No Image Selected
              </div>
            )}
          </div>

          {/* Floating Verification Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={`absolute -bottom-6 ${isImageRight ? '-right-4' : '-left-4'} bg-[#1a1a1a] p-5 md:p-7 rounded-2xl shadow-2xl flex items-center gap-5 z-20`}
          >
            <div className="w-12 h-12 rounded-full bg-[#8BA888] flex items-center justify-center text-white shrink-0">
              <LeafIcon size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col pr-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">Verified Partner</span>
              <span className="text-sm font-bold text-white leading-none mt-1.5">bigtrea</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
