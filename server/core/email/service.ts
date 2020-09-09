import { injectable, inject } from 'inversify'
import nodemailer from 'nodemailer'

import { Email } from './'
import InvitationEmailSendError from '../invitation/errors/InvitationEmailSendError'

@injectable()
export default class EmailServiceImpl {
  async sendEmail(email: Email): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      jsonTransport: true
    })

    try {
      const result = await transporter.sendMail(email)

      // TODO -> check environment from an environmentService or helper
      if (process.env.NODE_ENV === 'development' && result.messageId) { // TODO -> use this for DEV
        console.log(result.message)
        return true
      }

      //if ((result.accepted?.length || 0) > 0) { // TODO -> use this for STAGING/PROD
      // }

      throw new InvitationEmailSendError()
    } catch (error) {
      throw new InvitationEmailSendError()
    }
  }
}

