import { injectable, inject } from 'inversify'

import ValidationError from '../api/errors/validationError'
import { User, UserRepository } from '../user'
import { DomainServiceOptions } from '../domainService.interface'
import ArtworkValidator from './validator'
import {
  Artwork,
  ArtworkService,
  ArtworkRepository,
  ArtworkFilterOptions
} from './'

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
      artwork.owner = <User>(
        await this.userRepository.get(<string>artwork?.owner)
      )
    }

    return artwork
  }

  async list(opts?: ArtworkFilterOptions): Promise<Artwork[]> {
    const artworks = opts
      ? await this.artworkRepository.find(opts)
      : await this.artworkRepository.list()

    return Promise.all(
      artworks.map(async (a) => {
        a.owner = <User>await this.userRepository.get(<string>a.owner)

        return a
      })
    )
  }

  async listByUser(user: User): Promise<Artwork[]> {
    const artworks = await this.artworkRepository.find({ owner: user.id })

    return Promise.all(
      artworks.map(async (a) => {
        a.owner = <User>await this.userRepository.get(<string>a.owner)

        return a
      })
    )
  }

  async listLikedByUser(user: User): Promise<Artwork[]> {
    const artworks = await this.artworkRepository.find({ likes: [user.id] })

    return Promise.all(
      artworks.map(async (a) => {
        a.owner = <User>await this.userRepository.get(<string>a.owner)

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
