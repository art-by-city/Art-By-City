import { injectable, inject } from 'inversify'

import { City, CityService, CityRepository } from './'

@injectable()
export default class CityServiceImpl implements CityService {
  private cityRepository: CityRepository

  constructor(
    @inject(Symbol.for('CityRepository')) cityRepository: CityRepository
  ) {
    this.cityRepository = cityRepository
  }

  create(city: City): Promise<City | null> {
    return this.cityRepository.create(city)
  }

  get(id: string): Promise<City | null> {
    return this.cityRepository.get(id)
  }

  update(city: City): Promise<City | null> {
    return this.cityRepository.update(city)
  }

  delete(id: string): Promise<void> {
    return this.cityRepository.delete(id)
  }

  list(): Promise<City[]> {
    return this.cityRepository.list()
  }
}
