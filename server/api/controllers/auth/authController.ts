import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import Account from '../../../core/account/account.interface'

import AuthService from '../../../services/auth/authService.interface'
import AccountService from '../../../services/account/accountService.interface'
import AuthControllerInterface from './authController.interface'

@injectable()
export default class AuthController implements AuthControllerInterface {
  private authService: AuthService
  private accountService: AccountService

  private router!: Router

  constructor(
    @inject(Symbol.for('AuthService'))
    authService: AuthService,
    @inject(Symbol.for('AccountService'))
    accountService: AccountService
  ) {
    this.authService = authService
    this.accountService = accountService
  }

  getRouter(): Router {
    if (!this.router) {
      this.router = this.buildRouter()
    }

    return this.router
  }

  private buildRouter(): Router {
    const router = Router()

    const localAuth = passport.authenticate('local')
    const jwtAuth = passport.authenticate('jwt', { session: false })

    router.post('/login', localAuth, (req, res) => {
      const result = this.authService.login(<Account>req.user)

      return res.json(result)
    })

    router.post('/logout', (_req, res) => {
      return res.send()
    })

    router.get('/user', jwtAuth, (req, res) => {
      const user = <Account>req.user

      return res.json({ user })
    })

    router.put('/register', async (req, res, next) => {
      try {
        const result = await this.accountService.register(
          req.body.username,
          req.body.password
        )

        return res.json(result)
      } catch (error) {
        next(error)
      }
    })

    router.post('/update', localAuth, async (req, res, next) => {
      try {
        const user = <Account>req.user
        const result = await this.accountService.updatePassword(
          user.id,
          req.body.newPassword
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    // TODO
    // router.post('/refresh', jwtAuth, async (req, res, next) => {

    // })

    return router
  }
}
