import React, { Fragment } from 'react'

import type { Props } from './types'

import { Image } from './Image'
import { Video } from './Video'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo =
    typeof resource === 'object' &&
    (resource?.mimeType?.includes('video') ||
      resource?.filename?.endsWith('.mp4') ||
      resource?.filename?.endsWith('.webm') ||
      resource?.filename?.endsWith('.ogg'))
  const Tag = (htmlElement as any) || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <Video {...props} /> : <Image {...props} />}
    </Tag>
  )
}
