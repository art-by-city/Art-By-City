import { ContainerModule } from 'inversify'

import BaseRepositoryInterface from '../infra/repository.interface'
import BaseDomainServiceInterface from '../domainService.interface'
import BaseApplicationServiceInterface from '../applicationService.interface'

import { Artwork } from '../artwork'
import UserArtworkViews from './userArtworkViews'
import UserArtworkViewsRepositoryImpl from './userArtworkViewsRepository'
import UserArtworkViewsServiceImpl from './userArtworkViewsService'
import DiscoveryServiceImpl from './discoveryService'

export { default as UserArtworkViews } from './userArtworkViews'

export interface DiscoveryFilterOptions {
  userId?: string
}

export interface DiscoveryService extends BaseApplicationServiceInterface {
  getLastArtworkViewed(userId: string): Promise<UserArtworkViews | null>
  setLastArtworkViewed(userId: string, artworkId: string): Promise<void>
  setLastArtworkViewedFromBatch(
    userId: string,
    artworks: Artwork[]
  ): Promise<void> | void
}

export interface UserArtworkViewsService
  extends BaseDomainServiceInterface<UserArtworkViews> {
  createOrUpdate(
    userArtworkViews: UserArtworkViews
  ): Promise<UserArtworkViews | null>
  getByUserId(userId: string): Promise<UserArtworkViews | null>
  setLastViewedArtwork(userId: string, artworkId: string): Promise<void>
}

export interface UserArtworkViewsRepository
  extends BaseRepositoryInterface<UserArtworkViews, DiscoveryFilterOptions> {
  findOne(filter?: DiscoveryFilterOptions): Promise<UserArtworkViews | null>
}

export const DiscoveryModule = new ContainerModule((bind) => {
  bind<UserArtworkViewsRepository>(Symbol.for('UserArtworkViewsRepository')).to(
    UserArtworkViewsRepositoryImpl
  )
  bind<UserArtworkViewsService>(Symbol.for('UserArtworkViewsService')).to(
    UserArtworkViewsServiceImpl
  )
  bind<DiscoveryService>(Symbol.for('DiscoveryService')).to(
    DiscoveryServiceImpl
  )
})
