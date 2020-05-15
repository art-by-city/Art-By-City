import { injectable, inject } from 'inversify'
import { Router } from 'express'
import multer from 'multer'
import passport from 'passport'

import roles from '../../middleware/roles'
import ArtworkService from '../../../services/application/artwork/artworkService.interface'
import ArtworkControllerInterface from './artworkController.interface'

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
export default class ArtworkController implements ArtworkControllerInterface {
  private router!: Router

  private artworkService: ArtworkService

  constructor(
    @inject(Symbol.for('ArtworkService')) artworkService: ArtworkService
  ) {
    this.artworkService = artworkService
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

    // TODO -> individual routes use roles(['artist']) middleware

    router.put(
      '/',
      roles(['artist']),
      upload.array('images'),
      async (req, res) => {
        const result = await this.artworkService.create(
          req.body,
          <Express.Multer.File[]>req.files
        )

        return res.send(result)
      }
    )

    router.get('/', async (_req, res) => {
      const result = await this.artworkService.list()

      console.log('GET /api/artwork result', result)

      return res.send(result)
    })

    return router
  }
}
