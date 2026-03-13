import type { Media, Product } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { GridTileImage } from '@/components/Grid/tile'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

import { getDictionary } from '@/i18n/getDictionary'
import type { Locale } from '@/i18n/config'

type Args = {
  params: Promise<{
    slug: string
    locale: Locale
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug, locale } = await params
  const product = await queryProductBySlug({ slug })
  const t = await getDictionary(locale)

  if (!product) return notFound()

  const gallery = product.gallery?.filter((item) => typeof item.image === 'object') || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const canIndex = product._status === 'published'

  const seoImage = metaImage || (gallery.length ? (gallery[0]?.image as Media) : undefined)

  return {
    description: product.meta?.description || '',
    openGraph: seoImage?.url
      ? {
        images: [
          {
            alt: seoImage?.alt,
            height: seoImage.height!,
            url: seoImage?.url,
            width: seoImage.width!,
          },
        ],
      }
      : null,
    robots: {
      follow: canIndex,
      googleBot: {
        follow: canIndex,
        index: canIndex,
      },
      index: canIndex,
    },
    title: `${product.meta?.title || product.title} | Herb Garden`,
  }
}

import { TrackProductView } from '@/components/Analytics/TrackProductView'
import { EditProductButton } from '@/components/product/EditProductButton'

export default async function ProductPage({ params }: Args) {
  const { slug, locale } = await params
  const product = await queryProductBySlug({ slug })
  const t = await getDictionary(locale)

  if (!product) return notFound()

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({
        ...item,
        image: item.image as Media,
      })) || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const hasStock = product.enableVariants
    ? product?.variants?.docs?.some((variant) => {
      if (typeof variant !== 'object') return false
      return variant.inventory && variant?.inventory > 0
    })
    : product.inventory! > 0

  let price = product.priceInMKD

  if (product.enableVariants && product?.variants?.docs?.length) {
    price = product?.variants?.docs?.reduce((acc, variant) => {
      if (typeof variant === 'object' && variant?.priceInMKD && acc && variant?.priceInMKD > acc) {
        return variant.priceInMKD
      }
      return acc
    }, price)
  }

  const productJsonLd = {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    description: product.description,
    image: metaImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: price,
      priceCurrency: 'MKD',
    },
  }

  const relatedProducts =
    product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct === 'object') ?? []

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      <div className="container pt-12 pb-32">
        <TrackProductView product={product} />
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-black/40 hover:text-black transition-colors mb-12 group">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform" />
            {t.common.allProducts}
          </Link>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="h-full w-full basis-full lg:basis-1/2">
              <Suspense
                fallback={
                  <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-[2rem] bg-stone-50 shadow-xl" />
                }
              >
                {Boolean(gallery?.length) && <Gallery gallery={gallery} />}
              </Suspense>
            </div>

            <div className="basis-full lg:basis-1/2 lg:py-8">
              <ProductDescription product={product} />
            </div>
          </div>
        </div>
      </div>

      {product.layout?.length ? <RenderBlocks blocks={product.layout} /> : <></>}

      {relatedProducts.length ? (
        <div className="container">
          <RelatedProducts products={relatedProducts as Product[]} title={t.products.relatedProducts} />
        </div>
      ) : (
        <></>
      )}

      <EditProductButton productId={product.id} />
    </React.Fragment>
  )
}

function RelatedProducts({ products, title }: { products: Product[]; title: string }) {
  if (!products.length) return null

  return (
    <div className="py-24">
      <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-stone-900 text-center mb-12">
        {title}
      </h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1 pb-4 snap-x">
        {products.map((product) => (
          <li
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            key={product.id}
          >
            <Link className="relative h-full w-full" href={`/products/${product.slug}`}>
              <GridTileImage
                label={{
                  amount: product.priceInMKD!,
                  title: product.title,
                }}
                media={product.meta?.image as Media}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    populate: {
      variants: {
        title: true,
        priceInMKD: true,
        inventory: true,
        options: true,
      },
    },
  })

  return result.docs?.[0] || null
}
