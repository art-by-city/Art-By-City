import { injectable, inject } from 'inversify'

import UnknownError from '../api/errors/unknownError'
import ApiServiceSuccessResult from '../api/results/apiServiceSuccessResult'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { CityApplicationService, CityService, City, CityViewModel } from './'
import CityMapper from './mapper'
import NotFoundError from '../api/errors/notFoundError'

@injectable()
export default class CityApplicationServiceImpl
  implements CityApplicationService {
  private cityService: CityService

  constructor(@inject(Symbol.for('CityService')) cityService: CityService) {
    this.cityService = cityService
  }

  async create(req: any): Promise<ApiServiceResult<CityViewModel>> {
    const city = new City()
    city.code = req.body?.city?.code || ''
    city.name = req.body?.city?.name || ''
    city.country = req.body?.city?.country || ''
    city.visible = req.body?.city?.visible || false
    city.disabled = req.body?.city?.disabled === true ? true : false

    try {
      const createdCity = await this.cityService.create(city)
      if (createdCity) {
        return new ApiServiceSuccessResult(new CityMapper().toViewModel(createdCity))
      }
      throw new UnknownError()
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async update(req: any): Promise<ApiServiceResult<CityViewModel>> {
    const city = new City()
    city.id = req.body?.city?.id || ''
    city.code = req.body?.city?.code || ''
    city.name = req.body?.city?.name || ''
    city.country = req.body?.city?.country || ''
    city.visible = req.body?.city?.visible || false
    city.disabled = req.body?.city?.disabled === true ? true : false

    try {
      const savedCity = await this.cityService.update(city)

      if (savedCity) {
        return new ApiServiceSuccessResult(new CityMapper().toViewModel(savedCity))
      }
      throw new NotFoundError(new City())
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async delete(req: any): Promise<ApiServiceResult<void>> {
    try {
      return new ApiServiceSuccessResult(
        await this.cityService.delete(req.params?.id || '')
      )
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async list(): Promise<ApiServiceResult<CityViewModel[]>> {
    try {
      const cities = await this.cityService.list()

      return new ApiServiceSuccessResult(cities.map((city) => {
        return new CityMapper().toViewModel(city)
      }))
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async find(includeNonVisible?: boolean): Promise<CityViewModel[]> {
    try {
      const cities = await this.cityService.find({ includeAll: includeNonVisible })
      return cities.map((city) => {
        return new CityMapper().toViewModel(city)
      })
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }
}
