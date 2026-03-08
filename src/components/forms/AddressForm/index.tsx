'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Address, Config } from '@/payload-types'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { deepMergeSimple } from 'payload/shared'

type AddressFormValues = {
  firstName?: string | null
  lastName?: string | null
  addressLine1?: string | null
  city?: string | null
  postalCode?: string | null
  country?: string | null
  phone?: string | null
}

type Props = {
  addressID?: Config['db']['defaultIDType']
  initialData?: Omit<Address, 'country' | 'id' | 'updatedAt' | 'createdAt'> & { country?: string }
  callbackAction?: (data: Partial<Address>) => void
  /**
   * If true, the form will not submit to the API.
   */
  skipSubmission?: boolean
}

export const AddressForm: React.FC<Props> = ({
  addressID,
  initialData,
  callbackAction,
  skipSubmission,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    defaultValues: {
      ...initialData,
      country: 'MK',
    },
  })

  const { createAddress, updateAddress } = useAddresses()

  const onSubmit = useCallback(
    async (data: AddressFormValues) => {
      const newData = deepMergeSimple(initialData || {}, { ...data, country: 'MK' })

      if (!skipSubmission) {
        if (addressID) {
          await updateAddress(addressID, newData)
        } else {
          await createAddress(newData)
        }
      }

      if (callbackAction) {
        callbackAction(newData)
      }
    },
    [initialData, skipSubmission, callbackAction, addressID, updateAddress, createAddress],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <FormItem>
            <Label htmlFor="firstName">Име*</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              {...register('firstName', { required: 'Името е задолжително.' })}
            />
            {errors.firstName && <FormError message={errors.firstName.message} />}
          </FormItem>

          <FormItem>
            <Label htmlFor="lastName">Презиме*</Label>
            <Input
              autoComplete="family-name"
              id="lastName"
              {...register('lastName', { required: 'Презимето е задолжително.' })}
            />
            {errors.lastName && <FormError message={errors.lastName.message} />}
          </FormItem>
        </div>

        <FormItem>
          <Label htmlFor="phone">Телефон</Label>
          <Input type="tel" id="phone" autoComplete="mobile tel" {...register('phone')} />
          {errors.phone && <FormError message={errors.phone.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="addressLine1">Адреса*</Label>
          <Input
            id="addressLine1"
            autoComplete="address-line1"
            {...register('addressLine1', { required: 'Адресата е задолжителна.' })}
          />
          {errors.addressLine1 && <FormError message={errors.addressLine1.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="city">Град*</Label>
          <Input
            id="city"
            autoComplete="address-level2"
            {...register('city', { required: 'Градот е задолжителен.' })}
          />
          {errors.city && <FormError message={errors.city.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="postalCode">Поштенски број*</Label>
          <Input
            id="postalCode"
            {...register('postalCode', { required: 'Поштенскиот број е задолжителен.' })}
          />
          {errors.postalCode && <FormError message={errors.postalCode.message} />}
        </FormItem>

        <FormItem>
          <Label>Земја</Label>
          <Input value="Македонија" disabled className="text-stone-500 dark:text-stone-400 cursor-not-allowed" />
          <input type="hidden" {...register('country')} value="MK" />
        </FormItem>
      </div>

      <Button type="submit">Зачувај</Button>
    </form>
  )
}
