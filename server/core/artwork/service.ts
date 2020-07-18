import { injectable, inject } from 'inversify'

import UnknownError from '../api/errors/unknownError'
import { User, UserRepository } from '../user'
import { DomainServiceOptions } from '../domainService.interface'
import validateArtwork from './validator'
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
    await validateArtwork(artwork)

    try {
      return await this.artworkRepository.create(artwork)
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async update(artwork: Artwork): Promise<Artwork> {
    await validateArtwork(artwork)

    try {
      return await this.artworkRepository.update(artwork)
    } catch (error) {
      throw new UnknownError(error.message)
    }

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

  delete(id: string): Promise<void> {
    return this.artworkRepository.delete(id)
  }
}
