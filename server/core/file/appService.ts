import { injectable, inject } from 'inversify'
import fs from 'fs'

import { File, FileService, FileApplicationService } from './'
import { EventService } from '../events'
import { UserEvents } from '../events/user'
import { ArtworkService, ArtworkImage, Artwork } from '../artwork'
import UnknownError from '../api/errors/unknownError'

@injectable()
export default class FileApplicationServiceImpl
  implements FileApplicationService {
  private fileService: FileService
  private eventService: EventService
  private artworkService: ArtworkService

  artworkImageDirectory: string = './static/artwork-images/'
  avatarImageDirectory: string = './static/avatar-images/'

  constructor(
    @inject(Symbol.for('FileService'))
    fileService: FileService,
    @inject(Symbol.for('EventService'))
    eventService: EventService,
    @inject(Symbol.for('ArtworkService'))
    artworkService: ArtworkService
  ) {
    this.fileService = fileService
    this.eventService = eventService
    this.artworkService = artworkService
  }

  async createUserAvatarFromFileData(
    userId: string,
    fileData: string,
    fileType: string
  ): Promise<File | null> {
    try {
      const ext = fileType === 'image/jpeg' ? '.jpg' : '.png'
      const filename = `${userId}${ext}`
      await fs.promises.mkdir(this.avatarImageDirectory, { recursive: true })
      await fs.promises.writeFile(
        `${this.avatarImageDirectory}/${filename}`,
        fileData,
        'binary'
      )

      const file = new File()
      file.name = filename
      file.location = this.avatarImageDirectory
      return await this.fileService.create(file)
    } catch (error) {
      console.error(error)
      throw new UnknownError()
    }
  }

  registerEvents() {
    this.eventService.on(UserEvents.Artwork.Created, this.onArtworkCreated.bind(this))
    this.eventService.on(UserEvents.Artwork.Deleted, this.onArtworkDeleted.bind(this))
    this.eventService.on(UserEvents.Artwork.Updated, this.onArtworkUpdated.bind(this))
  }

  private async onArtworkCreated(_userId: string, artworkId: string) {
    try {
      const artwork = await this.artworkService.get(artworkId);

      if (artwork) {
        await Promise.all(artwork.images.map(async (image: ArtworkImage) => {
          const file = new File()
          file.id = ''
          file.created = new Date()
          file.updated = new Date()
          file.location = 'artwork-images'
          file.name = image.source
          await this.fileService.create(file)
        }))
      }
    } catch (error) {
      console.error(error)
    }
  }

  private async onArtworkDeleted(_userId: string, artwork: Artwork) {
    try {
      if (artwork) {
        await Promise.all(artwork.images.map(async (image: ArtworkImage) => {
          await this.deleteFileByName(image.source)
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
        await this.deleteFileByName(image.source)
      }))
    } catch (error) {
      console.log(error)
    }
  }

  private async deleteFileByName(filename: string): Promise<void> {
    const file = await this.fileService.getByName(filename)
    if (file) {
      const isFileAssetDeleted = await this.removeFileAsset(
        `${this.artworkImageDirectory}/${filename}`
      )
      if (isFileAssetDeleted) {
        await this.fileService.delete(file.id)
      }
    }
  }

  private async removeFileAsset(path: string): Promise<boolean> {
    try {
      await fs.promises.unlink(path)

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
