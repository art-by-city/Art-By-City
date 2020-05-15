import { injectable, inject } from 'inversify'

import Artwork from '../../../core/artwork/artwork'
import ArtworkValidator from '../../../core/validators/artworkValidator'
import ValidationError from '../../errors/validationError'
import ArtworkRepository from '../../../repositories/artwork/artworkRepository.interface'
import ArtworkDomainServiceInterface from './artworkDomainService.interface'

@injectable()
export default class ArtworkDomainService
  implements ArtworkDomainServiceInterface {
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
