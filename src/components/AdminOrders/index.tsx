'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { AdminOrdersClient } from './AdminOrdersClient'

export const AdminOrders: React.FC = async () => {
    const payload = await getPayload({ config: configPromise })

    const ordersResult = await payload.find({
        collection: 'orders',
        depth: 2,
        limit: 200,
        sort: '-createdAt',
    })

    const orders = ordersResult.docs as any[]

    return <AdminOrdersClient initialOrders={orders} />
}
