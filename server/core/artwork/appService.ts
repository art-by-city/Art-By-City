import _ from 'lodash'
import { injectable, inject } from 'inversify'

import ApiServiceResult from '../api/results/apiServiceResult.interface'
import UnknownError from '../api/errors/unknownError'
import { User } from '../user'
import ApiServiceSuccessResult from '../api/results/apiServiceSuccessResult'
import NotFoundError from '../api/errors/notFoundError'
import UnauthorizedError from '../api/errors/unauthorizedError'
import {
  Artwork,
  ArtworkService,
  ArtworkApplicationService,
  ArtworkFilterOptions
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

    if (files) {
      artwork.images = files.map((file) => {
        return { source: file.filename }
      })
    }

    artwork.owner = user.id

    try {
      const savedArtwork = await this.artworkService.create(artwork)

      if (savedArtwork) {
        return new ApiServiceSuccessResult(savedArtwork)
      }

      return { success: false }
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async update(req: any): Promise<ApiServiceResult<Artwork>> {
    const user = <User>req.user

    try {
      const artwork = await this.artworkService.get(req.body.id)

      if (!artwork) {
        throw new NotFoundError(new Artwork())
      }

      if (artwork.owner !== user.id) {
        throw new UnauthorizedError()
      }

      if (artwork && artwork.owner === user.id) {
        artwork.title = req.body?.title || ''
        artwork.description = req.body?.description || ''
        artwork.type = req.body?.type || ''
        artwork.region = req.body?.region || ''
        artwork.hashtags = req.body?.hashtags || []
        const savedArtwork = await this.artworkService.update(artwork)
        if (savedArtwork) {
          return new ApiServiceSuccessResult(savedArtwork)
        }

        return { success: false }
      } else {
        throw new UnknownError('Artwork not found or permission denied')
      }
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async list(
    opts?: ArtworkFilterOptions
  ): Promise<ApiServiceResult<Artwork[]>> {
    try {
      const artworks = await this.artworkService.list(opts)

      return new ApiServiceSuccessResult(_.shuffle(artworks))
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async listByUser(user: User): Promise<ApiServiceResult<Artwork[]>> {
    try {
      const artworks = await this.artworkService.listByUser(user)

      return new ApiServiceSuccessResult(artworks)
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async listLikedByUser(user: User): Promise<ApiServiceResult<Artwork[]>> {
    try {
      const artworks = await this.artworkService.listLikedByUser(user)

      return new ApiServiceSuccessResult(artworks)
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async get(id: string): Promise<ApiServiceResult<Artwork>> {
    try {
      const artwork = await this.artworkService.get(id, { hydrated: true })

      return new ApiServiceSuccessResult(artwork)
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async delete(user: User, id: string): Promise<ApiServiceResult<void>> {
    try {
      const artwork = await this.artworkService.get(id)

      if (artwork) {
        if (artwork.owner !== user.id) {
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

  async like(user: User, id: string): Promise<ApiServiceResult<void>> {
    try {
      const artwork = await this.artworkService.get(id)

      if (artwork) {
        if (!artwork.likes) {
          artwork.likes = []
        }

        if (!artwork.likes.includes(user.id)) {
          artwork.likes.push(user.id)
        }
      } else {
        throw new NotFoundError(new Artwork())
      }

      await this.artworkService.update(artwork)

      return new ApiServiceSuccessResult()
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async unlike(user: User, id: string): Promise<ApiServiceResult<void>> {
    try {
      const artwork = await this.artworkService.get(id)

      if (artwork) {
        if (!artwork.likes) {
          artwork.likes = []
        }

        if (artwork.likes.includes(user.id)) {
          artwork.likes = artwork.likes.filter((id: string) => {
            return id !== user.id
          })
        }
      } else {
        throw new NotFoundError(new Artwork())
      }

      await this.artworkService.update(artwork)

      return new ApiServiceSuccessResult()
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }
}
