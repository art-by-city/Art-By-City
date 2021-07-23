import { ContainerModule } from 'inversify'

import BaseRepositoryInterface from '../infra/repository.interface'
import BaseControllerInterface from '../controller.interface'
import Config from './config'
import ConfigServiceImpl from './service'
import ConfigControllerImpl from './controller'
import ConfigViewModel from './viewModels/configViewModel'
import ConfigRepositoryImpl from './repository'
import ApiServiceResult from '../api/results/apiServiceResult.interface'

export { default as Config } from './config'
export { default as ConfigViewModel } from './viewModels/configViewModel'

export interface ConfigService {
  getConfig(): Promise<ConfigViewModel>
  updateConfig(config: Config): Promise<ApiServiceResult<void>>
}

export interface ConfigFilterOptions {}
export interface ConfigRepository
  extends BaseRepositoryInterface<Config, ConfigFilterOptions> {
    get(): Promise<Config | null>
  }

export interface ConfigController extends BaseControllerInterface {}

export const ConfigModule = new ContainerModule((bind) => {
  bind<ConfigRepository>(Symbol.for('ConfigRepository')).to(
    ConfigRepositoryImpl
  )
  bind<ConfigService>(Symbol.for('ConfigService')).to(
    ConfigServiceImpl
  )
  bind<ConfigController>(Symbol.for('ConfigController')).to(
    ConfigControllerImpl
  )
})
