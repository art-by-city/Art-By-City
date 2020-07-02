import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'
import BaseApplicationServiceInterface from '../applicationService.interface'
import BaseRepositoryInterface from '../repository.interface'
import BaseDomainServiceInterface from '../domainService.interface'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import City from './city'
import CityRepositoryImpl from './repository'
import CityServiceImpl from './service'
import CityApplicationServiceImpl from './appService'
import CityControllerImpl from './controller'

export { default as City } from './city'

export interface CityFilterOptions {}

export interface CityRepository
  extends BaseRepositoryInterface<City, CityFilterOptions> {}

export interface CityService extends BaseDomainServiceInterface<City> {}

export interface CityApplicationService
  extends BaseApplicationServiceInterface {
  create(req: any): Promise<ApiServiceResult<City>>
  update(req: any): Promise<ApiServiceResult<City>>
  delete(req: any): Promise<ApiServiceResult<void>>
  list(): Promise<ApiServiceResult<City[]>>
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
