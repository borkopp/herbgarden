'use client'

import { cn } from '@/utilities/cn'
import React, { useRef } from 'react'

import type { Props as MediaProps } from '../types'
import { getClientSideURL } from '@/utilities/getURL'

export const Video: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName, fill } = props

  const videoRef = useRef<HTMLVideoElement>(null)

  if (resource && typeof resource === 'object') {
    const { filename, url } = resource

    const src = url || `${getClientSideURL()}/media/${filename}`

    return (
      <video
        autoPlay
        className={cn(
          videoClassName,
          fill && 'absolute inset-0 w-full h-full object-cover',
        )}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={src} />
      </video>
    )
  }

  return null
}
