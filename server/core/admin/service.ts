import { injectable, inject } from 'inversify'

import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { User, UserService } from '../user'
import { AdminService } from './'
import { CityService, City } from '../city'
import { ArtworkService, Artwork } from '../artwork'

@injectable()
export default class AdminServiceImpl implements AdminService {
  private userService: UserService
  private cityService: CityService
  private artworkService: ArtworkService

  constructor(
    @inject(Symbol.for('UserService'))
    userService: UserService,
    @inject(Symbol.for('CityService'))
    cityService: CityService,
    @inject(Symbol.for('ArtworkService'))
    artworkService: ArtworkService
  ) {
    this.userService = userService
    this.cityService = cityService
    this.artworkService = artworkService
  }

  listUsers(): Promise<User[]> {
    return this.userService.listUsers()
  }

  listCities(): Promise<City[]> {
    return this.cityService.find({ includeAll: true })
  }

  listArtwork(): Promise<Artwork[]> {
    return this.artworkService.list({ includeUnapproved: true, includeUnpublished: true })
  }

  setUserRoles(
    userId: string,
    roles: string[]
  ): Promise<ApiServiceResult<void>> {
    return this.userService.setUserRoles(userId, roles)
  }

  saveUser(user: any): Promise<ApiServiceResult<void>> {
    return this.userService.saveUser(<User>user)
  }
}
