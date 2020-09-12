import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import { ArtworkApplicationService } from '../artwork'
import { User, UserController, UserApplicationService } from './'

@injectable()
export default class UserControllerImpl implements UserController {
  private router!: Router

  private artworkAppService: ArtworkApplicationService
  private userAppService: UserApplicationService

  constructor(
    @inject(Symbol.for('ArtworkApplicationService'))
    artworkAppService: ArtworkApplicationService,
    @inject(Symbol.for('UserApplicationService'))
    userAppService: UserApplicationService
  ) {
    this.artworkAppService = artworkAppService
    this.userAppService = userAppService
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

    router.get('/artwork', async (req, res, next) => {
      try {
        const result = await this.artworkAppService.listByUser(<User>req.user)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.get('/:id/account', async (req, res, next) => {
      try {
        const result = await this.userAppService.getUserAccount(req.params.id)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.get('/:username/profile', async (req, res, next) => {
      try {
        const result = await this.userAppService.getUserProfile(req.params.username)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.post('/avatar', async (req, res, next) => {
      try {
        const result = await this.userAppService.uploadAvatar(
          <User>req.user,
          req.body.image,
          req.body.type
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    return router
  }
}
