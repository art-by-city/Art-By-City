import { injectable, inject } from 'inversify'

import ApiServiceResult from '../api/results/apiServiceResult.interface'
import UnknownError from '../api/errors/unknownError'
import { User } from '../user'
import ApiServiceSuccessResult from '../api/results/apiServiceSuccessResult'
import NotFoundError from '../api/errors/notFoundError'
import UnauthorizedError from '../api/errors/unauthorizedError'
import {
  Artwork,
  ArtworkImage,
  ArtworkService,
  ArtworkApplicationService
} from './'

@injectable()
export default class ArtworkApplicationServiceImpl
  implements ArtworkApplicationService {
  private artworkService: ArtworkService

  constructor(
    @inject(Symbol.for('ArtworkService'))
    artworkService: ArtworkService
  ) {
    this.artworkService = artworkService
  }

  async create(req: any): Promise<ApiServiceResult<Artwork>> {
    const user = <User>req.user
    const files = <Express.Multer.File[]>req.files

    const artwork = new Artwork()
    artwork.title = req.body?.title || ''
    artwork.description = req.body?.description || ''
    artwork.type = req.body?.type || ''
    artwork.region = req.body?.region || ''
    artwork.hashtags = req.body?.hashtags?.split(',') || []

    let images: ArtworkImage[] = []
    if (files) {
      images = files.map((file) => {
        return { source: file.filename }
      })
    }

    try {
      const savedArtwork = await this.artworkService.create(
        user,
        artwork,
        images
      )

      if (savedArtwork) {
        return new ApiServiceSuccessResult(savedArtwork)
      }

      return { success: false }
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async list(): Promise<ApiServiceResult<Artwork[]>> {
    try {
      const artworks = await this.artworkService.list()

      return new ApiServiceSuccessResult(artworks)
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async listForUser(user: User): Promise<ApiServiceResult<Artwork[]>> {
    try {
      const artworks = await this.artworkService.listForUser(user)

      return new ApiServiceSuccessResult(artworks)
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async get(id: string): Promise<ApiServiceResult<Artwork>> {
    try {
      const artwork = await this.artworkService.get(id)

      return new ApiServiceSuccessResult(artwork)
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async delete(user: User, id: string): Promise<ApiServiceResult<void>> {
    try {
      const artwork = await this.artworkService.get(id)

      if (artwork) {
        if (artwork.owner.id !== user.id) {
          throw new UnauthorizedError()
        }
      } else {
        throw new NotFoundError(new Artwork())
      }

      await this.artworkService.delete(id)

      return new ApiServiceSuccessResult()
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }
}
