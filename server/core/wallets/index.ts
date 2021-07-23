import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'
import BaseApplicationServiceInterface from '../applicationService.interface'
import { ApiServiceResult } from '../api'
import { DomainService, DomainServiceResult } from '../domain'
import { BaseRepositoryInterface } from '../infra'

import WalletsControllerImpl from './controller'
import WalletsApplicationServiceImpl from './appService'
import WalletsServiceImpl from './service'
import WalletViewModel from './viewModel'
import Wallet from './wallet'
import WalletsRepositoryImpl from './repository'

export { default as Wallet } from './wallet'
export { default as WalletViewModel } from './viewModel'

export interface WalletsController extends BaseControllerInterface {}

export interface WalletsApplicationService
  extends BaseApplicationServiceInterface {
  getWalletForUser(userId: string): Promise<ApiServiceResult<WalletViewModel>>
}

export interface WalletsService extends DomainService<Wallet> {
  getWalletForUser(userId: string): Promise<DomainServiceResult<Wallet>>
}

export interface WalletsRepository
  extends BaseRepositoryInterface<Wallet, {}> {
  getWalletForUser(userId: string): Promise<Wallet | null>
}

export const WalletsModule = new ContainerModule((bind) => {
  bind<WalletsController>(Symbol.for('WalletsController')).to(
    WalletsControllerImpl
  )
  bind<WalletsApplicationService>(Symbol.for('WalletsApplicationService')).to(
    WalletsApplicationServiceImpl
  )
  bind<WalletsService>(Symbol.for('WalletsService')).to(
    WalletsServiceImpl
  )
  bind<WalletsRepository>(Symbol.for('WalletsRepository')).to(
    WalletsRepositoryImpl
  )
})
