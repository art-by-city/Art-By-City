import { injectable, inject } from 'inversify'
import { Router } from 'express'
import multer from 'multer'
import passport from 'passport'

import roles from '../middleware/roles'
import { User } from '../user'
import { ArtworkApplicationService, ArtworkController } from './'

// TODO -> service
const uploadDir = './static/artwork-images/'
const storage = multer.diskStorage({
  destination: uploadDir,
  filename(_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    // TODO -> allowed image extensions
    const extension = file.mimetype === 'image/jpeg' ? '.jpg' : '.png'
    cb(null, file.fieldname + '-' + uniqueSuffix + extension)
  }
})

const upload = multer({ storage })

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

    router.put(
      '/',
      roles(['artist']),
      upload.array('images'),
      async (req, res) => {
        const result = await this.artworkAppService.create(req)

        return res.send(result)
      }
    )

    router.post('/:id', roles(['artist']), async (req, res) => {
      const result = await this.artworkAppService.update(req)

      return res.send(result)
    })

    router.get('/', async (_req, res) => {
      const result = await this.artworkAppService.list()

      return res.send(result)
    })

    router.get('/:id', async (req, res) => {
      const result = await this.artworkAppService.get(req.params.id)

      return res.send(result)
    })

    router.delete('/:id', roles(['artist']), async (req, res) => {
      const result = await this.artworkAppService.delete(
        <User>req.user,
        req.params.id
      )

      return res.send(result)
    })

    router.put('/:id/like', async (req, res) => {
      const result = await this.artworkAppService.like(
        <User>req.user,
        req.params.id
      )

      return res.send(result)
    })

    router.delete('/:id/like', async (req, res) => {
      const result = await this.artworkAppService.unlike(
        <User>req.user,
        req.params.id
      )

      return res.send(result)
    })

    return router
  }
}
