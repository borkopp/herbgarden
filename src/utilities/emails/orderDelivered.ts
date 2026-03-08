import {
    EMAIL_BORDER_COLOR,
    EMAIL_CONTACT_EMAIL,
    EMAIL_MUTED_COLOR,
    EMAIL_PRIMARY_COLOR,
    EMAIL_STORE_NAME,
    EMAIL_STORE_URL,
    EMAIL_SURFACE_COLOR,
    EMAIL_TEXT_COLOR,
    itemsTable,
    shell,
    type Order,
} from './_shared'

export const subject = (order: Order) =>
    `💛 Благодариме за довербата — нарачка #${order.id} | Tiny Me`

export const render = (order: Order): string => {
    const firstName = order.shippingAddress?.firstName || ''
    const greeting = firstName ? `Здраво, ${firstName}!` : 'Здраво!'

    const body = `
    <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:${EMAIL_TEXT_COLOR};">
      ${greeting} 💛
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${EMAIL_MUTED_COLOR};">
      Вашата нарачка е успешно доставена — се надеваме дека ќе ви се допадне!
      За нас е вистинска среќа кога нашите производи стигнуваат до вас. 🎁
    </p>

    <!-- Thank you card -->
    <div style="background:${EMAIL_SURFACE_COLOR};border:1px solid ${EMAIL_BORDER_COLOR};
      border-radius:12px;padding:20px 24px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 8px;font-size:32px;">✨</p>
      <p style="margin:0 0 8px;font-size:17px;font-weight:700;color:${EMAIL_TEXT_COLOR};">
        Ви благодариме за довербата!
      </p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:${EMAIL_MUTED_COLOR};">
        Вашата поддршка ни значи многу и не мотивира секој ден да работиме
        уште подобро за вас.
      </p>
    </div>

    <!-- Order recap -->
    ${itemsTable(order)}

    <!-- Feedback & re-order -->
    <div style="margin-top:24px;padding:16px 20px;border-radius:10px;
      border:1px dashed ${EMAIL_BORDER_COLOR};">
      <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:${EMAIL_TEXT_COLOR};">
        Ви се допадна производот?
      </p>
      <p style="margin:0;font-size:13px;line-height:1.7;color:${EMAIL_MUTED_COLOR};">
        Пишете ни на
        <a href="mailto:${EMAIL_CONTACT_EMAIL}"
          style="color:${EMAIL_PRIMARY_COLOR};text-decoration:none;">${EMAIL_CONTACT_EMAIL}</a>
        — секој збор за нас е важен. А ако сакате повторно да нарачате, посетете не на
        <a href="${EMAIL_STORE_URL}"
          style="color:${EMAIL_PRIMARY_COLOR};text-decoration:none;">${EMAIL_STORE_NAME}</a>.
      </p>
    </div>`

    return shell()(body)
}
