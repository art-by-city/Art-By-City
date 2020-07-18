import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'
import BaseApplicationServiceInterface from '../applicationService.interface'
import AnalyticsControllerImpl from './controller'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { UserEvent } from '../events/user'
import AnalyticsServiceImpl from './service'

export interface AnalyticsController extends BaseControllerInterface {}

export interface AnalyticsService extends BaseApplicationServiceInterface {
  fetchEvents(): Promise<ApiServiceResult<UserEvent[]>>
}

export const AnalyticsModule = new ContainerModule((bind) => {
  bind<AnalyticsController>(Symbol.for('AnalyticsController')).to(
    AnalyticsControllerImpl
  )
  bind<AnalyticsService>(Symbol.for('AnalyticsService')).to(
    AnalyticsServiceImpl
  )
})
