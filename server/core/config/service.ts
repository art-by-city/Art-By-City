import { injectable, inject } from 'inversify'

import Config, { ConfigService } from './'
import { HashtagService, Hashtag } from '../hashtag'
import { CityService } from '../city'

@injectable()
export default class ConfigServiceImpl implements ConfigService {
  private hashtagService: HashtagService
  private cityService: CityService

  constructor(
    @inject(Symbol.for('HashtagService'))
    hashtagService: HashtagService,
    @inject(Symbol.for('CityService'))
    cityService: CityService
  ) {
    this.hashtagService = hashtagService
    this.cityService = cityService
  }

  async getConfig(): Promise<Config> {
    return {
      cities: await this.cityService.list(),
      hashtags: (await this.hashtagService.list()).map((h: Hashtag) => h.hashtag)
    }
  }
}