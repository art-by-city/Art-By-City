import { injectable, inject } from 'inversify'

import ApiServiceResult from '../../results/apiServiceResult.interface'
import ArtworkDomainService from '../../domain/artwork/artworkDomainService.interface'
import Artwork from '../../../core/artwork/artwork'
import UnknownError from '../../errors/unknownError'
import ArtworkServiceInterface from './artworkService.interface'

@injectable()
export default class ArtworkService implements ArtworkServiceInterface {
  private artworkDomainService: ArtworkDomainService

  constructor(
    @inject(Symbol.for('ArtworkDomainService'))
    artworkDomainService: ArtworkDomainService
  ) {
    this.artworkDomainService = artworkDomainService
  }

  async create(
    props: any,
    files?: Express.Multer.File[]
  ): Promise<ApiServiceResult<void>> {
    const artwork = new Artwork()
    artwork.title = props.title || ''
    artwork.description = props.description || ''
    artwork.type = props.type || ''
    artwork.region = props.region || ''
    artwork.hashtags = props.hashtags?.split(',') || []

    if (files) {
      artwork.images = files.map((file) => {
        return { source: file.filename }
      })
    }

    try {
      await this.artworkDomainService.create(artwork)
    } catch (error) {
      throw new UnknownError(error.message)
    }

    return { success: true }
  }

  async list(): Promise<ApiServiceResult<Artwork[]>> {
    try {
      const artworks = await this.artworkDomainService.list()

      return { success: true, payload: artworks }
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }
}