import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req: { payload } }) => {
  const tag = `global_${doc.globalType}`
  payload.logger.info(`Revalidating global: ${tag}`)
  revalidateTag(tag, { expire: 0 })
  return doc
}
