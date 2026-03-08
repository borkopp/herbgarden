'use client'

import { motion } from 'framer-motion'
import React, { useState } from 'react'
import type { InstagramPost } from './Component'

/* ─── SVG: Instagram logo ──────────────────────────────────────────── */
const InstagramIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
)

/* ─── SVG: Play icon (for videos) ─────────────────────────────────── */
const PlayIcon = () => (
    <svg
        className="w-8 h-8 text-white drop-shadow-lg"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
)

/* ─── SVG: Grid icon (carousel) ───────────────────────────────────── */
const GridIcon = () => (
    <svg
        className="w-5 h-5 text-white drop-shadow-lg"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
)

/* ─── Placeholder skeleton cell ───────────────────────────────────── */
const SkeletonPost = ({ index }: { index: number }) => (
    <motion.a
        href="https://www.instagram.com/tinyme.mk"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.07 }}
        className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 block group"
    >
        {/* Shimmer */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            <InstagramIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    </motion.a>
)

/* ─── Single post card ────────────────────────────────────────────── */
const PostCard = ({ post, index }: { post: InstagramPost; index: number }) => {
    const [imgError, setImgError] = useState(false)
    const displayUrl = post.media_type === 'VIDEO' ? (post.thumbnail_url ?? post.media_url) : post.media_url

    return (
        <motion.a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 block group"
        >
            {!imgError && displayUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={displayUrl}
                    alt={post.caption?.slice(0, 60) ?? 'Instagram post'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => setImgError(true)}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <InstagramIcon className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                </div>
            )}

            {/* Type badge */}
            {post.media_type === 'VIDEO' && (
                <div className="absolute top-2 right-2 z-10">
                    <PlayIcon />
                </div>
            )}
            {post.media_type === 'CAROUSEL_ALBUM' && (
                <div className="absolute top-2 right-2 z-10">
                    <GridIcon />
                </div>
            )}

            {/* Hover overlay with caption */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 group-hover:bg-black/50 transition-all duration-300 p-4">
                <InstagramIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 translate-y-2 group-hover:translate-y-0" />
                {post.caption && (
                    <p className="text-white text-xs text-center leading-snug line-clamp-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 translate-y-2 group-hover:translate-y-0">
                        {post.caption.slice(0, 100)}
                        {post.caption.length > 100 ? '…' : ''}
                    </p>
                )}
            </div>
        </motion.a>
    )
}

/* ─── Main client component ───────────────────────────────────────── */
type InstagramClientProps = {
    title?: string | null
    subtitle?: string | null
    handle?: string | null
    profileLink?: string | null
    posts: InstagramPost[]
    postCount: number
}

export const InstagramClient: React.FC<InstagramClientProps> = ({
    title,
    subtitle,
    handle,
    profileLink,
    posts,
    postCount,
}) => {
    const placeholders = Array.from({ length: postCount })

    return (
        <section className="container py-16 md:py-24 overflow-hidden">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col items-center text-center mb-10 md:mb-14 gap-4"
            >
                {/* "Follow us" badge */}
                <a
                    href={profileLink ?? 'https://instagram.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow duration-300 group"
                >
                    {/* Instagram gradient icon */}
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                        <InstagramIcon className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {handle ?? '@tinyme.mk'}
                    </span>
                </a>

                {title && (
                    <h2 className="text-3xl md:text-4xl font-playfair text-zinc-900 dark:text-zinc-50 max-w-xl">
                        {title}
                    </h2>
                )}
                {subtitle && (
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-lg text-sm md:text-base leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </motion.div>

            {/* Grid */}
            <div
                className={`grid gap-2 md:gap-3 ${postCount <= 4
                        ? 'grid-cols-2 md:grid-cols-4'
                        : postCount <= 6
                            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6'
                            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                    }`}
            >
                {posts.length > 0
                    ? posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
                    : placeholders.map((_, i) => <SkeletonPost key={i} index={i} />)}
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center mt-10"
            >
                <a
                    href={profileLink ?? 'https://instagram.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90"
                >
                    <InstagramIcon className="w-5 h-5" />
                    Следете нè на Instagram
                </a>
            </motion.div>
        </section>
    )
}
