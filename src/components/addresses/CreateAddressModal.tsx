'use client'
import { AddressForm } from '@/components/forms/AddressForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Address } from '@/payload-types'
import { Edit2, Plus } from 'lucide-react'
import { DefaultDocumentIDType } from 'payload'
import React, { useState } from 'react'

type Props = {
  addressID?: DefaultDocumentIDType
  initialData?: Partial<Omit<Address, 'country'>> & { country?: string }
  buttonText?: string
  modalTitle?: string
  callbackAction?: (address: Partial<Address>) => void
  skipSubmission?: boolean
  disabled?: boolean
}

export const CreateAddressModal: React.FC<Props> = ({
  addressID,
  initialData,
  buttonText = 'Додај нова адреса',
  modalTitle = 'Додај нова адреса',
  callbackAction,
  skipSubmission,
  disabled,
}) => {
  const [open, setOpen] = useState(false)
  const handleOpenChange = (state: boolean) => {
    setOpen(state)
  }

  const closeModal = () => {
    setOpen(false)
  }

  const handleCallback = (data: Partial<Address>) => {
    closeModal()

    if (callbackAction) {
      callbackAction(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={disabled}>
        <Button
          variant={'secondary'}
          className="flex items-center gap-2 px-6 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-all text-stone-900 dark:text-stone-100 shadow-sm"
        >
          {addressID ? <Edit2 className="size-[18px]" /> : <Plus className="size-[18px]" />}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>Оваа адреса ќе биде поврзана со вашиот профил.</DialogDescription>
        </DialogHeader>

        <AddressForm
          addressID={addressID}
          initialData={initialData}
          callbackAction={handleCallback}
          skipSubmission={skipSubmission}
        />
      </DialogContent>
    </Dialog>
  )
}
