import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { publicAccess } from '@/access/publicAccess'
import { checkRole } from '@/access/utilities'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user),
    create: publicAccess,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  labels: {
    singular: 'Корисник',
    plural: 'Корисници',
  },
  admin: {
    group: 'Администрација',
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
    description: 'Управувајте со сите регистрирани корисници (администратори и купувачи).',
  },
  auth: {
    tokenExpiration: 1209600,
    forgotPassword: {
      generateEmailHTML: (args?: { req?: any; token?: string; user?: any }) => {
        const token = args?.token
        const user = args?.user

        console.log('--- generateEmailHTML CALLED ---')
        console.log('Token:', token)
        console.log('User email:', user?.email)

        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const resetPasswordURL = `${serverURL}/reset-password?token=${token}`

        return `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1c1917; margin-bottom: 24px;">Ресетирање на лозинка</h1>
            <p style="color: #444; line-height: 1.5;">Здраво, ${user?.name || 'кориснику'},</p>
            <p style="color: #444; line-height: 1.5;">Добивме барање за ресетирање на вашата лозинка за вашата сметка на <strong>Tiny Me</strong>. Кликнете на копчето подолу за да поставите нова лозинка:</p>
            <a href="${resetPasswordURL}" style="display: inline-block; background-color: #d39d1f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 99px; font-weight: bold; margin-top: 24px;">Ресетирај лозинка</a>
            <p style="color: #888; font-size: 14px; margin-top: 32px;">Доколку не сте побарале ресетирање на лозинката, можете слободно да ја игнорирате оваа е-пошта.</p>
            <div style="border-top: 1px solid #eee; margin-top: 40px; padding-top: 20px; font-size: 12px; color: #aaa;">
              © ${new Date().getFullYear()} Tiny Me. Сите права се задржани.
            </div>
          </div>
        `
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['customer'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
    },
    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'cart',
      type: 'join',
      collection: 'carts',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'addresses',
      type: 'join',
      collection: 'addresses',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id'],
      },
    },
    {
      name: 'wishlist',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
  ],
}
