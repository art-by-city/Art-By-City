import { injectable, inject } from 'inversify'

import ValidationError from '../api/errors/validationError'
import { User, UserRepository } from '../user'
import ArtworkValidator from './validator'
import { Artwork, ArtworkImage, ArtworkService, ArtworkRepository } from './'

@injectable()
export default class ArtworkServiceImpl implements ArtworkService {
  private artworkRepository: ArtworkRepository
  private userRepository: UserRepository
  private artworkValidator = new ArtworkValidator()

  constructor(
    @inject(Symbol.for('ArtworkRepository'))
    artworkRepository: ArtworkRepository,
    @inject(Symbol.for('UserRepository'))
    userRepository: UserRepository
  ) {
    this.artworkRepository = artworkRepository
    this.userRepository = userRepository
  }

  async create(
    user: User,
    artwork: Artwork,
    images: ArtworkImage[]
  ): Promise<Artwork | null> {
    // Validate
    const messages = this.artworkValidator.validate(artwork)

    if (messages) {
      throw new ValidationError(messages)
    }

    artwork.owner = this.userRepository.getDocumentReference(user.id)
    artwork.images = images

    // Save
    return await this.artworkRepository.create(artwork)
  }

  get(id: string): Promise<Artwork | null> {
    return this.artworkRepository.get(id)
  }

  async list(): Promise<Artwork[]> {
    const artworks = await this.artworkRepository.list()

    const hydratedArtworks = Promise.all(
      artworks.map(async (a) => {
        a.owner = <User>await this.userRepository.get(a.owner.id)

        return a
      })
    )

    return hydratedArtworks
  }

  async listForUser(user: User): Promise<Artwork[]> {
    const filter = new Artwork()
    filter.owner = this.userRepository.getDocumentReference(user.id)

    const artworks = await this.artworkRepository.find(filter)

    const hydratedArtworks = Promise.all(
      artworks.map(async (a) => {
        a.owner = <User>await this.userRepository.get(a.owner.id)

        return a
      })
    )

    return hydratedArtworks
  }

  update(artwork: Artwork): Promise<Artwork | null> {
    return this.artworkRepository.update(artwork)
  }

  delete(id: string): Promise<void> {
    return this.artworkRepository.delete(id)
  }
}
