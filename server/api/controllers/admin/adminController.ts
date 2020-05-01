import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import roles from '../../middleware/roles'
import AdminService from '../../../services/admin/adminService.interface'
import AdminControllerInterface from './adminController.interface'

@injectable()
export default class AdminController implements AdminControllerInterface {
  private adminService: AdminService

  private router: Router

  constructor(@inject(Symbol.for('AdminService')) adminService: AdminService) {
    this.adminService = adminService
    this.router = this.buildRouter()
  }

  getRouter(): Router {
    return this.router
  }

  private buildRouter(): Router {
    const router = Router()

    router.use(passport.authenticate('jwt', { session: false }))
    router.use(roles(['admin']))

    /**
     * GET /accounts - List all accounts
     */
    router.get('/accounts', async (_req, res) => {
      const accounts = await this.adminService.listAccounts()

      return res.json({ accounts })
    })

    /**
     * POST /account - Update an account's roles
     * Temporary
     */
    router.post('/account', async (req, res) => {
      const result = await this.adminService.setAccountRoles(
        req.body.account.id,
        req.body.account.roles
      )

      return res.send(result)
    })

    return router
  }
}
