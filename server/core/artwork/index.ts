import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'
import BaseApplicationServiceInterface from '../applicationService.interface'
import BaseRepositoryInterface from '../repository.interface'
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
  | 'NYC'
  | 'LA'
  | 'Chicago'
  | 'Houston'
  | 'Phoenix'
  | 'Philadelphia'
  | 'San Antonio'
  | 'San Diego'
  | 'Dallas'
  | 'San Jose'
  | 'Seattle'
  | 'Portland'
  | 'Denver'
  | 'Boston'
  | 'DC'
  | 'Austin'

export interface ArtworkImage {
  source: string
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

  list(): Promise<ApiServiceResult<Artwork[]>>
  listForUser(user: User): Promise<ApiServiceResult<Artwork[]>>
}

export interface ArtworkService {
  create(
    user: User,
    artwork: Artwork,
    images?: ArtworkImage[]
  ): Promise<Artwork | null>
  list(): Promise<Artwork[]>
  listForUser(user: User): Promise<Artwork[]>
  get(id: string): Promise<Artwork | null>
  delete(id: string): Promise<void>
}

export interface ArtworkRepository extends BaseRepositoryInterface<Artwork> {}

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
