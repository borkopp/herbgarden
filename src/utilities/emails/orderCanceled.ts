import {
    EMAIL_BORDER_COLOR,
    EMAIL_CONTACT_EMAIL,
    EMAIL_MUTED_COLOR,
    EMAIL_PRIMARY_COLOR,
    EMAIL_SURFACE_COLOR,
    EMAIL_TEXT_COLOR,
    itemsTable,
    shell,
    type Order,
} from './_shared'

export const subject = (order: Order) =>
    `Нарачка #${order.id} — известување | Tiny Me`

export const render = (order: Order): string => {
    const firstName = order.shippingAddress?.firstName || ''
    const greeting = firstName ? `Здраво, ${firstName}!` : 'Здраво!'

    const body = `
    <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:${EMAIL_TEXT_COLOR};">
      ${greeting}
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${EMAIL_MUTED_COLOR};">
      За жал, мораме да ве известиме дека вашата нарачка
      <strong style="color:${EMAIL_TEXT_COLOR};">#${order.id}</strong>
      е откажана. Навистина ни е жал за тоа — знаеме дека тоа не е вест
      на која сте очекувале.
    </p>

    <!-- What now card -->
    <div style="background:${EMAIL_SURFACE_COLOR};border:1px solid ${EMAIL_BORDER_COLOR};
      border-left:4px solid #EF4444;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:${EMAIL_TEXT_COLOR};">
        Што следи?
      </p>
      <ul style="margin:0;padding:0 0 0 18px;font-size:14px;line-height:1.9;color:${EMAIL_MUTED_COLOR};">
        <li>Ако откажувањето е грешка, пишете ни веднаш и ќе ја обновиме нарачката.</li>
        <li>Ако сакате да нарачате повторно, со задоволство ќе ви помогнеме.</li>
        <li>Плаќањето при достава значи дека ниедна сума не е наплатена — нема зошто да се грижите.</li>
      </ul>
    </div>

    <!-- Canceled items -->
    ${itemsTable(order)}

    <!-- Contact -->
    <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:${EMAIL_MUTED_COLOR};">
      За сè што ви е потребно, сме тука на
      <a href="mailto:${EMAIL_CONTACT_EMAIL}"
        style="color:${EMAIL_PRIMARY_COLOR};text-decoration:none;">${EMAIL_CONTACT_EMAIL}</a>.
      Ќе се потрудиме да најдеме решение заедно. 🙏
    </p>`

    return shell()(body)
}
