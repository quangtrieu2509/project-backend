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
      <mj-body background-color="#f3f3f3">
        <mj-section>
          <mj-column>
            <mj-image src="cid:logo" alt="Logo" width="100px" padding-bottom="20px"></mj-image>
            <mj-text align="center" font-size="24px" color="#007bff" font-weight="bold" padding-bottom="20px">
              Activate Your Account
            </mj-text>
            <mj-divider border-color="#007bff" padding-bottom="20px"></mj-divider>
            <mj-text font-size="18px" color="#444444" padding-bottom="20px">
              Dear ${familyName},
            </mj-text>
            <mj-text font-size="16px" color="#444444" line-height="1.5">
              Thank you for signing up for our service! Please click the following link to activate your account:
            </mj-text>
            <mj-button 
              href="http://localhost:3000/auth/activate-email/${token}" 
              background-color="#007bff" color="#ffffff" 
              font-size="18px" padding-top="20px" 
              padding-bottom="20px"
            >
              Activate Account
            </mj-button>
            <mj-text font-size="14px" color="#444444" padding-top="20px">
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
        filename: 'logo.png',
        path: path.join(__dirname, '.', 'images', 'logo.png'),
        cid: 'logo'
      }
    ]
  }

  mailer.sendMail(mailOptions)
}
