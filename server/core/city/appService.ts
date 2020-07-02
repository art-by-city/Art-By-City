import { injectable, inject } from 'inversify'

import UnknownError from '../api/errors/unknownError'
import ApiServiceSuccessResult from '../api/results/apiServiceSuccessResult'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { CityApplicationService, CityService, City } from './'

@injectable()
export default class CityApplicationServiceImpl
  implements CityApplicationService {
  private cityService: CityService

  constructor(@inject(Symbol.for('CityService')) cityService: CityService) {
    this.cityService = cityService
  }

  async create(req: any): Promise<ApiServiceResult<City>> {
    const city = new City()
    city.code = req.body?.city?.code || ''
    city.name = req.body?.city?.name || ''
    city.country = req.body?.city?.country || ''

    try {
      return new ApiServiceSuccessResult(await this.cityService.create(city))
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async update(req: any): Promise<ApiServiceResult<City>> {
    const city = new City()
    city.id = req.body?.city?.id || ''
    city.code = req.body?.city?.code || ''
    city.name = req.body?.city?.name || ''
    city.country = req.body?.city?.country || ''

    try {
      return new ApiServiceSuccessResult(await this.cityService.update(city))
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

  async list(): Promise<ApiServiceResult<City[]>> {
    try {
      return new ApiServiceSuccessResult(await this.cityService.list())
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }
}
