import {
  EMAIL_MUTED_COLOR,
  EMAIL_TEXT_COLOR,
  shell,
} from './_shared'

export const subject = (name: string, subject: string) => {
  return `📩 Нова порака од ${name}: ${subject} | Herb Garden`
}

export const render = ({
  name,
  email,
  subject,
  message
}: {
  name: string,
  email: string,
  subject: string,
  message: string
}): string => {
  const body = `
    <p style="margin:0 0 10px;font-size:18px;font-weight:700;color:${EMAIL_TEXT_COLOR};">
      📩 Нова порака преку контакт форма
    </p>
    <div style="background:#F9FAFB;padding:20px;border-radius:12px;margin-bottom:20px;border:1px solid #E5E7EB;">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;color:${EMAIL_TEXT_COLOR};">
        <tr>
          <td style="padding:4px 0;font-weight:600;width:80px;color:${EMAIL_MUTED_COLOR};">Од:</td>
          <td style="padding:4px 0;">${name}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-weight:600;color:${EMAIL_MUTED_COLOR};">Е-маил:</td>
          <td style="padding:4px 0;"><a href="mailto:${email}" style="color:${EMAIL_TEXT_COLOR};text-decoration:none;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-weight:600;color:${EMAIL_MUTED_COLOR};">Предмет:</td>
          <td style="padding:4px 0;">${subject}</td>
        </tr>
      </table>
    </div>
    
    <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:${EMAIL_MUTED_COLOR};text-transform:uppercase;letter-spacing:0.5px;">Порака:</p>
    <div style="background:#FFFFFF;padding:20px;border-radius:12px;border:1px solid #E5E7EB;font-size:15px;line-height:1.7;color:${EMAIL_TEXT_COLOR};white-space:pre-wrap;">${message}</div>
    
    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #E5E7EB;text-align:center;">
       <a href="mailto:${email}?subject=RE: ${subject}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">Одговори на пораката</a>
    </div>
    `

  return shell()(body)
}
