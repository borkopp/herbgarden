import { CallToActionBlockComponent } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { HowItWorksBlockComponent } from '@/blocks/HowItWorks/Component'
import { InstagramBlock } from '@/blocks/Instagram/Component'
import { ProductFeatureBlock } from '@/blocks/ProductFeature/Component'
import { ProductVariantsFeatureBlock } from '@/blocks/ProductVariantsFeature/Component'
import { TrustBlock } from '@/blocks/Trust/Component'
import { TrustBadgesBlock } from '@/blocks/TrustBadges/Component'
import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page } from '../payload-types'

const blockComponents = {
  content: ContentBlock,
  formBlock: FormBlock,
  instagram: InstagramBlock,
  productFeature: ProductFeatureBlock,
  productVariantsFeature: ProductVariantsFeatureBlock,
  callToAction: CallToActionBlockComponent,
  howItWorks: HowItWorksBlockComponent,
  trust: TrustBlock,
  trustBadges: TrustBadgesBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore - weird type mismatch here */}
                  <Block id={toKebabCase(blockName!)} {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
