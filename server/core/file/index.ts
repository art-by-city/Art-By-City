import { ContainerModule } from 'inversify'

import BaseApplicationServiceInterface from '../applicationService.interface'
import BaseRepositoryInterface from '../repository.interface'
import BaseDomainServiceInterface from '../domainService.interface'
import File from './file'
import FileRepositoryImpl from './repository'
import FileServiceImpl from './service'
import FileApplicationServiceImpl from './appService'

export { default as File } from './file'

export interface FileUploadRequest {
  data: string
  type: string
}

export type AssetType = 'avatar' | 'artwork'

export interface FileFilterOptions {
  name?: string
}

export interface FileRepository
  extends BaseRepositoryInterface<File, FileFilterOptions> {}

export interface FileService extends BaseDomainServiceInterface<File> {
    getByName(name: string): Promise<File | null>
}

export interface FileApplicationService
  extends BaseApplicationServiceInterface {
  registerEvents(): void
  createFromFileData(
    userId: string,
    assetType: AssetType,
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
