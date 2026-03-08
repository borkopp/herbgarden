import clsx from 'clsx'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import React from 'react'

export function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
      <HugeiconsIcon icon={Cancel01Icon} size={24} className={clsx('transition-all ease-in-out hover:scale-110 ', className)} strokeWidth={1.5} />
    </div>
  )
}
