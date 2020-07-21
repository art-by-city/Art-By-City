import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import { AuthService } from '../auth'
import { User, UserService } from '../user'
import { AuthController } from './'

@injectable()
export default class AuthControllerImpl implements AuthController {
  private authService: AuthService
  private userService: UserService

  private router!: Router

  constructor(
    @inject(Symbol.for('AuthService'))
    authService: AuthService,
    @inject(Symbol.for('UserService'))
    userService: UserService
  ) {
    this.authService = authService
    this.userService = userService
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
      const result = this.authService.login(<User>req.user)

      return res.json(result)
    })

    router.post('/logout', (_req, res) => {
      return res.send()
    })

    router.get('/user', jwtAuth, (req, res) => {
      const user = <User>req.user

      return res.json({ user })
    })

    router.put('/register', async (req, res, next) => {
      try {
        const user = await this.userService.register(req)

        const result = this.authService.login(user)

        return res.json(result)
      } catch (error) {
        next(error)
      }
    })

    router.post('/update', localAuth, async (req, res, next) => {
      try {
        const user = <User>req.user
        const result = await this.userService.updatePassword(
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
