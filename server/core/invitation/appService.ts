import { injectable, inject } from 'inversify'

import { InvitationService, InvitationApplicationService } from './'

@injectable()
export default class InvitationApplicationServiceImpl
  implements InvitationApplicationService {
  private invitationService: InvitationService

  constructor(
    @inject(Symbol.for('InvitationService'))
    invitationService: InvitationService
  ) {
    this.invitationService = invitationService
  }
}
