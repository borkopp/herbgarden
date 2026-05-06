import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateCollection: CollectionAfterChangeHook = ({ doc, collection, req: { payload } }) => {
  if (doc._status === 'published') {
    const tag = `${collection.slug}_${doc.slug}`
    payload.logger.info(`Revalidating document: ${tag}`)
    revalidateTag(tag)
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, collection, req: { payload } }) => {
  const tag = `${collection.slug}_${doc?.slug}`
  payload.logger.info(`Revalidating deleted document: ${tag}`)
  revalidateTag(tag)
  return doc
}
