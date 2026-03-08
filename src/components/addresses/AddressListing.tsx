'use client'

import { AddressItem } from '@/components/addresses/AddressItem'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import React from 'react'

export const AddressListing: React.FC = () => {
  const { addresses } = useAddresses()

  if (!addresses || addresses.length === 0) {
    return <p>Не се пронајдени адреси.</p>
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
