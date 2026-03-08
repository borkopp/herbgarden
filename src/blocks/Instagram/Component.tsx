import type { InstagramBlock as InstagramBlockProps } from '@/payload-types'
import React from 'react'
import { InstagramClient } from './Component.client'

export type InstagramPost = {
    id: string
    media_url: string
    permalink: string
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
    caption?: string
    timestamp: string
    thumbnail_url?: string
}

async function fetchInstagramPosts(count: number): Promise<InstagramPost[]> {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN

    if (!token) {
        // Return placeholder data when no token is configured
        return []
    }

    try {
        const fields = 'id,media_url,permalink,media_type,caption,timestamp,thumbnail_url'
        const res = await fetch(
            `https://graph.instagram.com/me/media?fields=${fields}&limit=${count}&access_token=${token}`,
            { next: { revalidate: 3600 } }, // Cache for 1 hour
        )

        if (!res.ok) return []

        const data = await res.json()
        return data?.data ?? []
    } catch {
        return []
    }
}

export const InstagramBlock: React.FC<InstagramBlockProps & { id?: string }> = async (props) => {
    const { title, subtitle, handle, profileLink, postCount = 6 } = props

    const posts = await fetchInstagramPosts(postCount || 6)

    return (
        <InstagramClient
            title={title}
            subtitle={subtitle}
            handle={handle}
            profileLink={profileLink}
            posts={posts}
            postCount={postCount || 6}
        />
    )
}
