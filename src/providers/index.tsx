import { AuthProvider } from '@/providers/Auth'
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
import React from 'react'

import { SonnerProvider } from '@/providers/Sonner'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { WishlistProvider } from './Wishlist'

const cashOnDeliveryAdapterClient = {
  name: 'cash-on-delivery',
  label: 'Плаќање при достава',
  initiatePayment: true,
  confirmOrder: true,
}

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <HeaderThemeProvider>
            <SonnerProvider />
            <EcommerceProvider
              enableVariants={true}
              currenciesConfig={{
                defaultCurrency: 'MKD',
                supportedCurrencies: [
                  {
                    code: 'MKD',
                    decimals: 0,
                    label: 'Macedonian Denar',
                    symbol: 'ден',
                  },
                ],
              }}
              api={{
                cartsFetchQuery: {
                  depth: 2,
                  populate: {
                    products: {
                      slug: true,
                      title: true,
                      gallery: true,
                      inventory: true,
                    },
                    variants: {
                      title: true,
                      inventory: true,
                    },
                  },
                },
              }}
              paymentMethods={[cashOnDeliveryAdapterClient]}
            >
              {children}
            </EcommerceProvider>
          </HeaderThemeProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
