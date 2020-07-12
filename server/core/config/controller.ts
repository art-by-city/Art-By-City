import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import { ConfigController, ConfigService } from './'


@injectable()
export default class ConfigControllerImpl implements ConfigController {
  private router!: Router
  private configService: ConfigService

  constructor(
    @inject(Symbol.for('ConfigService'))
    configService: ConfigService
  ) {
    this.configService = configService
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

    router.get('/', async (_req, res) => {
      const result = await this.configService.getConfig()

      return res.send(result)
    })

    return router
  }
}