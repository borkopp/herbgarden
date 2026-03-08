import React from 'react'
import { cn } from '@/utilities/cn'
import { VariantProps, cva } from 'class-variance-authority'
import { HugeiconsIcon } from '@hugeicons/react'
import { Loading01Icon } from '@hugeicons/core-free-icons'

const spinnerVariants = cva('flex-col items-center justify-center', {
  variants: {
    show: {
      true: 'flex',
      false: 'hidden',
    },
  },
  defaultVariants: {
    show: true,
  },
})

const loaderVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      small: 'size-6',
      medium: 'size-8',
      large: 'size-12',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
})

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string
  children?: React.ReactNode
}

export function LoadingSpinner({ size, show, children, className }: SpinnerContentProps) {
  return (
    <span className={spinnerVariants({ show })}>
      <HugeiconsIcon icon={Loading01Icon} size={size === 'small' ? 24 : size === 'large' ? 48 : 32} className={cn(loaderVariants({ size }), className)} strokeWidth={1.5} />
      {children}
    </span>
  )
}
