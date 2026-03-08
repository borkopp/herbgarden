import { AboutBlock } from '@/blocks/About/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { CategoriesBlock } from '@/blocks/Categories/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { InstagramBlock } from '@/blocks/Instagram/Component'
import { ProductCarouselBlock } from '@/blocks/ProductCarousel/Component'
import { ProductFeatureBlock } from '@/blocks/ProductFeature/Component'
import { ThreeItemGridBlock } from '@/blocks/ThreeItemGrid/Component'
import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page } from '../payload-types'

const blockComponents = {
  about: AboutBlock,
  carousel: CarouselBlock,
  categories: CategoriesBlock,
  content: ContentBlock,
  formBlock: FormBlock,
  instagram: InstagramBlock,
  productCarousel: ProductCarouselBlock,
  productFeature: ProductFeatureBlock,
  threeItemGrid: ThreeItemGridBlock,
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
