import type { PaymentAdapter } from '@payloadcms/plugin-ecommerce/types'
import type { CollectionSlug } from 'payload'

export const cashOnDeliveryAdapter: PaymentAdapter = {
    name: 'cash-on-delivery',
    label: 'Плаќање при достава',

    group: {
        name: 'cashOnDelivery',
        type: 'group',
        admin: {
            condition: (data) => data?.paymentMethod === 'cash-on-delivery',
        },
        fields: [],
    },

    /**
     * Initiates a cash-on-delivery order by creating a pending transaction record.
     * No external payment provider is invoked.
     */
    initiatePayment: async ({ data, req, transactionsSlug }) => {
        const payload = req.payload
        const { billingAddress, cart, currency, customerEmail, shippingAddress } = data

        if (!cart || !cart.items || cart.items.length === 0) {
            throw new Error('Cart is empty or not provided.')
        }

        const flattenedItems = cart.items.map((item) => {
            const productID = typeof item.product === 'object' ? item.product.id : item.product
            const variantID = item.variant
                ? typeof item.variant === 'object'
                    ? item.variant.id
                    : item.variant
                : undefined

            const { product: _product, variant: _variant, ...rest } = item
            return {
                ...rest,
                product: productID,
                quantity: item.quantity,
                ...(variantID ? { variant: variantID } : {}),
            }
        })

        try {
            const transaction = await payload.create({
                collection: transactionsSlug as CollectionSlug,
                data: {
                    ...(req.user ? { customer: req.user.id } : { customerEmail }),
                    amount: cart.subtotal,
                    billingAddress,
                    cart: cart.id,
                    currency: currency?.toUpperCase(),
                    items: flattenedItems,
                    paymentMethod: 'cash-on-delivery',
                    status: 'pending',
                    shippingAddress,
                } as any,
            })

            return {
                message: 'Нарачката е иницирана успешно.',
                transactionID: transaction.id,
                cartItemsSnapshot: JSON.stringify(flattenedItems),
                shippingAddressSnapshot: JSON.stringify(shippingAddress),
            }
        } catch (error) {
            payload.logger.error(error, 'Error initiating cash-on-delivery order')
            throw new Error(error instanceof Error ? error.message : 'Unknown error initiating order')
        }
    },

    /**
     * Confirms the order by creating an order record and marking the transaction as succeeded.
     */
    confirmOrder: async ({
        cartsSlug = 'carts',
        data,
        ordersSlug = 'orders',
        req,
        transactionsSlug = 'transactions',
    }) => {
        const payload = req.payload
        const { customerEmail, transactionID, cartItemsSnapshot, shippingAddressSnapshot } = data

        if (!transactionID) {
            throw new Error('Transaction ID is required to confirm order.')
        }

        try {
            const transaction = await payload.findByID({
                collection: transactionsSlug as CollectionSlug,
                id: transactionID,
            })

            if (!transaction) {
                throw new Error('Transaction not found.')
            }

            const cartItems = cartItemsSnapshot
                ? JSON.parse(cartItemsSnapshot)
                : (transaction as any).items || []

            const shippingAddress = shippingAddressSnapshot
                ? JSON.parse(shippingAddressSnapshot)
                : (transaction as any).shippingAddress

            const order = await payload.create({
                collection: ordersSlug as CollectionSlug,
                data: {
                    amount: (transaction as any).amount,
                    currency: (transaction as any).currency,
                    ...(req.user
                        ? { customer: req.user.id }
                        : { customerEmail: customerEmail || (transaction as any).customerEmail }),
                    items: cartItems,
                    shippingAddress,
                    status: 'processing',
                    transactions: [transaction.id],
                } as any,
            })

            const cartID = (transaction as any).cart
            if (cartID) {
                await payload.update({
                    id: typeof cartID === 'object' ? cartID.id : cartID,
                    collection: cartsSlug as CollectionSlug,
                    data: { purchasedAt: new Date().toISOString() } as any,
                })
            }

            await payload.update({
                id: transaction.id,
                collection: transactionsSlug as CollectionSlug,
                data: {
                    order: order.id,
                    status: 'succeeded',
                } as any,
            })

            return {
                message: 'Нарачката е потврдена успешно.',
                orderID: order.id,
                transactionID: transaction.id,
            }
        } catch (error) {
            payload.logger.error(error, 'Error confirming cash-on-delivery order')
            throw new Error(error instanceof Error ? error.message : 'Unknown error confirming order')
        }
    },
}
