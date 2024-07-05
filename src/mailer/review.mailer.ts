import mjml2html from 'mjml'

import { mailer } from '../configs'
import { FULL_LOGO } from './images'

export const sendDeclinedReviewMail = (email: string, familyName: string, itemName: string): void => {
  const declinedTemplate = `
    <mjml>
      <mj-head>
        <mj-title>Review Moderation</mj-title>
        <mj-attributes>
          <mj-all font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
          <mj-text font-size="16px" color="#444444" line-height="1.5"></mj-text>
        </mj-attributes>
      </mj-head>
      <mj-body background-color="#f5f5f5">
        <mj-section>
          <mj-column>
            <mj-image src=${FULL_LOGO} alt="Logo" width="150px" padding-bottom="12px"></mj-image>
            <mj-divider border-color="#262626" padding-bottom="16px" border-width="2px"></mj-divider>
            <mj-text font-size="16px" color="#262626" padding-bottom="20px">
              Dear ${familyName},
            </mj-text>
            <mj-text font-size="16px" color="#262626" line-height="1.5">
              Thank you for taking the time to share your experience on our website. We appreciate your effort in helping us provide valuable information to fellow travelers.
            </mj-text>
            <mj-text font-weight=600 font-size="16px" color="#262626" line-height="1.5">
              However, we regret to inform you that your recent review for <i>${itemName}</i> did not meet our moderation guidelines and has been declined. We encourage you to review our guidelines and submit a revised version of your review.
            </mj-text>
            <mj-text font-size="16px" color="#262626" line-height="1.5">
              If you have any questions, contact us at trippie@gmail.com.
            </mj-text>
            <mj-text font-size="16px" color="#262626" line-height="1.5">
              Thank you for your understanding and continued support.
            </mj-text>
            <mj-text font-size="16px" color="#262626">
              Best regards, Trippie.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>`

  const { html } = mjml2html(declinedTemplate)

  const mailOptions = {
    to: email,
    subject: 'Review Moderation',
    html
  }

  mailer.sendMail(mailOptions)
}

export const sendApprovedReviewMail = (email: string, familyName: string, itemName: string): void => {
  const approvedTemplate = `
    <mjml>
      <mj-head>
        <mj-title>Review Moderation</mj-title>
        <mj-attributes>
          <mj-all font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
          <mj-text font-size="16px" color="#444444" line-height="1.5"></mj-text>
        </mj-attributes>
      </mj-head>
      <mj-body background-color="#f5f5f5">
        <mj-section>
          <mj-column>
            <mj-image src=${FULL_LOGO} alt="Logo" width="150px" padding-bottom="12px"></mj-image>
            <mj-divider border-color="#262626" padding-bottom="16px" border-width="2px"></mj-divider>
            <mj-text font-size="16px" color="#262626" padding-bottom="20px">
              Dear ${familyName},
            </mj-text>
            <mj-text font-size="16px" color="#262626" line-height="1.5">
              Thank you for sharing your experience on our website. We are pleased to inform you that your review for <i>${itemName}</i> has been approved and is now live.
            </mj-text>
            <mj-text font-size="16px" color="#262626" line-height="1.5">
              If you have any questions, contact us at trippie@gmail.com.
            </mj-text>
            <mj-text font-size="16px" color="#262626" line-height="1.5">
              We appreciate your contribution and look forward to your future reviews!
            </mj-text>
            <mj-text font-size="16px" color="#262626">
              Best regards, Trippie.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `
  const { html } = mjml2html(approvedTemplate)

  const mailOptions = {
    to: email,
    subject: 'Review Moderation',
    html
  }

  mailer.sendMail(mailOptions)
}
