import { injectable, inject } from 'inversify'

import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { User, UserViewModel, UserService, UserMapper, UserAccountViewModel } from '../user'
import { AdminService } from './'
import { CityService, CityViewModel } from '../city'
import { ArtworkService, ArtworkViewModel, ArtworkMapper } from '../artwork'
import ApiServiceSuccessResult from '../api/results/apiServiceSuccessResult'
import CityMapper from '../city/mapper'

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

  async listUsers(): Promise<ApiServiceResult<UserAccountViewModel[]>> {
    const users = await this.userService.listUsers()
    return new ApiServiceSuccessResult(users.map((user) => {
      return new UserMapper().toUserAccountViewModel(user)
    }))
  }

  async listCities(): Promise<ApiServiceResult<CityViewModel[]>> {
    const cities = await this.cityService.find({ includeAll: true })
    return new ApiServiceSuccessResult(cities.map((city) => {
      return new CityMapper().toViewModel(city)
    }))
  }

  async listArtwork(): Promise<ApiServiceResult<ArtworkViewModel[]>> {
    const artworks = await this.artworkService.list(
      { includeUnapproved: true, includeUnpublished: true }
    )

    const mappedArtworks = await Promise.all(
      artworks.map(async (artwork) => {
        const user = await this.userService.getById(artwork.owner)
        return new ArtworkMapper().toViewModel(artwork, user || undefined)
      })
    )

    return new ApiServiceSuccessResult(mappedArtworks)
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
