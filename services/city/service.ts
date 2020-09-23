import { Context } from '@nuxt/types'

export default class CityService {
  _context!: Context

  citiesById: any = {}

  constructor(context: Context) {
    this._context = context
  }

  private mapCitiesById() {
    this._context.store.state.config.cities.forEach((city: any) => {
      this.citiesById[city.id] = city
    })
  }

  resolveCityById(cityId: string) {
    if (
      !this.citiesById[cityId] &&
      this._context.store.state.config.cities.length > 0
    ) {
      this.mapCitiesById()
    }

    return this.citiesById[cityId]
  }
}
