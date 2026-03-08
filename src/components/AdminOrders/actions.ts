'use server'

import configPromise from '@payload-config';
import { getPayload } from 'payload';

type OrderStatus = 'processing' | 'shipping' | 'completed' | 'cancelled' | 'refunded'

export async function updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = await getPayload({ config: configPromise })

        await payload.update({
            collection: 'orders',
            id: orderId,
            data: {
                status: newStatus,
            },
        })

        return { success: true }
    } catch (error: any) {
        console.error('Error updating order status:', error)
        return {
            success: false,
            error: error?.message || 'Грешка при ажурирање на нарачката.',
        }
    }
}
