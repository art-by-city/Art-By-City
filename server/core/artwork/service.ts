import { injectable, inject } from 'inversify'

import ValidationError from '../api/errors/validationError'
import { User, UserRepository } from '../user'
import { DomainServiceOptions } from '../domainService.interface'
import ArtworkValidator from './validator'
import { Artwork, ArtworkService, ArtworkRepository } from './'

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

  async create(artwork: Artwork): Promise<Artwork | null> {
    const messages = this.artworkValidator.validate(artwork)

    if (messages) {
      throw new ValidationError(messages)
    }

    return await this.artworkRepository.create(artwork)
  }

  async get(id: string, opts?: DomainServiceOptions): Promise<Artwork | null> {
    const artwork = await this.artworkRepository.get(id)

    if (artwork && opts?.hydrated) {
      artwork.owner = <User>await this.userRepository.get(artwork?.owner.id)
    }

    return artwork
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

  async listByUser(user: User): Promise<Artwork[]> {
    const filter = new Artwork()
    filter.owner = this.userRepository.getDocumentReference(user.id)

    const artworks = await this.artworkRepository.find(filter)

    return Promise.all(
      artworks.map(async (a) => {
        a.owner = <User>await this.userRepository.get(a.owner.id)

        return a
      })
    )
  }

  async listLikedByUser(user: User): Promise<Artwork[]> {
    const filter = new Artwork()

    // TODO -> Fix filter
    filter.likes = [user.id]

    const artworks = await this.artworkRepository.find(filter)

    return Promise.all(
      artworks.map(async (a) => {
        a.owner = <User>await this.userRepository.get(a.owner.id)

        return a
      })
    )
  }

  update(artwork: Artwork): Promise<Artwork> {
    return this.artworkRepository.update(artwork)
  }

  delete(id: string): Promise<void> {
    return this.artworkRepository.delete(id)
  }
}
