'use client'

import { AddressItem } from '@/components/addresses/AddressItem'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useLocale } from '@/providers/Locale'
import React from 'react'

export const AddressListing: React.FC = () => {
  const { addresses } = useAddresses()
  const { dict: t } = useLocale()

  if (!addresses || addresses.length === 0) {
    return <p>{t.account.noAddresses}</p>
  }

  return (
    <div>
      <ul className="divide-y divide-stone-100 dark:divide-stone-800">
        {addresses.map((address) => (
          <li key={address.id} className="py-8 first:pt-0 last:pb-0">
            <AddressItem address={address} />
          </li>
        ))}
      </ul>
    </div>
  )
}
