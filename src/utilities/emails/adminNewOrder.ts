import {
    EMAIL_BORDER_COLOR,
    EMAIL_MUTED_COLOR,
    EMAIL_PRIMARY_COLOR,
    EMAIL_STORE_URL,
    EMAIL_SURFACE_COLOR,
    EMAIL_TEXT_COLOR,
    addressBlock,
    calcTotals,
    fmt,
    itemsTable,
    shell,
    type Order,
} from './_shared'

export const subject = (order: Order) => {
    const name = [order.shippingAddress?.firstName, order.shippingAddress?.lastName]
        .filter(Boolean)
        .join(' ')
    return `🛍 Нова нарачка${name ? ` од ${name}` : ''} — #${order.id} | Tiny Me Админ`
}

export const render = (order: Order): string => {
    const firstName = order.shippingAddress?.firstName || ''
    const lastName = order.shippingAddress?.lastName || ''
    const fullName = [firstName, lastName].filter(Boolean).join(' ')
    const email = order.customerEmail || '—'
    const phone = order.shippingAddress?.phone || '—'
    const city = order.shippingAddress?.city || '—'
    const { subtotal, shipping, grandTotal, isFree } = calcTotals(order)

    const body = `
    <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:${EMAIL_TEXT_COLOR};">
      🛍 Нова нарачка${fullName ? ` — ${fullName}` : ''}
    </p>
    <p style="margin:0 0 20px;font-size:14px;color:${EMAIL_MUTED_COLOR};">
      Нарачка #${order.id} &nbsp;·&nbsp; Плаќање при достава
    </p>

    <!-- Quick stats -->
    <div style="display:flex;gap:12px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:50%;padding-right:6px;">
            <div style="background:${EMAIL_SURFACE_COLOR};border:1px solid ${EMAIL_BORDER_COLOR};
              border-radius:10px;padding:14px 16px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${EMAIL_MUTED_COLOR};
                text-transform:uppercase;letter-spacing:.5px;">Вкупен износ</p>
              <p style="margin:0;font-size:22px;font-weight:800;color:${EMAIL_PRIMARY_COLOR};">
                ${fmt(grandTotal)}
              </p>
              <p style="margin:2px 0 0;font-size:12px;color:${EMAIL_MUTED_COLOR};">
                ${isFree ? 'Бесплатна достава' : `+ ${fmt(shipping)} достава`}
              </p>
            </div>
          </td>
          <td style="width:50%;padding-left:6px;">
            <div style="background:${EMAIL_SURFACE_COLOR};border:1px solid ${EMAIL_BORDER_COLOR};
              border-radius:10px;padding:14px 16px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${EMAIL_MUTED_COLOR};
                text-transform:uppercase;letter-spacing:.5px;">Купувач</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:${EMAIL_TEXT_COLOR};">
                ${fullName || '—'}
              </p>
              <p style="margin:2px 0 0;font-size:12px;color:${EMAIL_MUTED_COLOR};">${email}</p>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Contact details -->
    <div style="background:${EMAIL_SURFACE_COLOR};border:1px solid ${EMAIL_BORDER_COLOR};
      border-radius:10px;padding:14px 16px;margin-bottom:24px;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:${EMAIL_MUTED_COLOR};
        text-transform:uppercase;letter-spacing:.5px;">Контакт и локација</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:${EMAIL_TEXT_COLOR};">
        <tr>
          <td style="padding:3px 0;color:${EMAIL_MUTED_COLOR};width:80px;">Телефон:</td>
          <td style="padding:3px 0;font-weight:600;">${phone}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;color:${EMAIL_MUTED_COLOR};">Имејл:</td>
          <td style="padding:3px 0;font-weight:600;">${email}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;color:${EMAIL_MUTED_COLOR};">Град:</td>
          <td style="padding:3px 0;font-weight:600;">${city}</td>
        </tr>
      </table>
    </div>

    <!-- Order items -->
    ${itemsTable(order)}

    <!-- Address -->
    ${addressBlock(order)}

    <!-- CTA -->
    <div style="margin-top:24px;text-align:center;">
      <a href="${EMAIL_STORE_URL}/admin/collections/orders/${order.id}"
        style="display:inline-block;background:${EMAIL_PRIMARY_COLOR};color:#fff;
          text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;
          border-radius:8px;">
        Прегледај ја нарачката →
      </a>
    </div>`

    return shell()(body)
}
