import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import roles from '../middleware/roles'

import { AnalyticsController, AnalyticsService } from './'

@injectable()
export default class AnalyticsControllerImpl implements AnalyticsController {
  private router!: Router
  private analyticsService: AnalyticsService

  constructor(
    @inject(Symbol.for('AnalyticsService'))
    analyticsService: AnalyticsService
  ) {
    this.analyticsService = analyticsService
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
    router.use(roles(['admin']))

    /**
     * @openapi
     *
     * /analytics/events:
     *  get:
     *    summary: List UserEvents
     *    operationId: listUserEvents
     *    tags:
     *      - analytics
     *    responses:
     *      '200':
     *        description: An array of UserEvents
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                $ref: "#/components/schemas/UserEvent"
     */
    router.get('/events', async (_req, res, next) => {
      try {
        const result = await this.analyticsService.fetchEvents()

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    return router
  }
}
