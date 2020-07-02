import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import roles from '../middleware/roles'
import { AdminController, AdminService } from './'

@injectable()
export default class AdminControllerImpl implements AdminController {
  private adminService: AdminService

  private router!: Router

  constructor(@inject(Symbol.for('AdminService')) adminService: AdminService) {
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
     * POST /user - Update a user's roles
     * Temporary
     */
    router.post('/user', async (req, res) => {
      const result = await this.adminService.saveUser(req.body.user)

      return res.send(result)
    })

    return router
  }
}
