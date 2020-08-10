import { injectable, inject } from 'inversify'

import { UserApplicationService, UserService, UserProfileViewModel, User } from './'
import { UserEvents } from '../events/user'
import { EventService } from '../events'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { ArtworkService } from '../artwork'
import NotFoundError from '../api/errors/notFoundError'
import ApiServiceSuccessResult from '../api/results/apiServiceSuccessResult'
import { CityService, City } from '../city'
import UserMapper from './mapper'

@injectable()
export default class UserApplicationServiceImpl implements UserApplicationService {
  private userService: UserService
  private eventService: EventService
  private artworkService: ArtworkService
  private cityService: CityService

  constructor(
    @inject(Symbol.for('UserService'))
    userService: UserService,
    @inject(Symbol.for('EventService'))
    eventService: EventService,
    @inject(Symbol.for('ArtworkService'))
    artworkService: ArtworkService,
    @inject(Symbol.for('CityService'))
    cityService: CityService
  ) {
    this.userService = userService
    this.eventService = eventService
    this.artworkService = artworkService
    this.cityService = cityService
  }

  async getUserProfile(username: string): Promise<ApiServiceResult<UserProfileViewModel>> {
    const user = await this.userService.getByUsername(username)

    if (user) {
      const city = await this.cityService.get(user.city)

      if (!city) {
        throw new NotFoundError(new City())
      }

      const userProfile: UserProfileViewModel = {
        user: new UserMapper().toViewModel(user, { cityName: city.name }),
        artworks: await this.artworkService.listByUser(user)
      }

      return new ApiServiceSuccessResult(userProfile)
    } else {
      throw new NotFoundError(new User())
    }
  }

  registerEvents() {
    this.eventService.on(UserEvents.Artwork.Created, this.onUserArtworkCreated.bind(this))
    this.eventService.on(UserEvents.Artwork.Deleted, this.onUserArtworkDeleted.bind(this))
  }

  onUserArtworkCreated(userId: string) {
    try {
      this.userService.incrementUserArtworkCount(userId)
    } catch (error) {
      console.error(error)
    }
  }

  onUserArtworkDeleted(userId: string) {
    try {
      this.userService.decrementUserArtworkCount(userId)
    } catch (error) {
      console.error(error)
    }
  }
}