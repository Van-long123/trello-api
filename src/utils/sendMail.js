/* eslint-disable no-console */
import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

export const sendMail = (recipientEmail, customSubject, htmlContent) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASSWORD
    }
  })

  var mailOptions = {
    from: env.EMAIL_USER,
    to:recipientEmail,
    subject: customSubject,
    html: htmlContent
  }

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
