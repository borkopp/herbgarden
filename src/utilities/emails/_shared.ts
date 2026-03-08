/**
 * Shared building blocks used by all individual email templates.
 * Do not import from here directly in application code — use the template
 * files or the re-exporting index instead.
 */

import type { Order } from '@/payload-types'
import {
    EMAIL_BG_COLOR,
    EMAIL_BORDER_COLOR,
    EMAIL_CONTACT_EMAIL,
    EMAIL_LOGO_URL,
    EMAIL_MUTED_COLOR,
    EMAIL_PRIMARY_COLOR,
    EMAIL_STORE_NAME,
    EMAIL_STORE_URL,
    EMAIL_SURFACE_COLOR,
    EMAIL_TEXT_COLOR,
    FREE_SHIPPING_THRESHOLD,
    SHIPPING_COST,
    getMediaUrl,
} from '../emailConfig'

// re-export so template files can import from one place
export {
    EMAIL_BG_COLOR,
    EMAIL_BORDER_COLOR,
    EMAIL_CONTACT_EMAIL,
    EMAIL_LOGO_URL,
    EMAIL_MUTED_COLOR,
    EMAIL_PRIMARY_COLOR,
    EMAIL_STORE_NAME,
    EMAIL_STORE_URL,
    EMAIL_SURFACE_COLOR,
    EMAIL_TEXT_COLOR,
    FREE_SHIPPING_THRESHOLD,
    SHIPPING_COST
}
export type { Order }

// ─── Formatters ───────────────────────────────────────────────────────────────

