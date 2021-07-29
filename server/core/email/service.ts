import { injectable } from 'inversify'
import nodemailer from 'nodemailer'

import { Email } from './'
import EmailSendError from './sendError'

@injectable()
export default class EmailServiceImpl {
  async sendEmail(email: Email): Promise<boolean> {
    const isProduction = process.env.NODE_ENV === 'production'
      || process.env.NODE_ENV === 'staging'

    const transporter = !isProduction
      ? nodemailer.createTransport({
          jsonTransport: true
        })
      : nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })

    try {
      const result = await transporter.sendMail(email)
      if (result.messageId) {
        console.log(
          isProduction
            ? `Email sent: ${result.messageId}`
            : result
        )
        return true
      }

      throw new EmailSendError()
    } catch (error) {
      console.error('EmailService Error', error)
      throw new EmailSendError()
    }
  }
}

