import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import roles from '../middleware/roles'
import { AdminController, AdminService } from './'

@injectable()
export default class AdminControllerImpl implements AdminController {
  private router!: Router
  private adminService: AdminService

  constructor(
    @inject(Symbol.for('AdminService'))
    adminService: AdminService
  ) {
    this.adminService = adminService
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
     * GET /users - List all users
     */
    router.get('/users', async (_req, res) => {
      const users = await this.adminService.listUsers()

      return res.json({ users })
    })

    /**
     * GET /cities - Get all cities
     */
    router.get('/cities', async (_req, res) => {
      const cities = await this.adminService.listCities()

      return res.json({ cities })
    })

    /**
     * POST /user - Update a user's roles
     * TODO -> Temporary?
     */
    router.post('/user', async (req, res) => {
      const result = await this.adminService.saveUser(req.body.user)

      return res.send(result)
    })

    /**
     * GET /artwork - Admin Artwork Fetch
     */
    router.get('/artwork', async (_req, res) => {
      const result = await this.adminService.listArtwork()

      return res.send(result)
    })

    return router
  }
}
