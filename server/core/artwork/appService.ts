import { injectable, inject } from 'inversify'

import ApiServiceResult from '../api/results/apiServiceResult.interface'
import UnknownError from '../api/errors/unknownError'
import { User, UserService, UserMapper } from '../user'
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
  ArtworkFilterOptions,
  ArtworkViewModel,
  ArtworkMapper,
  ArtworkCreateRequest,
  ArtworkUpdateRequest,
  ArtworkFilterOptionsBuilder
} from './'
import { ConfigService } from '../config'
import { FileApplicationService } from '../file'

@injectable()
export default class ArtworkApplicationServiceImpl
  implements ArtworkApplicationService {
  private artworkService: ArtworkService
  private discoveryService: DiscoveryService
  private eventService: EventService
  private userService: UserService
  private configService: ConfigService
  private fileAppService: FileApplicationService

  constructor(
    @inject(Symbol.for('ArtworkService'))
    artworkService: ArtworkService,
    @inject(Symbol.for('DiscoveryService'))
    discoveryService: DiscoveryService,
    @inject(Symbol.for('EventService'))
    eventService: EventService,
    @inject(Symbol.for('UserService'))
    userService: UserService,
    @inject(Symbol.for('ConfigService'))
    configService: ConfigService,
    @inject(Symbol.for('FileApplicationService'))
    fileAppService: FileApplicationService
  ) {
    this.artworkService = artworkService
    this.discoveryService = discoveryService
    this.eventService = eventService
    this.userService = userService
    this.configService = configService
    this.fileAppService = fileAppService
  }

  async create(req: ArtworkCreateRequest): Promise<ApiServiceResult<ArtworkViewModel>> {
    try {
      const user = await this.userService.getById(req.userId)

      if (!user) {
        throw new UnauthorizedError()
      }

      // Non-artist users are restricted to max amount of artwork
      const config = await this.configService.getConfig()
      const maxArtworks = config ? config.maxUserArtworks : 10
      if (!user.hasRole('artist') && user.artworkCount >= maxArtworks) {
        throw new Error(`Maximum number of ${maxArtworks} Artworks reached`)
      }

      const artwork = new Artwork().setProps({
        userId: user.id,
        title: req.title,
        slug: req.slug,
        description: req.description,
        type: req.type,
        cityId: user.city,
        hashtags: req.hashtags,
        images: await this.fileAppService.createFromFileUploadRequests(
          user.id,
          'artwork',
          req.images
        )
      })

      const createdArtwork = await this.artworkService.create(artwork)

      if (createdArtwork) {
        this.eventService.emit(UserEvents.Artwork.Created, user.id, createdArtwork.id)

        createdArtwork.hashtags.forEach((hashtag) => {
          this.eventService.emit(ArtworkEvents.Hashtag.Added, hashtag)
        })

        return new ApiServiceSuccessResult(
          new ArtworkMapper().toViewModel(
            createdArtwork,
            new UserMapper().toViewModel(user)
          )
        )
      }

      return { success: false }
    } catch (error) {
      console.error(error)
      throw new UnknownError()
    }
  }

  async update(req: ArtworkUpdateRequest): Promise<ApiServiceResult<ArtworkViewModel>> {
    try {
      const user = await this.userService.getById(req.userId)

      if (!user) {
        throw new UnauthorizedError()
      }

      const artwork = await this.artworkService.get(req.id)
      const oldArtwork = { ...artwork }

      if (!artwork) {
        throw new NotFoundError('artwork')
      }

      if (artwork.owner !== user.id) {
        throw new UnauthorizedError()
      }

      artwork.title = req.title
      artwork.slug = req.slug
      artwork.description = req.description
      artwork.type = req.type
      artwork.city = user.city
      artwork.setHashtags(req.hashtags)
      artwork.images = await this.fileAppService.createFromFileUploadRequests(
        user.id,
        'artwork',
        req.images
      )

      const savedArtwork = await this.artworkService.update(artwork)

      if (savedArtwork) {
        this.eventService.emit(UserEvents.Artwork.Updated, user.id, oldArtwork, savedArtwork)

        savedArtwork.hashtags.forEach((hashtag) => {
          this.eventService.emit(ArtworkEvents.Hashtag.Added, hashtag)
        })

        return new ApiServiceSuccessResult(
          new ArtworkMapper().toViewModel(
            savedArtwork, new UserMapper().toViewModel(user)
          )
        )
      }

      return { success: false }
    } catch (error) {
      console.error(error)
      throw new UnknownError()
    }
  }

  async list(req: any): Promise<ApiServiceResult<ArtworkViewModel[]>> {
    try {
      const opts = ArtworkFilterOptionsBuilder.build(req.query)
      const user = await this.userService.getById((<User>req.user).id)

      if (!user) {
        throw new UnauthorizedError()
      }

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

      if (opts.type === 'All') {
        delete opts.type
      }

      if (opts.city === 'All' || !opts.city) {
        delete opts.city
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

      const mappedArtworks = await Promise.all(
        artworks.map(async (artwork) => {
          const user = await this.userService.getById(artwork.owner)
          return new ArtworkMapper().toViewModel(
            artwork,
            user ? new UserMapper().toViewModel(user) : undefined
          )
        })
      )

      return new ApiServiceSuccessResult(mappedArtworks)
    } catch (error) {
      console.error(error)
      throw new UnknownError()
    }
  }

  async listByUser(user: User, opts?: ArtworkFilterOptions): Promise<ApiServiceResult<ArtworkViewModel[]>> {
    try {
      const artworks = await this.artworkService.listByUser(user, opts)

      const mappedArtworks = await Promise.all(
        artworks.map(async (artwork) => {
          const user = await this.userService.getById(artwork.owner)
          return new ArtworkMapper().toViewModel(
            artwork,
            user ? new UserMapper().toViewModel(user) : undefined
          )
        })
      )

      return new ApiServiceSuccessResult(mappedArtworks)
    } catch (error) {
      console.error(error)
      throw new UnknownError()
    }
  }

  async listLikedByUser(user: User): Promise<ApiServiceResult<ArtworkViewModel[]>> {
    try {
      const artworks = await this.artworkService.listLikedByUser(user)

      const mappedArtworks = await Promise.all(
        artworks.map(async (artwork) => {
          const user = await this.userService.getById(artwork.owner)
          return new ArtworkMapper().toViewModel(
            artwork,
            user ? new UserMapper().toViewModel(user) : undefined
          )
        })
      )

      return new ApiServiceSuccessResult(mappedArtworks)
    } catch (error) {
      console.error(error)
      throw new UnknownError()
    }
  }

  async get(idOrSlug: string): Promise<ApiServiceResult<ArtworkViewModel>> {
    const artwork = await this.artworkService.get(idOrSlug)

    if (!artwork) {
      throw new NotFoundError('artwork')
    }

    try {
      const user = await this.userService.getById(artwork.owner)

      return new ApiServiceSuccessResult(
        new ArtworkMapper().toViewModel(
          artwork,
          user ? new UserMapper().toViewModel(user) : undefined
        )
      )
    } catch (error) {
      console.error(error)
      throw new UnknownError()
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
        throw new NotFoundError('artwork')
      }

      this.eventService.emit(UserEvents.Artwork.Deleted, user.id, artwork)

      await this.artworkService.delete(id)

      return new ApiServiceSuccessResult()
    } catch (error) {
      console.error(error)
      throw new UnknownError()
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
        throw new NotFoundError('artwork')
      }

      await this.artworkService.update(artwork, false)

      return new ApiServiceSuccessResult()
    } catch (error) {
      console.error(error)
      throw new UnknownError()
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
        throw new NotFoundError('artwork')
      }

      await this.artworkService.update(artwork, false)

      return new ApiServiceSuccessResult()
    } catch (error) {
      console.error(error)
      throw new UnknownError()
    }
  }

  async publish(req: any): Promise<ApiServiceResult<void>> {
    try {
      const user = <User>req.user
      const artwork = await this.artworkService.get(req.params.id)

      if (!artwork) {
        throw new NotFoundError('artwork')
      }

      if (artwork.owner !== user.id && !user.roles.includes('admin')) {
        throw new UnauthorizedError()
      }

      artwork.published = true

      const savedArtwork = await this.artworkService.update(artwork, false)

      if (savedArtwork) {
        return new ApiServiceSuccessResult()
      }

      return { success: false }
    } catch (error) {
      console.error(error)
      throw new UnknownError()
    }
  }

  async unpublish(req: any): Promise<ApiServiceResult<void>> {
    try {
      const user = <User>req.user
      const artwork = await this.artworkService.get(req.params.id)

      if (!artwork) {
        throw new NotFoundError('artwork')
      }

      if (artwork.owner !== user.id && !user.roles.includes('admin')) {
        throw new UnauthorizedError()
      }

      artwork.published = false

      const savedArtwork = await this.artworkService.update(artwork, false)

      if (savedArtwork) {
        return new ApiServiceSuccessResult()
      }

      return { success: false }
    } catch (error) {
      console.error(error)
      throw new UnknownError()
    }
  }

  async approve(req: any): Promise<ApiServiceResult<void>> {
    try {
      const user = <User>req.user
      const artwork = await this.artworkService.get(req.params.id)

      if (!artwork) {
        throw new NotFoundError('artwork')
      }

      if (!user.roles.includes('admin')) {
        throw new UnauthorizedError()
      }

      artwork.approved = true

      const savedArtwork = await this.artworkService.update(artwork, false)

      if (savedArtwork) {
        return new ApiServiceSuccessResult()
      }

      return { success: false }
    } catch (error) {
      console.error(error)
      throw new UnknownError()
    }
  }

  async unapprove(req: any): Promise<ApiServiceResult<void>> {
    try {
      const user = <User>req.user
      const artwork = await this.artworkService.get(req.params.id)

      if (!artwork) {
        throw new NotFoundError('artwork')
      }

      if (!user.roles.includes('admin')) {
        throw new UnauthorizedError()
      }

      artwork.approved = false

      const savedArtwork = await this.artworkService.update(artwork, false)

      if (savedArtwork) {
        return new ApiServiceSuccessResult()
      }

      return { success: false }
    } catch (error) {
      error.message
      throw new UnknownError()
    }
  }
}
