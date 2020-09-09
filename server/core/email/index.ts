import { ContainerModule } from 'inversify'

import BaseApplicationServiceInterface from '../applicationService.interface'
import EmailServiceImpl from './service'
import EmailApplicationServiceImpl from './appService'
import Email from './email'

export { default as Email } from './email'

export interface EmailService {
  sendEmail(email: Email): Promise<boolean>
}

export interface EmailApplicationService
  extends BaseApplicationServiceInterface {
  sendInvitationEmail(recipientEmail: string, inviteCode: string): Promise<boolean>
}

export const EmailModule = new ContainerModule((bind) => {
  bind<EmailService>(Symbol.for('EmailService'))
    .to(EmailServiceImpl)
  bind<EmailApplicationService>(Symbol.for('EmailApplicationService'))
    .to(EmailApplicationServiceImpl)
})
