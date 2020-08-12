import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import { ConfigController, ConfigService } from './'
import roles from '../middleware/roles'


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

    const loggedInAuth = passport.authenticate('jwt', { session: false })

    // router.use(loggedInAuth)

    router.get('/', async (_req, res, next) => {
      try {
        const result = await this.configService.getConfig()

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.post('/', loggedInAuth, roles(['admin']), async (req, res, next) => {
      try {
        const result = await this.configService.updateConfig(req.body)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    return router
  }
}