import { mailerTransporter } from './vars'

export const sendMail = (mailOptions: any, retries: number = 3): void => {
  try {
    let count = retries

    const attemptSendMail = (): void => {
      mailerTransporter.sendMail(mailOptions, (error, info) => {
        if (error != null) {
          if (count !== 0) {
            count--
            console.log(`[mailer] Retry attempt ${count} of ${retries}.`)
            attemptSendMail() // Retry sending the email
          } else {
            console.error('[mailer] Error sending email:', error)
            console.error('[mailer] Max retries reached. Email could not be sent.')
          }
        } else {
          console.log('[mailer] Send mail: ', info.response)
        }
      })
    }

    attemptSendMail()
  } catch (error) {
    console.error('[mailer] Error: ', error)
  }
}
