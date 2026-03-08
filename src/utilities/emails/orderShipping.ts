import {
  EMAIL_BORDER_COLOR,
  EMAIL_CONTACT_EMAIL,
  EMAIL_MUTED_COLOR,
  EMAIL_PRIMARY_COLOR,
  EMAIL_SURFACE_COLOR,
  EMAIL_TEXT_COLOR,
  addressBlock,
  itemsTable,
  shell,
  type Order,
} from './_shared'

export const subject = (order: Order) =>
  `🚚 Вашата пратка е на пат — #${order.id} | Herb Garden`

export const render = (order: Order): string => {
  const firstName = order.shippingAddress?.firstName || ''
  const greeting = firstName ? `Здраво, ${firstName}!` : 'Здраво!'

  const body = `
    <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:${EMAIL_TEXT_COLOR};">
      ${greeting} 🚚
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${EMAIL_MUTED_COLOR};">
      Убави вести — вашата нарачка е испратена и веќе е на пат кон вас!
      Курирот ќе ви ја достави во рок од <strong style="color:${EMAIL_TEXT_COLOR};">1–3 работни дена</strong>.
    </p>

    <!-- Delivery info card -->
    <div style="background:${EMAIL_SURFACE_COLOR};border:1px solid ${EMAIL_BORDER_COLOR};
      border-left:4px solid ${EMAIL_PRIMARY_COLOR};border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:${EMAIL_MUTED_COLOR};
        text-transform:uppercase;letter-spacing:.6px;">Очекувана достава</p>
      <p style="margin:0;font-size:20px;font-weight:800;color:${EMAIL_TEXT_COLOR};">
        1–3 работни дена
      </p>
      <p style="margin:6px 0 0;font-size:13px;color:${EMAIL_MUTED_COLOR};">
        Ќе добиете пратката на адресата подолу. Бидете достапни на телефонот за курирот.
      </p>
    </div>

    <!-- Address -->
    ${addressBlock(order)}

    <!-- Items reminder -->
    <div style="margin-top:24px;">
      ${itemsTable(order)}
    </div>

    <!-- Tips -->
    <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:${EMAIL_MUTED_COLOR};">
      Ако имате прашање за доставата или статусот на пратката, слободно јавете ни се на
      <a href="mailto:${EMAIL_CONTACT_EMAIL}"
        style="color:${EMAIL_PRIMARY_COLOR};text-decoration:none;">${EMAIL_CONTACT_EMAIL}</a>.
      Со нетрпение очекуваме да ја добиете вашата нарачка! 📦
    </p>`

  return shell()(body)
}
