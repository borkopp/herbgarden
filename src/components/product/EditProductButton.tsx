'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/Auth'
import { HugeiconsIcon } from '@hugeicons/react'
import { PencilEdit01Icon } from '@hugeicons/core-free-icons'
import Link from 'next/link'
import React from 'react'

export const EditProductButton: React.FC<{ productId: string | number }> = ({ productId }) => {
  const { user } = useAuth()

  // Only show if user is an admin
  const isAdmin = user?.roles?.includes('admin')

  if (!isAdmin) return null

  // Payload default admin path is /admin
  const editUrl = `/admin/collections/products/${productId}`

  return (
    <div className="fixed bottom-8 right-8 z-[100] sm:bottom-12 sm:right-12 pointer-events-none">
      <Button
        asChild
        className="rounded-full shadow-2xl gap-2 h-14 px-6 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-110 active:scale-95 pointer-events-auto"
        size="lg"
      >
        <Link href={editUrl}>
          <HugeiconsIcon icon={PencilEdit01Icon} size={20} strokeWidth={1.5} />
          <span className="font-semibold text-base">Измени</span>
        </Link>
      </Button>
    </div>
  )
}
