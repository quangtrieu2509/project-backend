import mjml2html from 'mjml'

import { client, mailer } from '../configs'
import { FULL_LOGO } from './images'

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
            <mj-image src="${FULL_LOGO}" alt="Logo" width="150px" padding-bottom="12px"></mj-image>
            <mj-text align="center" font-size="24px" color="#16a34a" font-weight="bold" padding-bottom="12px">
              Activate Your Account
            </mj-text>
            <mj-divider border-color="#262626" padding-bottom="16px" border-width="2px"></mj-divider>
            <mj-text font-size="16px" color="#262626" padding-bottom="20px">
              Dear ${familyName},
            </mj-text>
            <mj-text font-size="16px" color="#262626" line-height="1.5">
              Thank you for signing up for our service! Please click the following link to activate your account:
            </mj-text>
            <mj-button href="${client.renderUrl}/auth/activate-email/${token}" background-color="#262626" color="#ffffff" font-size="16px" padding-top="16px" padding-bottom="16px">
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
    html
  }

  mailer.sendMail(mailOptions)
}
