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
      return this.artworkRepository.create(artwork)
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async update(artwork: Artwork): Promise<Artwork> {
    await validateArtwork(artwork)

    try {
      return this.artworkRepository.update(artwork)
    } catch (error) {
      throw new UnknownError(error.message)
    }

  }

  get(id: string): Promise<Artwork | null> {
    return this.artworkRepository.get(id)
  }

  list(opts?: ArtworkFilterOptions): Promise<Artwork[]> {
    return opts
      ? this.artworkRepository.find(opts)
      : this.artworkRepository.list()
  }

  listByUser(user: User): Promise<Artwork[]> {
    return this.artworkRepository.find({
      owner: user.id,
      includeUnapproved: true,
      includeUnpublished: true
    })
  }

  listLikedByUser(user: User): Promise<Artwork[]> {
    return this.artworkRepository.find({ likes: [user.id] })
  }

  delete(id: string): Promise<void> {
    return this.artworkRepository.delete(id)
  }
}
