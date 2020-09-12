import { injectable, inject } from 'inversify'
import { Router } from 'express'
// import multer from 'multer'
import passport from 'passport'

import roles from '../middleware/roles'
import { User } from '../user'
import { ArtworkApplicationService, ArtworkController } from './'

// TODO -> service
// const uploadDir = './static/artwork-images/'
// const storage = multer.diskStorage({
//   destination: uploadDir,
//   filename(_req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
//     // TODO -> allowed image extensions
//     const extension = file.mimetype === 'image/jpeg' ? '.jpg' : '.png'
//     cb(null, file.fieldname + '-' + uniqueSuffix + extension)
//   }
// })

// const upload = multer({ storage })

@injectable()
export default class ArtworkControllerImpl implements ArtworkController {
  private router!: Router
  private artworkAppService: ArtworkApplicationService

  constructor(
    @inject(Symbol.for('ArtworkApplicationService'))
    artworkAppService: ArtworkApplicationService
  ) {
    this.artworkAppService = artworkAppService
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

    router.post('/', async (req, res, next) => {
      try {
        const result = await this.artworkAppService.create({
          userId: (<User>req.user).id,
          ...req.body.artwork
        })

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.put('/:id', async (req, res, next) => {
      try {
        const result = await this.artworkAppService.update(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.post('/:id/publish', async (req, res, next) => {
      try {
        const result = await this.artworkAppService.publish(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.post('/:id/unpublish', async (req, res, next) => {
      try {
        const result = await this.artworkAppService.unpublish(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.post('/:id/approve', roles(['admin']), async (req, res, next) => {
      try {
        const result = await this.artworkAppService.approve(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.post('/:id/unapprove', roles(['admin']), async (req, res, next) => {
      try {
        const result = await this.artworkAppService.unapprove(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.get('/', async (req, res, next) => {
      try {
        const result = await this.artworkAppService.list(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.get('/:id', async (req, res, next) => {
      try {
        const result = await this.artworkAppService.get(req.params.id)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.delete('/:id', async (req, res, next) => {
      try {
        const result = await this.artworkAppService.delete(
          <User>req.user,
          req.params.id
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.put('/:id/like', async (req, res, next) => {
      try {
        const result = await this.artworkAppService.like(
          <User>req.user,
          req.params.id
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    router.delete('/:id/like', async (req, res, next) => {
      try {
        const result = await this.artworkAppService.unlike(
          <User>req.user,
          req.params.id
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    return router
  }
}
