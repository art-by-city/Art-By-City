import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import { ChangelogApplicationService, ChangelogController } from './'
import { User } from '../user'

@injectable()
export default class ChangelogControllerImpl implements ChangelogController {
  private router!: Router
  private changelogAppService: ChangelogApplicationService

  constructor(
    @inject(Symbol.for('ChangelogApplicationService'))
    changelogAppService: ChangelogApplicationService
  ) {
    this.changelogAppService = changelogAppService
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

    router.get('/', async (req, res, next) => {
      try {
        const userId = (<User>req.user)?.id || ''
        const result = await this.changelogAppService.getChangelogForUser(
          userId
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    return router
  }
}
