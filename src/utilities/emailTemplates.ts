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
} from './emailConfig'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number | null | undefined) => {
  if (amount == null) return ''
  return new Intl.NumberFormat('mk-MK', {
    style: 'currency',
    currency: 'MKD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Returns the item-level price in MKD, preferring variant price. */
const getItemPrice = (item: any): number => {
  const variant = item.variant && typeof item.variant === 'object' ? item.variant : null
  if (variant?.priceInMKD) return variant.priceInMKD
  if (item.product?.priceInMKD) return item.product.priceInMKD
  // Legacy fallback
  if (item.product?.price) return item.product.price
  return 0
}

// ─── Layout Blocks ────────────────────────────────────────────────────────────

const renderHeader = () => {
  if (EMAIL_LOGO_URL) {
    return `
      <tr>
        <td style="text-align: center; padding: 32px 0 24px;">
          <a href="${EMAIL_STORE_URL}" style="text-decoration: none;">
            <img src="${EMAIL_LOGO_URL}" alt="${EMAIL_STORE_NAME}" height="56"
              style="height: 56px; width: auto; display: inline-block;" />
          </a>
        </td>
      </tr>`
  }
  return `
    <tr>
      <td style="text-align: center; padding: 32px 0 24px;">
        <a href="${EMAIL_STORE_URL}" style="text-decoration: none; color: ${EMAIL_PRIMARY_COLOR}; font-size: 30px; font-weight: 800; letter-spacing: -0.5px;">
          ${EMAIL_STORE_NAME}
        </a>
      </td>
    </tr>`
}

const renderFooter = () => `
  <tr>
    <td style="text-align: center; padding: 32px 0 24px; border-top: 1px solid ${EMAIL_BORDER_COLOR}; font-size: 12px; color: ${EMAIL_MUTED_COLOR}; line-height: 1.8;">
      <p style="margin: 0 0 4px;">
        &copy; ${new Date().getFullYear()} ${EMAIL_STORE_NAME}. Сите права задржани.
      </p>
      <p style="margin: 0;">
        Прашања? Пишете ни на
        <a href="mailto:${EMAIL_CONTACT_EMAIL}" style="color: ${EMAIL_PRIMARY_COLOR}; text-decoration: none;">${EMAIL_CONTACT_EMAIL}</a>
      </p>
    </td>
  </tr>`

/** Product image thumbnail cell — returns empty string when no image URL is available. */
const renderProductImage = (item: any): string => {
  // Try gallery first, then meta.image
  const mediaDoc =
    item.product?.gallery?.[0]?.image || item.product?.meta?.image || null

  const filename: string | null =
    mediaDoc && typeof mediaDoc === 'object' ? mediaDoc.filename ?? null : null

  const imageUrl = getMediaUrl(filename)

  if (!imageUrl) {
    // Coloured placeholder square
    return `
      <td style="width: 72px; padding: 8px 16px 8px 0; vertical-align: top;">
        <div style="width: 64px; height: 64px; background-color: ${EMAIL_SURFACE_COLOR};
          border: 1px solid ${EMAIL_BORDER_COLOR}; border-radius: 8px; display: flex;
          align-items: center; justify-content: center;">
        </div>
      </td>`
  }

  return `
    <td style="width: 72px; padding: 8px 16px 8px 0; vertical-align: top;">
      <img src="${imageUrl}" alt="${item.product?.title || 'Product'}"
        width="64" height="64"
        style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px;
          border: 1px solid ${EMAIL_BORDER_COLOR}; display: block;" />
    </td>`
}

// ─── Item rows ────────────────────────────────────────────────────────────────

const renderItemsTable = (order: Order): string => {
  const items = order.items || []
  if (items.length === 0) return ''

  const itemsHtml = items
    .map((item: any) => {
      const productTitle = item.product?.title || 'Производ'
      const quantity = item.quantity || 1
      const price = getItemPrice(item)

      // Variant label (e.g. "S • Сина")
      const variant = item.variant && typeof item.variant === 'object' ? item.variant : null
      const variantLabel = variant?.options
        ?.map((opt: any) => (typeof opt === 'object' ? opt.label : ''))
        .filter(Boolean)
        .join(' • ')

      return `
        <tr>
          ${renderProductImage(item)}
          <td style="padding: 8px 0; vertical-align: top;">
            <p style="margin: 0 0 2px; font-weight: 600; color: ${EMAIL_TEXT_COLOR}; font-size: 14px;">
              ${productTitle}
            </p>
            ${variantLabel ? `<p style="margin: 0 0 4px; font-size: 12px; color: ${EMAIL_MUTED_COLOR};">${variantLabel}</p>` : ''}
            <p style="margin: 0; font-size: 13px; color: ${EMAIL_MUTED_COLOR};">Количина: ${quantity}</p>
          </td>
          <td style="padding: 8px 0; text-align: right; vertical-align: top; font-weight: 600;
            font-size: 14px; color: ${EMAIL_TEXT_COLOR}; white-space: nowrap;">
            ${price ? formatCurrency(price * quantity) : ''}
          </td>
        </tr>
        <tr>
          <td colspan="3" style="padding: 0; border-bottom: 1px solid ${EMAIL_BORDER_COLOR};"></td>
        </tr>`
    })
    .join('')

  // ── Shipping & totals ──
  const subtotal = order.amount ?? 0
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const shippingCost = isFreeShipping ? 0 : SHIPPING_COST
  const grandTotal = subtotal + shippingCost

  const shippingRow = isFreeShipping
    ? `<tr>
        <td colspan="2" style="padding: 8px 0; font-size: 13px; color: ${EMAIL_MUTED_COLOR};">Достава</td>
        <td style="padding: 8px 0; text-align: right; font-size: 13px; color: #10B981; font-weight: 600;">Бесплатна</td>
       </tr>`
    : `<tr>
        <td colspan="2" style="padding: 8px 0; font-size: 13px; color: ${EMAIL_MUTED_COLOR};">Достава</td>
        <td style="padding: 8px 0; text-align: right; font-size: 13px; color: ${EMAIL_TEXT_COLOR}; font-weight: 600;">${formatCurrency(SHIPPING_COST)}</td>
       </tr>`

  return `
    <tr>
      <td style="padding: 24px 0 0;">
        <h3 style="margin: 0 0 16px; font-size: 17px; font-weight: 700; color: ${EMAIL_TEXT_COLOR};">
          Детали за нарачката
          <span style="color: ${EMAIL_MUTED_COLOR}; font-weight: 400; font-size: 14px; margin-left: 6px;">#${order.id || ''}</span>
        </h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          ${itemsHtml}
          <tr><td colspan="3" style="height: 12px;"></td></tr>
          <tr>
            <td colspan="2" style="padding: 8px 0; font-size: 13px; color: ${EMAIL_MUTED_COLOR};">Производи</td>
            <td style="padding: 8px 0; text-align: right; font-size: 13px; color: ${EMAIL_TEXT_COLOR};">${formatCurrency(subtotal)}</td>
          </tr>
          ${shippingRow}
          <tr>
            <td colspan="3" style="border-top: 2px solid ${EMAIL_BORDER_COLOR}; padding-top: 12px;"></td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 4px 0 16px; font-weight: 700; font-size: 15px; color: ${EMAIL_TEXT_COLOR};">
              Вкупно <span style="font-weight: 400; font-size: 11px; color: ${EMAIL_MUTED_COLOR};">(со вкл. ДДВ)</span>
            </td>
            <td style="padding: 4px 0 16px; text-align: right; font-weight: 800; font-size: 17px; color: ${EMAIL_PRIMARY_COLOR};">
              ${formatCurrency(grandTotal)}
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

// ─── Shipping address block ───────────────────────────────────────────────────

const renderShippingAddress = (order: Order): string => {
  const addr = order.shippingAddress
  if (!addr) return ''

  return `
    <tr>
      <td style="padding: 20px 0 0; border-top: 1px solid ${EMAIL_BORDER_COLOR};">
        <h3 style="margin: 0 0 12px; font-size: 17px; font-weight: 700; color: ${EMAIL_TEXT_COLOR};">Адреса за достава</h3>
        <table cellpadding="0" cellspacing="0" style="background: ${EMAIL_SURFACE_COLOR}; border: 1px solid ${EMAIL_BORDER_COLOR};
          border-radius: 10px; width: 100%; padding: 16px;">
          <tr>
            <td style="padding: 0; font-size: 14px; line-height: 1.9; color: ${EMAIL_TEXT_COLOR};">
              <strong>${addr.firstName || ''} ${addr.lastName || ''}</strong><br>
              ${addr.addressLine1 || ''}<br>
              ${addr.postalCode || ''} ${addr.city || ''}<br>
              ${addr.phone ? `<span style="color:${EMAIL_MUTED_COLOR};">Тел: ${addr.phone}</span>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

// ─── Main layout ─────────────────────────────────────────────────────────────

interface EmailTemplateProps {
  order: Order
  title: string
  message: string
  /** If true, render a full order detail block (items + totals + address). */
  showOrderDetails?: boolean
}

const getEmailLayout = ({ order, title, message, showOrderDetails = true }: EmailTemplateProps) => `
<!DOCTYPE html>
<html lang="mk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: ${EMAIL_TEXT_COLOR}; -webkit-font-smoothing: antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F3F4F6; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width: 580px; background: ${EMAIL_BG_COLOR}; border-radius: 16px;
            border: 1px solid ${EMAIL_BORDER_COLOR}; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 0 32px;">${renderHeader()}</td>
          </tr>

          <!-- Hero message -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background: ${EMAIL_SURFACE_COLOR}; border-radius: 12px; padding: 24px; border: 1px solid ${EMAIL_BORDER_COLOR};">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: ${EMAIL_TEXT_COLOR};">${title}</h2>
                    <p style="margin: 0; line-height: 1.7; font-size: 15px; color: ${EMAIL_MUTED_COLOR};">${message}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order details + address -->
          ${showOrderDetails ? `
          <tr>
            <td style="padding: 0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${renderItemsTable(order)}
                ${renderShippingAddress(order)}
              </table>
            </td>
          </tr>` : ''}

          <!-- Footer -->
          <tr>
            <td style="padding: 0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${renderFooter()}
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`

// ─── Exports ──────────────────────────────────────────────────────────────────

export const renderCustomerConfirmationEmail = (order: Order) =>
  getEmailLayout({
    order,
    title: 'Вашата нарачка е потврдена! 🎉',
    message:
      'Ви благодариме за вашата нарачка. Таа е успешно процесирана и наскоро ќе биде испратена на вашата адреса.',
    showOrderDetails: true,
  })

export const renderAdminNotificationEmail = (order: Order) => {
  const firstName = order.shippingAddress?.firstName || ''
  const lastName = order.shippingAddress?.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim()
  const email = order.customerEmail || ''
  const subtotal = order.amount ?? 0
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const grandTotal = subtotal + (isFreeShipping ? 0 : SHIPPING_COST)

  return getEmailLayout({
    order,
    title: `Нова нарачка од ${fullName || email}`,
    message: `${fullName ? `<strong>${fullName}</strong>` : 'Купувач'} (${email}) штотуку нарача и плати при достава. Вкупна вредност: <strong style="color: ${EMAIL_PRIMARY_COLOR};">${new Intl.NumberFormat('mk-MK', { style: 'currency', currency: 'MKD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(grandTotal)}</strong>${isFreeShipping ? ' — бесплатна достава.' : ' + 150 ден достава.'}<br><br>Прегледајте ја нарачката и подгответе ја за испорака.`,
    showOrderDetails: true,
  })
}

export const renderStatusChangeEmail = (order: Order, status: string) => {
  const firstName = order.shippingAddress?.firstName || ''

  // Friendly greeting using the customer's first name if available
  const hey = firstName ? `Здраво, ${firstName}! ` : 'Здраво! '

  let title = 'Ажурирање на нарачката'
  let message = `Статусот на вашата нарачка #${order.id} е ажуриран.`

  switch (status) {
    case 'shipping':
      title = 'Вашата нарачка е испратена! 🚚'
      message =
        `${hey}Убави вести — вашата нарачка е на пат кон вас! ` +
        `Курирот ќе ви ја достави во наредните <strong>1–3 работни дена</strong>. ` +
        `Ако во меѓувреме имате прашање, слободно пишете ни — секогаш сме тука.`
      break

    case 'delivered':
      title = 'Нарачката пристигна! ✅'
      message =
        `${hey}Вашата нарачка е успешно доставена — се надеваме дека ќе ви се допадне! 🎁 ` +
        `Ако имате какви било прашања или коментари за производот, само пишете ни на ` +
        `<a href="mailto:${EMAIL_CONTACT_EMAIL}" style="color: ${EMAIL_PRIMARY_COLOR}; text-decoration: none;">${EMAIL_CONTACT_EMAIL}</a>. ` +
        `Ви благодариме за довербата и очекуваме да ве видиме повторно во <strong>Herb Garden</strong>! 💛`
      break

    case 'canceled':
      title = 'Нарачката е откажана'
      message =
        `${hey}За жал, вашата нарачка #${order.id} е откажана. ` +
        `Знаеме дека тоа не е вест што сакавте да ја добиете, и вистински ни е жал за тоа. ` +
        `Доколку мислите дека дошло до грешка или сакате да направите нова нарачка, ` +
        `слободно нè контактирајте на ` +
        `<a href="mailto:${EMAIL_CONTACT_EMAIL}" style="color: ${EMAIL_PRIMARY_COLOR}; text-decoration: none;">${EMAIL_CONTACT_EMAIL}</a> ` +
        `— со задоволство ќе ви помогнеме.`
      break

    default:
      message =
        `${hey}Само сакавме да ве известиме дека статусот на вашата нарачка #${order.id} е ажуриран. ` +
        `Ако имате прашања, пишете ни на ` +
        `<a href="mailto:${EMAIL_CONTACT_EMAIL}" style="color: ${EMAIL_PRIMARY_COLOR}; text-decoration: none;">${EMAIL_CONTACT_EMAIL}</a>.`
  }

  return getEmailLayout({ order, title, message, showOrderDetails: true })
}
