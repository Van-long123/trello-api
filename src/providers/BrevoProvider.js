const SibApiV3Sdk = require('@getbrevo/brevo') // thư viện nó bắt buột require
import { env } from '~/config/environment'

/** Cấu hình với nodejs
* https://github.com/getbrevo/brevo-node
*/
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
let apiKey = apiInstance.authentications ['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, customHtmlContent) => {
  // Khởi tạo 1 cái sendSmtpEmail
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
  // Tài khoản gửi mail: lưu ý địa chỉ admin email phải là cái email mà các bạn tạo tài khoản trên Brevo
  sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }
  //Những tài khoản nhận mail
  // 'to' phải là một Array để sau chúng ta có thể tùy biến gửi 1 email tới nhiều user tùy tính năng dự án
  sendSmtpEmail.to = [{ email: recipientEmail }]

  //Tiêu đề của email
  sendSmtpEmail.subject = customSubject

  // Nội dung email dạng html
  sendSmtpEmail.htmlContent = customHtmlContent

  // Gọi hành động gửi mail
  // thằng sendTransacEmail của thư viện nó sẽ return một Promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}
