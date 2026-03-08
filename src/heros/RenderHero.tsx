import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const type = (props as any)?.type

  if (type === 'none') return null

  return <HighImpactHero {...props} />
}
