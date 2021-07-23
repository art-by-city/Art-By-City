import { injectable } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import { WalletsController } from './'

@injectable()
export default class WalletsControllerImpl implements WalletsController {
  private router!: Router

  getRouter(): Router {
    if (!this.router) {
      this.router = this.buildRouter()
    }

    return this.router
  }

  private buildRouter(): Router {
    const router = Router()
    router.use(passport.authenticate('jwt', { session: false }))

    router.get('/', async (_req, res, next) => {
      try {
        // TODO

        return res.send(true)
      } catch (error) {
        next(error)
      }
    })

    return router
  }

}
