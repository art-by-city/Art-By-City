import { injectable, inject } from 'inversify'
import fs from 'fs'
import { Bucket } from '@google-cloud/storage'

import { File, FileService, FileApplicationService, FileAssetType, FileUploadRequest, isFileUploadRequest } from './'
import { EventService } from '../events'
import { UserEvents } from '../events/user'
import { ArtworkImage, Artwork, ArtworkImageRequest } from '../artwork'
import UnknownError from '../api/errors/unknownError'
import { GatewayAdapter } from '../../gateway'

@injectable()
export default class FileApplicationServiceImpl
  implements FileApplicationService {
  private fileService: FileService
  private eventService: EventService
  private bucket: Bucket

  artworkDirName = 'artwork-images'
  avatarDirName = 'avatar-images'
  artworkImageDirectory: string = `./static/${this.artworkDirName}/`
  avatarImageDirectory: string = `./static/${this.avatarDirName}/`

  constructor(
    @inject(Symbol.for('FileService'))
    fileService: FileService,
    @inject(Symbol.for('EventService'))
    eventService: EventService,
    @inject(Symbol.for('StorageGateway'))
    storage: GatewayAdapter<Storage>
  ) {
    this.fileService = fileService
    this.eventService = eventService
    this.bucket = storage.getClient().bucket(process.env.USER_UPLOAD_BUCKET_NAME)
  }

  async createFromFileUploadRequests(
    userId: string,
    assetType: FileAssetType,
    fileUploadRequests: (FileUploadRequest | ArtworkImageRequest)[]
  ): Promise<ArtworkImage[]> {
    return Promise.all(fileUploadRequests.map(async (image) => {
      if (isFileUploadRequest(image)) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)

        const file = await this.createFromFileData(
          userId,
          assetType,
          image.data,
          image.type,
          `artwork-${uniqueSuffix}`
        )

        if (!file) {
          throw new Error('error creating arwork')
        }

        return {
          source: `${file.name}?${Date.now()}`
        } as ArtworkImage
      } else {
        return image
      }
    }))
  }

  async createFromFileData(
    userId: string,
    assetType: FileAssetType,
    fileData: string,
    fileType: string,
    fileName?: string
  ): Promise<File | null> {
    try {
      if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
        return await this.createCloudFileFromFileData(userId, assetType, fileData, fileType, fileName)
      } else {
        return await this.createLocalFileFromFileData(userId, assetType, fileData, fileType, fileName)
      }
    } catch (error) {
      console.error(error)
      throw new UnknownError()
    }
  }

  private async createLocalFileFromFileData(
    userId: string,
    assetType: FileAssetType,
    fileData: string,
    fileType: string,
    fileName?: string
  ): Promise<File | null> {
    const ext = fileType === 'image/jpeg' ? '.jpg' : '.png'
    const filename = assetType === 'artwork'
      ? `${fileName}${ext}`
      : `${userId}${ext}`
    const dir = assetType === 'artwork'
      ? this.artworkImageDirectory
      : this.avatarImageDirectory

    await fs.promises.mkdir(dir, { recursive: true })
    await fs.promises.writeFile(
      `${dir}/${filename}`,
      fileData,
      'binary'
    )

    const file = new File()
    file.name = filename
    file.location = dir
    file.type = fileType
    file.owner = userId
    file.assetType = assetType

    return await this.fileService.create(file)
  }

  private async createCloudFileFromFileData(
    userId: string,
    assetType: FileAssetType,
    fileData: string,
    fileType: string,
    fileName?: string
  ): Promise<File | null> {
    const ext = fileType === 'image/jpeg' ? '.jpg' : '.png'
    const filename = assetType === 'artwork'
      ? `${fileName}${ext}`
      : `${userId}-avatar${ext}`
    const location = assetType === 'artwork'
      ? this.artworkDirName
      : this.avatarDirName
    try {
      await this.bucket
        .file(`${location}/${filename}`)
        .save(Buffer.from(fileData, 'base64'), {
          public: true,
          contentType: fileType,
          metadata: {
            contentType: fileType,
            cacheControl: 'no-cache'
          }
        })

    } catch (error) {
      console.error('Error uploading file to cloud', error)
      throw new UnknownError('Error uploading image to cloud')
    }

    const file = new File()
    file.name = filename
    file.location = process.env.USER_UPLOAD_BUCKET_NAME + '/' + location
    file.type = fileType
    file.owner = userId
    file.assetType = assetType

    return await this.fileService.create(file)
  }

  getExistingUserAvatarFile(userId: string): Promise<File | null> {
    return this.fileService.findOne({
      owner: userId,
      assetType: 'avatar'
    })
  }

  async deleteFileAndAsset(file: File): Promise<void> {
    const path = `${this.avatarImageDirectory}/${file.name}` // TODO -> cloud files
    const isAssetDeleted = await this.removeFileAsset(path)
    if (isAssetDeleted) {
      await this.fileService.delete(file.id)
    }
  }

  deleteFile(file: File): Promise<void> {
    return this.fileService.delete(file.id)
  }

  registerEvents() {
    this.eventService.on(UserEvents.Artwork.Deleted, this.onArtworkDeleted.bind(this))
    this.eventService.on(UserEvents.Artwork.Updated, this.onArtworkUpdated.bind(this))
  }

  private async onArtworkDeleted(_userId: string, artwork: Artwork) {
    try {
      if (artwork) {
        await Promise.all(artwork.images.map(async (image: ArtworkImage) => {
          await this.deleteFileByName(image.source.split('?')[0], 'artwork')
        }))
      }
    } catch (error) {
      console.error(error)
    }
  }

  private async onArtworkUpdated(_userId: string, oldArtwork: Artwork, newArtwork: Artwork) {
    try {
      const abandonedImages: ArtworkImage[] = []

      for (let i=0; i < oldArtwork.images.length; i++) {
        let found = false
        for (let j=0; j < newArtwork.images.length; j++) {
          if (oldArtwork.images[i].source === newArtwork.images[j].source) {
            found = true
            continue
          }
        }

        if (!found) {
          abandonedImages.push(oldArtwork.images[i])
        }
      }

      await Promise.all(abandonedImages.map(async (image: ArtworkImage) => {
        await this.deleteFileByName(image.source.split('?')[0], 'artwork')
      }))
    } catch (error) {
      console.error(error)
    }
  }

  private async deleteFileByName(filename: string, assetType: FileAssetType): Promise<void> {
    const file = await this.fileService.findOne({ name: filename })
    const dir = assetType === 'artwork'
      ? this.artworkImageDirectory
      : this.avatarImageDirectory
    if (file) {
      const isFileAssetDeleted = await this.removeFileAsset(
        `${dir}/${filename}`
      )
      if (isFileAssetDeleted) {
        await this.fileService.delete(file.id)
      }
    }
  }

  private async removeFileAsset(path: string): Promise<boolean> {
    try {
      // TODO -> cloud files
      await fs.promises.unlink(path)

      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
