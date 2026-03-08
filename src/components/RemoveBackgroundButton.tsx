'use client'

import React, { useState } from 'react'
import { Button, useDocumentInfo } from '@payloadcms/ui'
import { toast } from 'sonner'

export default function RemoveBackgroundButton() {
  const { id } = useDocumentInfo()
  const [isLoading, setIsLoading] = useState(false)

  if (!id) return null

  const handleRemoveBackground = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    
    try {
      setIsLoading(true)
      const res = await fetch(`/api/media/${id}/remove-bg`, { method: 'POST' })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to remove background')
      }
      
      toast.success('Позадината е успешно отстранета. Ве молиме освежете ја страницата.')
      
      // Auto-reload after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Настана грешка при отстранување на позадината.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <Button onClick={handleRemoveBackground} disabled={isLoading}>
        {isLoading ? 'Се отстранува...' : 'Отстрани позадина'}
      </Button>
    </div>
  )
}
