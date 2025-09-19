/* eslint-disable no-console */
import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

export const sendMail = (recipientEmail, customSubject, htmlContent) => {
  var transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: env.SENDGRID_API_KEY
    }
  })

  var mailOptions = {
    from: 'phamlong123np@gmail.com',
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
