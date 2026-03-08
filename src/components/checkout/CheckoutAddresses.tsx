'use client'

import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Address } from '@/payload-types'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useState } from 'react'

type Props = {
  selectedAddress?: Address
  setAddressAction: React.Dispatch<React.SetStateAction<Partial<Address> | undefined>>
  heading?: string
  description?: string
  setSubmitAction?: React.Dispatch<React.SetStateAction<() => void | Promise<void>>>
}

export const CheckoutAddresses: React.FC<Props> = ({
  setAddressAction,
  heading = 'Адреси',
  description = 'Ве молиме изберете или додајте ги вашите адреси за достава и наплата.',
}) => {
  const { addresses } = useAddresses()

  if (!addresses || addresses.length === 0) {
    return (
      <div className="bg-[#f6f6f6] dark:bg-stone-900 border-0 rounded-2xl p-8 text-center flex flex-col items-center gap-4">
        <p className="text-black/50 text-[10px] uppercase tracking-widest font-bold">Не се пронајдени адреси</p>

        <CreateAddressModal />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-xl font-medium mb-2">{heading}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <AddressesModal setAddressAction={setAddressAction} />
    </div>
  )
}

const AddressesModal: React.FC<Props> = ({ setAddressAction }) => {
  const [open, setOpen] = useState(false)
  const handleOpenChange = (state: boolean) => {
    setOpen(state)
  }

  const closeModal = () => {
    setOpen(false)
  }
  const { addresses } = useAddresses()

  if (!addresses || addresses.length === 0) {
    return <p className="p-8 text-center text-stone-500">Не се пронајдени адреси. Ве молиме додајте адреса.</p>
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="rounded-full px-8 py-3 h-auto uppercase text-[10px] tracking-widest bg-black text-white hover:bg-black/90 transition-all font-bold"
        >
          Изберете адреса
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{'Изберете адреса'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-12">
          <ul className="flex flex-col gap-8">
            {addresses.map((address) => (
              <li key={address.id} className="border-b pb-8 last:border-none">
                <AddressItem
                  address={address}
                  beforeActions={
                    <Button
                      variant="default"
                      className="rounded-xl px-6 py-2 shadow-sm font-bold transition-all hover:scale-[1.02]"
                      onClick={(e) => {
                        e.preventDefault()
                        setAddressAction(address)
                        closeModal()
                      }}
                    >
                      Избери
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>

          <CreateAddressModal />
        </div>
      </DialogContent>
    </Dialog>
  )
}
