/* eslint-disable no-console */
import sgMail from '@sendgrid/mail'
import { env } from '~/config/environment'

// Set API key
sgMail.setApiKey(env.SENDGRID_API_KEY)

export const sendMail = async (recipientEmail, customSubject, htmlContent) => {
  const msg = {
    to: recipientEmail,
    from: 'phamlong123np@gmail.com', // phải là email đã verify trong SendGrid
    subject: customSubject,
    html: htmlContent
  }

  try {
    await sgMail.send(msg)
    console.log('✅ Email sent to: ' + recipientEmail)
  } catch (error) {
    console.error('❌ Error sending email:', error)
    if (error.response) {
      console.error(error.response.body) // in ra chi tiết lỗi từ SendGrid
    }
  }
}
