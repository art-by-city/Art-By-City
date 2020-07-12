import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'

import { City } from '../city'
import { Hashtag } from '../hashtag'
import ConfigServiceImpl from './service'
import ConfigControllerImpl from './controller'

export default interface Config {
  cities: City[]
  hashtags: string[]
}

export interface ConfigService {
  getConfig(): Promise<Config>
}

export interface ConfigController extends BaseControllerInterface {}

export const ConfigModule = new ContainerModule((bind) => {
  bind<ConfigService>(Symbol.for('ConfigService')).to(
    ConfigServiceImpl
  )
  bind<ConfigController>(Symbol.for('ConfigController')).to(
    ConfigControllerImpl
  )
})
