import mjml2html from 'mjml'
import path from 'path'

import { mailer } from '../configs'

export const sendActiveMail = (email: string, familyName: string, token: string): void => {
  const mjmlTemplate = `
    <mjml>
      <mj-head>
        <mj-title>Activate Your Account</mj-title>
        <mj-attributes>
          <mj-all font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
          <mj-text font-size="16px" color="#444444" line-height="1.5"></mj-text>
        </mj-attributes>
      </mj-head>
      <mj-body background-color="#f5f5f5">
        <mj-section>
          <mj-column>
            <mj-image src="cid:trippie-full-logo" alt="Logo" width="100px" padding-bottom="16px"></mj-image>
            <mj-text align="center" font-size="24px" color="#16a34a" font-weight="bold" padding-bottom="16px">
              Activate Your Account
            </mj-text>
            <mj-divider border-color="#262626" padding-bottom="16px" border-width="2px"></mj-divider>
            <mj-text font-size="16px" color="#262626" padding-bottom="20px">
              Dear ${familyName},
            </mj-text>
            <mj-text font-size="16px" color="#262626" line-height="1.5">
              Thank you for signing up for our service! Please click the following link to activate your account:
            </mj-text>
            <mj-button href="https://project-backend-85y2.onrender.com/auth/activate-email/${token}" background-color="#262626" color="#ffffff" font-size="16px" padding-top="16px" padding-bottom="16px">
              Activate Account
            </mj-button>
            <mj-text font-size="14px" color="#737373" padding-top="16px">
              If you did not sign up for our service, please disregard this email.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>`
  const { html } = mjml2html(mjmlTemplate)

  const mailOptions = {
    to: email,
    subject: 'Activate Account',
    html,
    attachments: [
      {
        filename: 'trippie-full-logo.svg',
        path: path.join(__dirname, '.', 'images', 'trippie-full-logo.svg'),
        cid: 'trippie-full-logo'
      }
    ]
  }

  mailer.sendMail(mailOptions)
}
