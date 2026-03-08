'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Page } from '@/payload-types'
import { motion, Variants } from 'framer-motion'
import React from 'react'

type AboutBlockProps = Extract<Page['layout'][0], { blockType: 'about' }>

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export const AboutBlock: React.FC<AboutBlockProps> = (props) => {
    const { title, description, avatars, avatarCountLabel, avatarBottomLabel } = props

    return (
        <section className="container py-12 relative overflow-hidden md:overflow-visible">
            <motion.div
                className="max-w-4xl mx-auto text-center relative z-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                <motion.span variants={itemVariants} className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-4 block">
                    За нас
                </motion.span>

                <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-medium mb-6 text-foreground font-playfair">
                    {title}
                </motion.h2>

                <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
                    {description}
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col items-center gap-2">
                    <div className="flex -space-x-4 items-center">
                        {avatars && Array.isArray(avatars) && avatars.map((avatar, i) => {
                            // Handle relationship media object
                            const avatarUrl = typeof avatar === 'object' && avatar?.url ? avatar.url : ''
                            const avatarAlt = typeof avatar === 'object' && avatar?.alt ? avatar.alt : 'Avatar'

                            if (!avatarUrl) return null

                            return (
                                <Avatar key={i} className="border-4 border-background w-12 h-12 md:w-14 md:h-14">
                                    <AvatarImage src={avatarUrl} alt={avatarAlt} className="object-cover" />
                                    <AvatarFallback>{avatarAlt.charAt(0)}</AvatarFallback>
                                </Avatar>
                            )
                        })}
                        {/* Avatar Count Circle */}
                        <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#40C4AA] text-white text-sm font-bold border-4 border-background z-10">
                            {avatarCountLabel || '4k+'}
                        </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                        {avatarBottomLabel || 'Среќни бебиња'}
                    </span>
                </motion.div>
            </motion.div>
        </section>
    )
}
