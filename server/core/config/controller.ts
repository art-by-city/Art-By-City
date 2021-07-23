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

    /**
     * @openapi
     *
     * /config:
     *  get:
     *    summary: Fetch app Config
     *    operationId: getConfig
     *    tags:
     *      - config
     *    responses:
     *      '200':
     *        description: The app Config
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/Config"
     *      '500':
     *        description: Unexpected error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/Error"
     *            example:
     *              value:
     *                statusCode: 500
     *                message: 'An unknown error has occurred'
     */
    router.get('/', async (_req, res, next) => {
      try {
        const result = await this.configService.getConfig()

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /config:
     *  post:
     *    summary: Update app Config
     *    operationId: updateConfig
     *    tags:
     *      - config
     *    responses:
     *      '200':
     *        description: Null response
     *      '500':
     *        description: Unexpected error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/Error"
     *            example:
     *              value:
     *                statusCode: 500
     *                message: 'An unknown error has occurred'
     */
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