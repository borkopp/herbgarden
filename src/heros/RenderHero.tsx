import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactTitleHero } from '@/heros/LowImpactTitle'

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const type = (props as any)?.type

  if (type === 'none') return null

  if (type === 'lowImpactTitle') {
    return <LowImpactTitleHero {...props} />
  }

  return <HighImpactHero {...props} />
}
