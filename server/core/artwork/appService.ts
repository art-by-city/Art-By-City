import { injectable, inject } from 'inversify'

import ApiServiceResult from '../api/results/apiServiceResult.interface'
import UnknownError from '../api/errors/unknownError'
import { User } from '../user'
import ApiServiceSuccessResult from '../api/results/apiServiceSuccessResult'
import NotFoundError from '../api/errors/notFoundError'
import UnauthorizedError from '../api/errors/unauthorizedError'
import { UserEvents } from '../events/user'
import { ArtworkEvents } from '../events/artwork'
import { DiscoveryService } from '../discovery'
import { EventService } from '../events'
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
  private discoveryService: DiscoveryService
  private eventService: EventService

  constructor(
    @inject(Symbol.for('ArtworkService'))
    artworkService: ArtworkService,
    @inject(Symbol.for('DiscoveryService'))
    discoveryService: DiscoveryService,
    @inject(Symbol.for('EventService'))
    eventService: EventService
  ) {
    this.artworkService = artworkService
    this.discoveryService = discoveryService
    this.eventService = eventService
  }

  async create(req: any): Promise<ApiServiceResult<Artwork>> {
    const user = <User>req.user
    const files = <Express.Multer.File[]>req.files

    const artwork = new Artwork()
    artwork.id = ''
    artwork.created = new Date()
    artwork.updated = new Date()
    artwork.owner = user.id
    artwork.title = req.body?.title || ''
    artwork.description = req.body?.description || ''
    artwork.type = req.body?.type || ''
    artwork.city = req.body?.city || ''
    artwork.hashtags = req.body?.hashtags?.split(',') || []
    artwork.likes = []

    // TODO -> Refactor out to a FileService
    if (files) {
      artwork.images = files.map((file) => {
        return { source: file.filename }
      })
    }

    const savedArtwork = await this.artworkService.create(artwork)

    if (savedArtwork) {
      savedArtwork.hashtags.forEach((hashtag) => {
        this.eventService.emit(ArtworkEvents.Hashtag.Added, hashtag)
      })

      return new ApiServiceSuccessResult(savedArtwork)
    }

    return { success: false }
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
        artwork.updated = new Date()
        artwork.title = req.body?.title || ''
        artwork.description = req.body?.description || ''
        artwork.type = req.body?.type || ''
        artwork.city = req.body?.city || ''
        artwork.hashtags = req.body?.hashtags || []
        const savedArtwork = await this.artworkService.update(artwork)
        savedArtwork.hashtags.forEach((hashtag) => {
          this.eventService.emit(ArtworkEvents.Hashtag.Added, hashtag)
        })
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

  async list(req: any): Promise<ApiServiceResult<Artwork[]>> {
    try {
      const opts: ArtworkFilterOptions = <ArtworkFilterOptions>req.query
      const user: User = <User>req.user

      opts.userId = user.id

      const userArtworkViews = await this.discoveryService.getLastArtworkViewed(
        user.id
      )

      if (userArtworkViews && userArtworkViews.lastFetchedArtworkId) {
        opts.lastFetchedArtworkId = userArtworkViews.lastFetchedArtworkId
      }

      if (opts.shuffle !== false) {
        opts.shuffle = true
      }
      if (!opts.limit) {
        opts.limit = 9
      }

      let artworks = await this.artworkService.list(opts)

      let shouldResetLastViewedArtwork = false
      let moreArtworks: Artwork[] = []
      if (artworks.length < opts.limit) {
        const moreOpts = { ...opts }
        const amountNeeded = opts.limit - artworks.length

        moreOpts.limit = amountNeeded
        delete moreOpts.lastFetchedArtworkId

        moreArtworks = await this.artworkService.list(moreOpts)

        if (moreArtworks.length > 0) {
          shouldResetLastViewedArtwork = true
          artworks = artworks.concat(moreArtworks)
        }
      }


      await this.discoveryService.setLastArtworkViewedFromBatch(user.id, [
        ...(shouldResetLastViewedArtwork ? moreArtworks : artworks)
      ])

      artworks.forEach((artwork) => {
        this.eventService.emit(UserEvents.Artwork.Viewed, user.id, artwork.id)
      })

      return new ApiServiceSuccessResult(artworks)
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
