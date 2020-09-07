import { injectable, inject } from 'inversify'

import { InvitationService, InvitationApplicationService, InvitationViewModel } from './'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { User, UserService } from '../user'
import UnauthorizedError from '../api/errors/unauthorizedError'
import UnknownError from '../api/errors/unknownError'
import ApiServiceSuccessResult from '../api/results/apiServiceSuccessResult'
import InvitationMapper from './mapper'

@injectable()
export default class InvitationApplicationServiceImpl
  implements InvitationApplicationService {
  private invitationService: InvitationService
  private userService: UserService

  constructor(
    @inject(Symbol.for('InvitationService'))
    invitationService: InvitationService,
    @inject(Symbol.for('UserService'))
    userService: UserService
  ) {
    this.invitationService = invitationService
    this.userService = userService
  }

  async requestNewInvitation(req: any): Promise<ApiServiceResult<InvitationViewModel>> {
    try {
      const invitation = await this.invitationService.generate(<User>req.user)

      if (invitation) {
        return new ApiServiceSuccessResult(new InvitationMapper().toViewModel(invitation))
      }

      return { success: false }
    } catch (error) {
      throw new UnknownError(error)
    }
  }
}
