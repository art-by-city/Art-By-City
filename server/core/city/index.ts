import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'
import BaseApplicationServiceInterface from '../applicationService.interface'
import BaseRepositoryInterface from '../repository.interface'
import BaseDomainServiceInterface from '../domainService.interface'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import City from './city'
import CityViewModel from './viewModels/cityViewModel'
import CityRepositoryImpl from './repository'
import CityServiceImpl from './service'
import CityApplicationServiceImpl from './appService'
import CityControllerImpl from './controller'

export { default as City } from './city'
export { default as CityViewModel } from './viewModels/cityViewModel'

export interface CityFilterOptions {
  includeAll?: boolean
}

export interface CityRepository
  extends BaseRepositoryInterface<City, CityFilterOptions> {}

export interface CityService extends BaseDomainServiceInterface<City> {
  find(opts?: CityFilterOptions): Promise<City[]>
}

export interface CityApplicationService
  extends BaseApplicationServiceInterface {
  create(req: any): Promise<ApiServiceResult<CityViewModel>>
  update(req: any): Promise<ApiServiceResult<CityViewModel>>
  delete(req: any): Promise<ApiServiceResult<void>>
  list(): Promise<ApiServiceResult<CityViewModel[]>>
}

export interface CityController extends BaseControllerInterface {}

export const CityModule = new ContainerModule((bind) => {
  bind<CityRepository>(Symbol.for('CityRepository')).to(CityRepositoryImpl)
  bind<CityService>(Symbol.for('CityService')).to(CityServiceImpl)
  bind<CityApplicationService>(Symbol.for('CityApplicationService')).to(
    CityApplicationServiceImpl
  )
  bind<CityController>(Symbol.for('CityController')).to(CityControllerImpl)
})
