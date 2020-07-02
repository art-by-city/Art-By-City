import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import roles from '../middleware/roles'
import { CityController, CityApplicationService } from './'

@injectable()
export default class CityControllerImpl implements CityController {
  private router!: Router
  private cityAppService: CityApplicationService

  constructor(
    @inject(Symbol.for('CityApplicationService'))
    cityApplicationService: CityApplicationService
  ) {
    this.cityAppService = cityApplicationService
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

    router.put('/', roles(['admin']), async (req, res) => {
      const result = await this.cityAppService.create(req)

      return res.send(result)
    })

    router.post('/:id', roles(['admin']), async (req, res) => {
      const result = await this.cityAppService.update(req)

      return res.send(result)
    })

    router.get('/', async (_req, res) => {
      const result = await this.cityAppService.list()

      return res.send(result)
    })

    router.delete('/:id', async (req, res) => {
      const result = await this.cityAppService.delete(req)

      return res.send(result)
    })

    return router
  }
}
