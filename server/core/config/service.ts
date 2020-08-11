import { injectable, inject } from 'inversify'

import { Config, ConfigService, ConfigViewModel, ConfigRepository } from './'
import { HashtagService, Hashtag } from '../hashtag'
import { CityService, City } from '../city'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import UnknownError from '../api/errors/unknownError'
import NotFoundError from '../api/errors/notFoundError'

@injectable()
export default class ConfigServiceImpl implements ConfigService {
  private hashtagService: HashtagService
  private cityService: CityService
  private configRepository: ConfigRepository

  constructor(
    @inject(Symbol.for('HashtagService'))
    hashtagService: HashtagService,
    @inject(Symbol.for('CityService'))
    cityService: CityService,
    @inject(Symbol.for('ConfigRepository'))
    configRepository: ConfigRepository
  ) {
    this.hashtagService = hashtagService
    this.cityService = cityService
    this.configRepository = configRepository
  }

  async getConfig(): Promise<ConfigViewModel> {
    const config = await this.configRepository.get()
    return {
      cities: (await this.cityService.list()).sort((a: City, b: City) => {
        if (a.disabled === b.disabled) {
          return a.name.localeCompare(b.name)
        } else if (a.disabled && !b.disabled) {
          return 1
        } else {
          return -1
        }
      }),
      hashtags: (await this.hashtagService.list()).map((h: Hashtag) => h.hashtag),
      maxUserArtworks: config?.maxUserArtworks || 10
    }
  }

  async updateConfig(config: Config): Promise<ApiServiceResult<void>> {
    try {
      const dbConfig = await this.configRepository.get()
      if (!dbConfig) {
        const newConfig = new Config()
        newConfig.created = new Date()
        newConfig.updated = new Date()
        newConfig.maxUserArtworks = config.maxUserArtworks
        await this.configRepository.create(newConfig)
      } else {
        dbConfig.maxUserArtworks = config.maxUserArtworks
        await this.configRepository.update(dbConfig)
      }

      return { success: true }
    } catch (error) {
      console.error(error.message)
      throw new UnknownError()
    }
  }
}