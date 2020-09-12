import { injectable, inject } from 'inversify'

import {
  UserApplicationService,
  UserService,
  UserProfileViewModel,
  User,
  UserAccountViewModel,
  UserAvatarViewModel
} from './'
import { UserEvents } from '../events/user'
import { EventService } from '../events'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { ArtworkService, ArtworkMapper } from '../artwork'
import NotFoundError from '../api/errors/notFoundError'
import ApiServiceSuccessResult from '../api/results/apiServiceSuccessResult'
import { CityService } from '../city'
import UserMapper from './mapper'
import { FileApplicationService } from '../file'
import UnknownError from '../api/errors/unknownError'

@injectable()
export default class UserApplicationServiceImpl implements UserApplicationService {
  private userService: UserService
  private eventService: EventService
  private artworkService: ArtworkService
  private cityService: CityService
  private fileAppService: FileApplicationService

  constructor(
    @inject(Symbol.for('UserService'))
    userService: UserService,
    @inject(Symbol.for('EventService'))
    eventService: EventService,
    @inject(Symbol.for('ArtworkService'))
    artworkService: ArtworkService,
    @inject(Symbol.for('CityService'))
    cityService: CityService,
    @inject(Symbol.for('FileApplicationService'))
    fileAppService: FileApplicationService
  ) {
    this.userService = userService
    this.eventService = eventService
    this.artworkService = artworkService
    this.cityService = cityService
    this.fileAppService = fileAppService
  }

  async getUserProfile(username: string):
    Promise<ApiServiceResult<UserProfileViewModel>> {
    const user = await this.userService.getByUsername(username)

    if (user) {
      const city = await this.cityService.get(user.city)
      const artworks = await this.artworkService.listByUser(user)

      const userProfile: UserProfileViewModel = {
        user: new UserMapper().toViewModel(user, { cityName: city?.name || undefined }),
        artworks: await Promise.all(
          artworks.map(async (artwork) => {
            const user = await this.userService.getById(artwork.owner)
            return new ArtworkMapper().toViewModel(
              artwork,
              user ? new UserMapper().toViewModel(user) : undefined
            )
          })
        )
      }

      return new ApiServiceSuccessResult(userProfile)
    } else {
      throw new NotFoundError('user')
    }
  }

  async getUserAccount(id: string):
    Promise<ApiServiceResult<UserAccountViewModel>> {
    const user = await this.userService.getById(id)

    if (user) {
      const city = await this.cityService.get(user.city)

      const userProfile = new UserMapper()
        .toUserAccountViewModel(user, { cityName: city?.name || undefined })

      return new ApiServiceSuccessResult(userProfile)
    } else {
      throw new NotFoundError('user')
    }
  }

  async uploadAvatar(user: User, imageData: string, imageType: string):
    Promise<ApiServiceResult<UserAvatarViewModel>> {
    const avatarFile = await this.fileAppService.createFromFileData(
      user.id,
      'avatar',
      imageData,
      imageType
    )

    if (avatarFile) {
      const avatar = { source: `${avatarFile.name}?${Date.now()}` }
      if (await this.userService.updateUserAvatar(user.id, avatar)) {
        return new ApiServiceSuccessResult(avatar)
      }
    }

    throw new UnknownError()
  }

  registerEvents() {
    this.eventService.on(UserEvents.Artwork.Created, this.onUserArtworkCreated.bind(this))
    this.eventService.on(UserEvents.Artwork.Deleted, this.onUserArtworkDeleted.bind(this))
  }

  private onUserArtworkCreated(userId: string) {
    try {
      this.userService.incrementUserArtworkCount(userId)
    } catch (error) {
      console.error(error)
    }
  }

  private onUserArtworkDeleted(userId: string) {
    try {
      this.userService.decrementUserArtworkCount(userId)
    } catch (error) {
      console.error(error)
    }
  }
}