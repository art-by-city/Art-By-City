import { injectable, inject } from 'inversify'

import ValidationError from '../api/errors/validationError'
import ArtworkValidator from './validator'
import ArtworkRepository from './repository.interface'
import Artwork from './artwork'
import ArtworkServiceInterface from './service.interface'

@injectable()
export default class ArtworkService implements ArtworkServiceInterface {
  private artworkRepository: ArtworkRepository
  private artworkValidator = new ArtworkValidator()

  constructor(
    @inject(Symbol.for('ArtworkRepository'))
    artworkRepository: ArtworkRepository
  ) {
    this.artworkRepository = artworkRepository
  }

  async create(artwork: Artwork): Promise<Artwork | null> {
    // Validate
    const messages = this.artworkValidator.validiate(artwork)

    if (messages) {
      throw new ValidationError(messages)
    }

    // Save
    return await this.artworkRepository.create(artwork)
  }

  get(id: string): Promise<Artwork | null> {
    return this.artworkRepository.get(id)
  }

  list(): Promise<Artwork[]> {
    return this.artworkRepository.list()
  }

  update(artwork: Artwork): Promise<Artwork | null> {
    return this.artworkRepository.update(artwork)
  }

  delete(id: string): Promise<void> {
    return this.artworkRepository.delete(id)
  }
}
