import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'


import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { isAdmin } from '@/access/isAdmin'
import { isDocumentOwner } from '@/access/isDocumentOwner'
import { ProductsCollection } from '@/collections/Products'
import { Page, Product } from '@/payload-types'
import { cashOnDeliveryAdapter } from '@/payments/cashOnDelivery'
import {
  adminNewOrder,
  orderCanceled,
  orderConfirmed,
  orderDelivered,
  orderShipping,
} from '@/utilities/emails'
import { getServerSideURL } from '@/utilities/getURL'
import type { CollectionAfterChangeHook } from 'payload'

const sendOrderEmailNotifications: CollectionAfterChangeHook = async ({
  doc,
  operation,
  previousDoc,
  req,
}) => {
  if (operation === 'create' && doc.status === 'processing') {
    let populatedOrder
    try {
      populatedOrder = await req.payload.findByID({
        collection: 'orders',
        id: doc.id,
        depth: 2,
      })
    } catch (err) {
      req.payload.logger.error({ err }, 'Error fetching populated order for email')
      return doc
    }

    const order = populatedOrder as any
    const customerEmail = populatedOrder.customerEmail || (populatedOrder.customer as any)?.email
    if (customerEmail) {
      try {
        await req.payload.sendEmail({
          to: customerEmail,
          subject: orderConfirmed.subject(order),
          html: orderConfirmed.render(order),
        })
      } catch (err) {
        req.payload.logger.error({ err }, 'Error sending customer confirmation email')
      }
    }

    try {
      await req.payload.sendEmail({
        to: process.env.RESEND_DEFAULT_ADMIN_EMAIL || 'borko.petrevski@gmail.com',
        subject: adminNewOrder.subject(order),
        html: adminNewOrder.render(order),
      })
    } catch (err) {
      req.payload.logger.error({ err }, 'Error sending admin notification email')
    }
  } else if (operation === 'update' && doc.status !== previousDoc?.status) {
    let populatedOrder
    try {
      populatedOrder = await req.payload.findByID({
        collection: 'orders',
        id: doc.id,
        depth: 2,
      })
    } catch (err) {
      req.payload.logger.error({ err }, 'Error fetching populated order for status email')
      return doc
    }

    const order = populatedOrder as any
    const customerEmail = populatedOrder.customerEmail || (populatedOrder.customer as any)?.email
    if (customerEmail) {
      try {
        const template =
          doc.status === 'shipping' ? orderShipping
            : doc.status === 'delivered' ? orderDelivered
              : doc.status === 'canceled' ? orderCanceled
                : null

        if (template) {
          await req.payload.sendEmail({
            to: customerEmail,
            subject: template.subject(order),
            html: template.render(order),
          })
        }
      } catch (err) {
        req.payload.logger.error({ err }, 'Error sending status change email')
      }
    }
  }
  return doc
}

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Tiny Me - by Pepelashka` : 'Tiny Me - by Pepelashka'
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      admin: {
        group: 'Content',
      },
    },
    formOverrides: {
      admin: {
        group: 'Content',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  ecommercePlugin({
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    customers: {
      slug: 'users',
    },
    currencies: {
      defaultCurrency: 'MKD',
      supportedCurrencies: [
        {
          code: 'MKD',
          decimals: 0,
          label: 'Macedonian Denar',
          symbol: 'ден',
        },
      ],
    },
    payments: {
      paymentMethods: [cashOnDeliveryAdapter],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
    },
    carts: {
      cartsCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        labels: {
          singular: 'Кошничка',
          plural: 'Кошнички',
        },
        admin: {
          ...defaultCollection.admin,
          group: 'Продавница',
          description: 'Листа на активни и напуштени кошнички од посетителите.',
        },
      }),
    },
    orders: {
      ordersCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        labels: {
          singular: 'Нарачка',
          plural: 'Нарачки',
        },
        admin: {
          ...defaultCollection.admin,
          group: 'Продавница',
          description: 'Управувајте со сите нарачки направени на сајтот.',
        },
        hooks: {
          ...defaultCollection.hooks,
          afterChange: [
            ...(defaultCollection.hooks?.afterChange || []),
            sendOrderEmailNotifications,
          ],
        },
        fields: defaultCollection.fields.map((field) => {
          if ('name' in field && field.name === 'status') {
            return {
              ...field,
              options: [
                ...(field as any).options,
                {
                  label: 'Shipping',
                  value: 'shipping',
                },
              ],
            }
          }
          return field
        }),
      }),
    },
    transactions: {
      transactionsCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        labels: {
          singular: 'Трансакција',
          plural: 'Трансакции',
        },
        admin: {
          ...defaultCollection.admin,
          group: 'Продавница',
          description: 'Преглед на сите финансиски трансакции и плаќања.',
        },
      }),
    },
  }),
  s3Storage({
    collections: {
      media: {
        prefix: 'tinyme',
      },
    },
    bucket: process.env.S3_BUCKET || '',
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || 'nbg1',
      forcePathStyle: true,
    },
    acl: 'public-read',
  }),
]
