import { ContainerModule } from 'inversify'

import BaseApplicationServiceInterface from '../applicationService.interface'
import BaseRepositoryInterface from '../infra/repository.interface'
import BaseDomainServiceInterface from '../domainService.interface'
import File from './file'
import FileRepositoryImpl from './repository'
import FileServiceImpl from './service'
import FileApplicationServiceImpl from './appService'
import { ArtworkImage, ArtworkImageRequest } from '../artwork'

export { default as File } from './file'

export interface FileUploadRequest {
  data: string
  type: string
}
export function isFileUploadRequest(thing: any): thing is FileUploadRequest {
  return (thing as FileUploadRequest).type !== undefined
}

export type FileAssetType = 'avatar' | 'artwork'

export interface FileFilterOptions {
  name?: string
  owner?: string
  assetType?: FileAssetType
}

export interface FileRepository
  extends BaseRepositoryInterface<File, FileFilterOptions> {}

export interface FileService extends BaseDomainServiceInterface<File> {
  findOne(opts?: FileFilterOptions): Promise<File | null>
}

export interface FileApplicationService
  extends BaseApplicationServiceInterface {
  registerEvents(): void
  getExistingUserAvatarFile(userId: string): Promise<File | null>
  deleteFileAndAsset(file: File): Promise<void>
  deleteFile(file: File): Promise<void>
  createFromFileUploadRequests(
    userId: string,
    assetType: FileAssetType,
    fileUploadRequests: (FileUploadRequest | ArtworkImageRequest)[]): Promise<ArtworkImage[]>
  createFromFileData(
    userId: string,
    assetType: FileAssetType,
    fileData: string,
    fileType: string,
    fileName?: string
  ): Promise<File | null>
}

export const FileModule = new ContainerModule((bind) => {
  bind<FileRepository>(Symbol.for('FileRepository'))
    .to(FileRepositoryImpl)
  bind<FileService>(Symbol.for('FileService'))
    .to(FileServiceImpl)
  bind<FileApplicationService>(Symbol.for('FileApplicationService'))
    .to(FileApplicationServiceImpl)
})
