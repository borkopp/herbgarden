'use client'

import { MapPin, Phone, User } from 'lucide-react'
import React from 'react'

import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import type { Address } from '@/payload-types'

type Props = {
  address: Partial<Omit<Address, 'country'>> & { country?: string } // Allow address to be partial and entirely optional as this is entirely for display purposes
  /**
   * Completely override the default actions
   */
  actions?: React.ReactNode
  /**
   * Insert elements before the actions
   */
  beforeActions?: React.ReactNode
  /**
   * Insert elements after the actions
   */
  afterActions?: React.ReactNode
  /**
   * Hide all actions
   */
  hideActions?: boolean
}

export const AddressItem: React.FC<Props> = ({
  address,
  actions,
  hideActions = false,
  beforeActions,
  afterActions,
}) => {
  if (!address) {
    return null
  }

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <User className="size-4 text-primary" />
          </div>
          <p className="font-bold text-stone-900 dark:text-stone-100">
            {address.firstName} {address.lastName}
          </p>
        </div>

        <div className="space-y-2 pl-11">
          <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400 text-sm">
            <MapPin className="size-3.5 mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span>{address.addressLine1}</span>
              <span>
                {address.city}, {address.postalCode}
              </span>
              <span className="font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider text-[10px] mt-0.5">
                {address.country}
              </span>
            </div>
          </div>

          {address.phone && (
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 text-sm">
              <Phone className="size-3.5" />
              <span>{address.phone}</span>
            </div>
          )}
        </div>
      </div>

      {!hideActions && address.id && (
        <div className="flex items-center gap-2 md:mt-2">
          {actions ? (
            actions
          ) : (
            <>
              {beforeActions}
              {address.id && (
                <CreateAddressModal
                  addressID={address.id}
                  initialData={address}
                  buttonText={'Измени'}
                  modalTitle={'Измени адреса'}
                />
              )}
              {afterActions}
            </>
          )}
        </div>
      )}
    </div>
  )
}
