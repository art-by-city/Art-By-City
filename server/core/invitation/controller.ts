import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import roles from '../middleware/roles'
import { InvitationController, InvitationApplicationService } from './'

@injectable()
export default class InvitationControllerImpl implements InvitationController {
  private router!: Router
  private invitationAppService: InvitationApplicationService

  constructor(
    @inject(Symbol.for('InvitationApplicationService'))
    invitationAppService: InvitationApplicationService
  ) {
    this.invitationAppService = invitationAppService
  }

  getRouter(): Router {
    if (!this.router) {
      this.router = this.buildRouter()
    }

    return this.router
  }

  private buildRouter(): Router {
    const router = Router()

    router.use(passport.authenticate('jwt', { session: false }))

    router.post('/', roles(['admin']), async (req, res, next) => {
      try {
        const result = await this.invitationAppService.requestNewInvitation(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    return router
  }
}
