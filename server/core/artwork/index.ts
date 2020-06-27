import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'
import BaseApplicationServiceInterface from '../applicationService.interface'
import BaseRepositoryInterface from '../repository.interface'
import BaseDomainServiceInterface, {
  DomainServiceOptions
} from '../domainService.interface'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { User } from '../user'

import Artwork from './artwork'
import ArtworkRepositoryImpl from './repository'
import ArtworkServiceImpl from './service'
import ArtworkApplicationServiceImpl from './appService'
import ArtworkControllerImpl from './controller'

export { default as Artwork } from './artwork'

export type ArtworkType =
  | 'Painting'
  | 'Illustration'
  | 'Drawing'
  | 'Sculpture'
  | 'Photograph'
  | 'Mixed-Media'
  | 'Digital'
  | 'Other'

export type Region =
  | 'Austin'
  | 'Boston'
  | 'Chicago'
  | 'Dallas'
  | 'Denver'
  | 'Houston'
  | 'Los Angeles'
  | 'New York City'
  | 'Philadelphia'
  | 'Phoenix'
  | 'Portland'
  | 'San Antonio'
  | 'San Diego'
  | 'San Jose'
  | 'Seattle'
  | 'Washington D.C.'

export interface ArtworkImage {
  source: string
}

export interface ArtworkFilterOptions {
  region?: string
  type?: string
  hashtags?: string[]
  owner?: string
  likes?: string[]
  limit?: number
}

export interface ArtworkController extends BaseControllerInterface {}

export interface ArtworkApplicationService
  extends BaseApplicationServiceInterface {
  get(id: string): Promise<ApiServiceResult<Artwork>>
  delete(user: User, id: string): Promise<ApiServiceResult<void>>
  create(
    request: any,
    files?: Express.Multer.File[]
  ): Promise<ApiServiceResult<Artwork>>
  update(request: any): Promise<ApiServiceResult<Artwork>>
  list(opts?: ArtworkFilterOptions): Promise<ApiServiceResult<Artwork[]>>
  listByUser(user: User): Promise<ApiServiceResult<Artwork[]>>
  listLikedByUser(user: User): Promise<ApiServiceResult<Artwork[]>>
  like(user: User, id: string): Promise<ApiServiceResult<void>>
  unlike(user: User, id: string): Promise<ApiServiceResult<void>>
}

export interface ArtworkService extends BaseDomainServiceInterface<Artwork> {
  create(artwork: Artwork): Promise<Artwork | null>
  get(id: string, opts?: DomainServiceOptions): Promise<Artwork | null>
  update(artwork: Artwork): Promise<Artwork>
  delete(id: string): Promise<void>
  list(opts?: ArtworkFilterOptions): Promise<Artwork[]>
  listByUser(user: User): Promise<Artwork[]>
  listLikedByUser(user: User): Promise<Artwork[]>
}

export interface ArtworkRepository
  extends BaseRepositoryInterface<Artwork, ArtworkFilterOptions> {}

export const ArtworkModule = new ContainerModule((bind) => {
  bind<ArtworkRepository>(Symbol.for('ArtworkRepository')).to(
    ArtworkRepositoryImpl
  )
  bind<ArtworkService>(Symbol.for('ArtworkService')).to(ArtworkServiceImpl)
  bind<ArtworkApplicationService>(Symbol.for('ArtworkApplicationService')).to(
    ArtworkApplicationServiceImpl
  )
  bind<ArtworkController>(Symbol.for('ArtworkController')).to(
    ArtworkControllerImpl
  )
})
