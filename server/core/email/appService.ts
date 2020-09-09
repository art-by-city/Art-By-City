import { injectable, inject } from 'inversify'
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
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    return this.emailService.sendEmail({
      to: recipientEmail,
      from: 'welcome@artby.city', // TODO -> admin configurable
      subject: 'Invitation to join Art x By x City', // TODO -> admin configurable
      text:
        `
        <p>Hi!  You've been sent an invitation to join Art x By x City'</p>
        <p>Sign up here: <a href='${baseUrl}/register?invite=${inviteCode}'></a></p>
        ` // TODO -> from email template
    })
  }
}
