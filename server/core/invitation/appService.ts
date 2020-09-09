import { injectable, inject } from 'inversify'

import { InvitationService, InvitationApplicationService, InvitationViewModel } from './'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { User, UserService } from '../user'
import UnknownError from '../api/errors/unknownError'
import ApiServiceSuccessResult from '../api/results/apiServiceSuccessResult'
import InvitationMapper from './mapper'
import { EventService } from '../events'
import { UserEvents } from '../events/user'
import InvalidEmailError from '../api/errors/invalidEmailError'
import InvitationNotFoundError from './errors/invitationNotFoundError'
import InvitationAlreadySentError from './errors/InvitationAlreadySentError'
import InvitationEmailSendError from './errors/InvitationEmailSendError'
import InvitationAlreadyUsedError from './errors/InvitationAlreadyUsedError'
import { EmailApplicationService } from '../email'

@injectable()
export default class InvitationApplicationServiceImpl
  implements InvitationApplicationService {
  private invitationService: InvitationService
  private userService: UserService
  private eventService: EventService
  private emailAppService: EmailApplicationService

  constructor(
    @inject(Symbol.for('InvitationService'))
    invitationService: InvitationService,
    @inject(Symbol.for('UserService'))
    userService: UserService,
    @inject(Symbol.for('EventService'))
    eventService: EventService,
    @inject(Symbol.for('EmailApplicationService'))
    emailAppService: EmailApplicationService
  ) {
    this.invitationService = invitationService
    this.userService = userService
    this.eventService = eventService
    this.emailAppService = emailAppService
  }

  async requestNewInvitation(req: any): Promise<ApiServiceResult<InvitationViewModel>> {
    try {
      const invitation = await this.invitationService.generate(<User>req.user)

      if (invitation) {
        const createdByUser = await this.userService.getById(invitation.createdByUser)
        const usedByUser = invitation.usedByUser
          ? await this.userService.getById(invitation.usedByUser)
          : null

        return new ApiServiceSuccessResult(
          new InvitationMapper().toViewModel(
            invitation,
            createdByUser || undefined,
            usedByUser || undefined
          )
        )
      }

      throw new Error('error creating new invitation')
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async fetchInvitations(): Promise<ApiServiceResult<InvitationViewModel[]>> {
    try {
      const invitations = await this.invitationService.list()

      const mappedInvitations = await Promise.all(
        invitations.map(async (invitation) => {
          const createdByUser = await this.userService.getById(invitation.createdByUser)
          const usedByUser = invitation.usedByUser
            ? await this.userService.getById(invitation.usedByUser)
            : null

          return new InvitationMapper().toViewModel(
            invitation,
            createdByUser || undefined,
            usedByUser || undefined
          )
        })
      )

      return new ApiServiceSuccessResult(mappedInvitations)
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async sendInvitationEmail(req: any): Promise<ApiServiceResult<InvitationViewModel>> {
    const recipientEmail = req.body?.email || ''

    if (!recipientEmail) {
      throw new InvalidEmailError()
    }

    const invitation = await this.invitationService.get(req.params.id)

    if (!invitation) {
      throw new InvitationNotFoundError()
    }

    if (invitation.used) {
      throw new InvitationAlreadyUsedError()
    }

    if (invitation.sent && invitation.sentToEmail !== recipientEmail) {
      throw new InvitationAlreadySentError()
    }

    // TODO -> send email
    const sendEmailResult = await this.emailAppService.sendInvitationEmail(
      recipientEmail,
      invitation.id
    )

    if (!sendEmailResult) {
      throw new InvitationEmailSendError()
    }

    invitation.sent = true
    invitation.sentToEmail = recipientEmail
    invitation.sentOn = new Date() // TODO -> get this from email send result?

    const savedInvitation = await this.invitationService.update(invitation)
    const createdByUser = await this.userService.getById(invitation.createdByUser)

    if (savedInvitation) {
      return new ApiServiceSuccessResult(new InvitationMapper().toViewModel(savedInvitation, createdByUser || undefined))
    }

    return { success: false }
  }

  registerEvents() {
    this.eventService.on(UserEvents.Account.Registered, this.onUserAccountRegistered.bind(this))
  }

  async onUserAccountRegistered(userId: string) {
    try {
      const user = await this.userService.getById(userId)

      if (user && user.invitation) {
        const invitation = await this.invitationService.get(user.invitation)

        if (invitation) {
          invitation.used = true
          invitation.usedOn = user.created
          invitation.usedByUser = user.id

          await this.invitationService.update(invitation)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}