export const fmt = (amount: number | null | undefined): string => {
    if (amount == null) return ''
    return new Intl.NumberFormat('mk-MK', {
        style: 'currency',
        currency: 'MKD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export const getItemPrice = (item: any): number => {
    const variant = item.variant && typeof item.variant === 'object' ? item.variant : null
    if (variant?.priceInMKD) return variant.priceInMKD
    if (item.product?.priceInMKD) return item.product.priceInMKD
    if (item.product?.price) return item.product.price
    return 0
}

export const calcTotals = (order: Order) => {
    const subtotal = order.amount ?? 0
    const isFree = subtotal >= FREE_SHIPPING_THRESHOLD
    const shipping = isFree ? 0 : SHIPPING_COST
    return { subtotal, shipping, grandTotal: subtotal + shipping, isFree }
}

// ─── Blocks ───────────────────────────────────────────────────────────────────

export const header = () => {
    if (EMAIL_LOGO_URL) {
        return `<tr><td style="text-align:center;padding:32px 0 20px;">
      <a href="${EMAIL_STORE_URL}" style="text-decoration:none;">
        <img src="${EMAIL_LOGO_URL}" alt="${EMAIL_STORE_NAME}" height="52"
          style="height:52px;width:auto;display:inline-block;" />
      </a></td></tr>`
    }
    return `<tr><td style="text-align:center;padding:32px 0 20px;">
    <a href="${EMAIL_STORE_URL}"
      style="text-decoration:none;color:${EMAIL_PRIMARY_COLOR};font-size:28px;font-weight:800;letter-spacing:-0.5px;">
      ${EMAIL_STORE_NAME}
    </a></td></tr>`
}

export const footer = () =>
    `<tr><td style="text-align:center;padding:28px 0;border-top:1px solid ${EMAIL_BORDER_COLOR};
    font-size:12px;color:${EMAIL_MUTED_COLOR};line-height:1.9;">
    <p style="margin:0 0 4px;">&copy; ${new Date().getFullYear()} ${EMAIL_STORE_NAME}. Сите права задржани.</p>
    <p style="margin:0;">Прашања?&nbsp;
      <a href="mailto:${EMAIL_CONTACT_EMAIL}"
        style="color:${EMAIL_PRIMARY_COLOR};text-decoration:none;">${EMAIL_CONTACT_EMAIL}</a>
    </p>
  </td></tr>`

const productImage = (item: any) => {
    const mediaDoc = item.product?.gallery?.[0]?.image || item.product?.meta?.image || null
    const filename: string | null =
        mediaDoc && typeof mediaDoc === 'object' ? (mediaDoc.filename ?? null) : null
    const url = getMediaUrl(filename)
    const placeholder = `<td style="width:72px;padding:8px 12px 8px 0;vertical-align:top;">
    <div style="width:60px;height:60px;background:${EMAIL_SURFACE_COLOR};
      border:1px solid ${EMAIL_BORDER_COLOR};border-radius:8px;"></div></td>`
    if (!url) return placeholder
    return `<td style="width:72px;padding:8px 12px 8px 0;vertical-align:top;">
    <img src="${url}" alt="${item.product?.title || ''}" width="60" height="60"
      style="width:60px;height:60px;object-fit:cover;border-radius:8px;
        border:1px solid ${EMAIL_BORDER_COLOR};display:block;" /></td>`
}

export const itemsTable = (order: Order) => {
    const items = order.items || []
    if (!items.length) return ''

    const rows = items
        .map((item: any) => {
            const title = item.product?.title || 'Производ'
            const qty = item.quantity || 1
            const price = getItemPrice(item)
            const variant = item.variant && typeof item.variant === 'object' ? item.variant : null
            const variantLabel = variant?.options
                ?.map((o: any) => (typeof o === 'object' ? o.label : ''))
                .filter(Boolean)
                .join(' • ')

            return `<tr>
        ${productImage(item)}
        <td style="padding:8px 0;vertical-align:top;">
          <p style="margin:0 0 2px;font-weight:600;font-size:14px;color:${EMAIL_TEXT_COLOR};">${title}</p>
          ${variantLabel ? `<p style="margin:0 0 3px;font-size:12px;color:${EMAIL_MUTED_COLOR};">${variantLabel}</p>` : ''}
          <p style="margin:0;font-size:12px;color:${EMAIL_MUTED_COLOR};">бр.: ${qty}</p>
        </td>
        <td style="padding:8px 0;text-align:right;vertical-align:top;font-weight:600;
          font-size:14px;color:${EMAIL_TEXT_COLOR};white-space:nowrap;">
          ${price ? fmt(price * qty) : ''}
        </td>
      </tr>
      <tr><td colspan="3" style="border-bottom:1px solid ${EMAIL_BORDER_COLOR};padding:0;"></td></tr>`
        })
        .join('')

    const { subtotal, shipping, grandTotal, isFree } = calcTotals(order)

    return `
  <h3 style="margin:0 0 14px;font-size:16px;font-weight:700;color:${EMAIL_TEXT_COLOR};">
    Детали за нарачката
    <span style="font-weight:400;font-size:13px;color:${EMAIL_MUTED_COLOR};margin-left:4px;">#${order.id}</span>
  </h3>
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    ${rows}
    <tr><td colspan="3" style="height:10px;"></td></tr>
    <tr>
      <td colspan="2" style="padding:6px 0;font-size:13px;color:${EMAIL_MUTED_COLOR};">Производи</td>
      <td style="padding:6px 0;text-align:right;font-size:13px;">${fmt(subtotal)}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding:6px 0;font-size:13px;color:${EMAIL_MUTED_COLOR};">Достава</td>
      <td style="padding:6px 0;text-align:right;font-size:13px;
        ${isFree ? 'color:#10B981;font-weight:600;' : ''}">
        ${isFree ? 'Бесплатна' : fmt(shipping)}
      </td>
    </tr>
    <tr><td colspan="3" style="border-top:2px solid ${EMAIL_BORDER_COLOR};padding-top:10px;"></td></tr>
    <tr>
      <td colspan="2" style="padding:4px 0 12px;font-weight:700;font-size:15px;color:${EMAIL_TEXT_COLOR};">
        Вкупно&nbsp;<span style="font-weight:400;font-size:11px;color:${EMAIL_MUTED_COLOR};">(со ДДВ)</span>
      </td>
      <td style="padding:4px 0 12px;text-align:right;font-weight:800;font-size:17px;color:${EMAIL_PRIMARY_COLOR};">
        ${fmt(grandTotal)}
      </td>
    </tr>
  </table>`
}

export const addressBlock = (order: Order) => {
    const a = order.shippingAddress
    if (!a) return ''
    return `
  <div style="margin-top:20px;padding-top:20px;border-top:1px solid ${EMAIL_BORDER_COLOR};">
    <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:${EMAIL_MUTED_COLOR};
      text-transform:uppercase;letter-spacing:.6px;">Адреса за достава</p>
    <div style="background:${EMAIL_SURFACE_COLOR};border:1px solid ${EMAIL_BORDER_COLOR};
      border-radius:10px;padding:14px 16px;font-size:14px;line-height:1.9;color:${EMAIL_TEXT_COLOR};">
      <strong>${a.firstName || ''} ${a.lastName || ''}</strong><br>
      ${a.addressLine1 || ''}<br>
      ${a.postalCode || ''} ${a.city || ''}
      ${a.phone ? `<br><span style="color:${EMAIL_MUTED_COLOR};font-size:13px;">тел: ${a.phone}</span>` : ''}
    </div>
  </div>`
}

/**
 * Outer email shell. `body` is injected into the white card between header and footer.
 */
export const shell = (lang: string = 'mk') =>
    (body: string) =>
        `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#F3F4F6;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  color:${EMAIL_TEXT_COLOR};-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0"
        style="max-width:580px;background:${EMAIL_BG_COLOR};border-radius:16px;
          border:1px solid ${EMAIL_BORDER_COLOR};overflow:hidden;">
        <tr><td style="padding:0 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${header()}
            <tr><td style="padding-bottom:28px;">
              ${body}
            </td></tr>
            ${footer()}
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
