import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import roles from '../middleware/roles'
import ArtworkApplicationService from '../artwork/appService.interface'
import UserControllerInterface from './controller.interface'
import User from './user'

@injectable()
export default class UserController implements UserControllerInterface {
  private router!: Router

  private artworkAppService: ArtworkApplicationService

  constructor(
    @inject(Symbol.for('ArtworkApplicationService'))
    artworkAppService: ArtworkApplicationService
  ) {
    this.artworkAppService = artworkAppService
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

    router.get('/artwork', roles(['artist']), async (req, res) => {
      const result = await this.artworkAppService.listForUser(<User>req.user)

      return res.send(result)
    })

    return router
  }
}