import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'
import BaseApplicationServiceInterface from '../applicationService.interface'
import ChangelogControllerImpl from './controller'
import ChangelogServiceImpl from './service'
import ChangelogApplicationServiceImpl from './appService'

export type ChangelogChange = {
  type: 'feature' | 'bugfix'
  role?: 'admin'
  content: string
}

export type ChangelogEntry = {
  version: string
  changes: ChangelogChange[]
}

export type Changelog = {
  entries: ChangelogEntry[]
}

export type ChangelogViewModel = Changelog

export interface ChangelogController extends BaseControllerInterface {}

export interface ChangelogApplicationService
  extends BaseApplicationServiceInterface {
  getChangelogForUser(userId: string): Promise<ChangelogViewModel>
  markVersionSeenForUser(userId: string, version: string): Promise<true>
}

export interface ChangelogService {
  getChangelog(isAdmin?: boolean): Promise<Changelog>
}

export const ChangelogModule = new ContainerModule((bind) => {
  bind<ChangelogController>(Symbol.for('ChangelogController')).to(
    ChangelogControllerImpl
  )
  bind<ChangelogApplicationService>(
    Symbol.for('ChangelogApplicationService')
  ).to(
    ChangelogApplicationServiceImpl
  )
  bind<ChangelogService>(Symbol.for('ChangelogService')).to(
    ChangelogServiceImpl
  ).inSingletonScope()
})
