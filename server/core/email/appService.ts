import { injectable, inject } from 'inversify'
import UnknownError from '../api/errors/unknownError'
import { EmailService } from './'

@injectable()
export default class EmailApplicationServiceImpl {
  private emailService: EmailService

  constructor(
    @inject(Symbol.for('EmailService'))
    emailService: EmailService
  ) {
    this.emailService = emailService
  }

  sendInvitationEmail(recipientEmail: string, inviteCode: string): Promise<boolean> {
    try {
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
      const registrationUrl = `${baseUrl}/register?invite=${inviteCode}`

      return this.emailService.sendEmail({
        to: recipientEmail,
        from: 'welcome@artby.city', // TODO -> admin configurable
        subject: 'Invitation to join Art x By x City', // TODO -> admin configurable
        html:
          `
          <p>Hi!</p>
          <p>You've been sent an invitation to join Art x By x City</p>
          <p>Sign up <a href='${registrationUrl}'>here</a> (${registrationUrl})</p>
          ` // TODO -> from email template
      })
    } catch (error) {
      console.error(error)
      throw new UnknownError()
    }
  }
}
