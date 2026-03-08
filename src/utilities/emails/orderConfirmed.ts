import {
    EMAIL_BORDER_COLOR,
    EMAIL_CONTACT_EMAIL,
    EMAIL_MUTED_COLOR,
    EMAIL_PRIMARY_COLOR,
    EMAIL_SURFACE_COLOR,
    EMAIL_TEXT_COLOR,
    addressBlock,
    calcTotals,
    fmt,
    itemsTable,
    shell,
    type Order,
} from './_shared'

export const subject = (order: Order) =>
    `✅ Нарачка потврдена — #${order.id} | Tiny Me`

export const render = (order: Order): string => {
    const firstName = order.shippingAddress?.firstName || ''
    const greeting = firstName ? `Здраво, ${firstName}!` : 'Здраво!'
    const { grandTotal, isFree } = calcTotals(order)

    const body = `
    <!-- Greeting -->
    <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:${EMAIL_TEXT_COLOR};">
      ${greeting} 🎉
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${EMAIL_MUTED_COLOR};">
      Ви благодариме за вашата нарачка кај нас. Таа е успешно примена и веќе ја подготвуваме
      за испорака. Наскоро ќе добиете уште еден имејл кога пратката ќе биде на пат.
    </p>

    <!-- Highlight total -->
    <div style="background:${EMAIL_SURFACE_COLOR};border:1px solid ${EMAIL_BORDER_COLOR};
      border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;
      align-items:center;justify-content:space-between;">
      <div>
        <p style="margin:0;font-size:12px;font-weight:700;color:${EMAIL_MUTED_COLOR};
          text-transform:uppercase;letter-spacing:.6px;">Вкупно за плаќање</p>
        <p style="margin:4px 0 0;font-size:26px;font-weight:800;color:${EMAIL_PRIMARY_COLOR};">
          ${fmt(grandTotal)}
        </p>
        <p style="margin:2px 0 0;font-size:12px;color:${EMAIL_MUTED_COLOR};">
          ${isFree ? '🚚 Бесплатна достава' : '🚚 + 150 ден достава при порачка'}
        </p>
      </div>
    </div>

    <!-- Order items -->
    ${itemsTable(order)}

    <!-- Address -->
    ${addressBlock(order)}

    <!-- Sign off -->
    <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:${EMAIL_MUTED_COLOR};">
      Ако имате прашање или сакате да промените нешто, пишете ни на
      <a href="mailto:${EMAIL_CONTACT_EMAIL}"
        style="color:${EMAIL_PRIMARY_COLOR};text-decoration:none;">${EMAIL_CONTACT_EMAIL}</a>
      — со задоволство помагаме. 💛
    </p>`

    return shell()(body)
}
