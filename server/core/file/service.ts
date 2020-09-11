import { injectable, inject } from 'inversify'

import {
  File,
  FileService,
  FileRepository
} from './'

@injectable()
export default class FileServiceImpl implements FileService {
  private fileRepository: FileRepository

  constructor(
    @inject(Symbol.for('FileRepository'))
    fileRepository: FileRepository
  ) {
    this.fileRepository = fileRepository
  }

  create(file: File): Promise<File | null> {
    return this.fileRepository.create(file)
  }

  get(id: string): Promise<File | null> {
    return this.fileRepository.get(id)
  }

  update(file: File): Promise<File | null> {
    return this.fileRepository.update(file)
  }

  delete(id: string): Promise<void> {
    return this.fileRepository.delete(id)
  }

  list(): Promise<File[]> {
    return this.fileRepository.list()
  }

  getByName(name: string): Promise<File | null> {
    return this.fileRepository.findOne({ name })
  }
}
