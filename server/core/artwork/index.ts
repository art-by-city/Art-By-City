import { ContainerModule } from 'inversify'
import { IsString, Matches } from 'class-validator'

import BaseControllerInterface from '../controller.interface'
import BaseApplicationServiceInterface from '../applicationService.interface'
import BaseRepositoryInterface from '../infra/repository.interface'
import BaseDomainServiceInterface from '../domainService.interface'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { User } from '../user'

import Artwork from './artwork'
import ArtworkViewModel from './viewModels/artworkViewModel'
import ArtworkRepositoryImpl from './repository'
import ArtworkServiceImpl from './service'
import ArtworkApplicationServiceImpl from './appService'
import ArtworkControllerImpl from './controller'
import { FileUploadRequest } from '../file'
import { DomainServiceResult } from '../domain'

export { default as Artwork } from './artwork'
export { default as ArtworkViewModel } from './viewModels/artworkViewModel'
export { default as ArtworkMapper } from './mapper'
export { default as ArtworkType } from './artworkType/artworkType'
export { default as ArtworkFilterOptionsBuilder } from './filterOptionsBuilder'

export class ArtworkImage {
  @IsString()
  @Matches(/\.(png|jpg)$/)
  source!: string
}
export type ArtworkImageRequest = ArtworkImage | FileUploadRequest
export function isArtworkImage(image: ArtworkImageRequest):
  image is ArtworkImage {
  return (image as ArtworkImage).source !== undefined
}
export interface ArtworkCreateRequest {
  userId: string
  title: string
  slug: string
  description: string
  type: string
  city: string
  hashtags: string[]
  images: FileUploadRequest[]
}
export interface ArtworkUpdateRequest {
  userId: string
  id: string
  title: string
  slug: string
  description: string
  type: string
  city: string
  hashtags: string[]
  images: ArtworkImageRequest[]
}
export interface ArtworkFilterOptions {
  city?: string
  type?: string
  hashtags?: string[]
  owner?: string
  likes?: string[]
  limit?: number
  shuffle?: boolean
  userId?: string
  lastFetchedArtworkId?: string
  includeUnpublished?: boolean
  includeUnapproved?: boolean
}
export interface ArtworkController extends BaseControllerInterface {}
export interface ArtworkApplicationService
  extends BaseApplicationServiceInterface {
  get(idOrSlug: string): Promise<ApiServiceResult<ArtworkViewModel>>
  delete(user: User, id: string): Promise<ApiServiceResult<void>>
  create(req: ArtworkCreateRequest): Promise<ApiServiceResult<ArtworkViewModel>>
  update(req: ArtworkUpdateRequest): Promise<ApiServiceResult<ArtworkViewModel>>
  list(request: any): Promise<ApiServiceResult<ArtworkViewModel[]>>
  listByUser(user: User, opts?: ArtworkFilterOptions): Promise<ApiServiceResult<ArtworkViewModel[]>>
  listLikedByUser(user: User): Promise<ApiServiceResult<ArtworkViewModel[]>>
  like(user: User, id: string): Promise<ApiServiceResult<void>>
  unlike(user: User, id: string): Promise<ApiServiceResult<void>>
  publish(request: any): Promise<ApiServiceResult<void>>
  unpublish(request: any): Promise<ApiServiceResult<void>>
  approve(request: any): Promise<ApiServiceResult<void>>
  unapprove(request: any): Promise<ApiServiceResult<void>>
}
// TODO -> re-extend base service interface
export interface ArtworkService { //extends BaseDomainServiceInterface<Artwork> {
  create(artwork: Artwork): Promise<DomainServiceResult<Artwork>>
  get(idOrSlug: string): Promise<Artwork | null>
  update(artwork: Artwork, modifyUpdated?: boolean): Promise<Artwork>
  delete(id: string): Promise<void>
  list(opts?: ArtworkFilterOptions): Promise<Artwork[]>
  listByUser(user: User, opts?: ArtworkFilterOptions): Promise<Artwork[]>
  listLikedByUser(user: User): Promise<Artwork[]>
}
export interface ArtworkRepository
  extends BaseRepositoryInterface<Artwork, ArtworkFilterOptions> {
  getByIdOrSlug(idOrSlug: string): Promise<Artwork | null>
}

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
