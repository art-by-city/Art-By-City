import { injectable, inject } from 'inversify'

import UnknownError from '../api/errors/unknownError'
import { User } from '../user'
import validateArtwork from './validator'
import {
  Artwork,
  ArtworkService,
  ArtworkRepository,
  ArtworkFilterOptions
} from './'
import { DomainServiceResult } from '../domain'

@injectable()
export default class ArtworkServiceImpl implements ArtworkService {
  private artworkRepository: ArtworkRepository

  constructor(
    @inject(Symbol.for('ArtworkRepository'))
    artworkRepository: ArtworkRepository
  ) {
    this.artworkRepository = artworkRepository
  }

  async create(artwork: Artwork): Promise<DomainServiceResult<Artwork>> {
    try {
      await validateArtwork(artwork)
    } catch (error) {
      return { success: false, errors: [error] }
    }

    try {
      return { success: true, payload: await this.artworkRepository.create(artwork) }
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async update(artwork: Artwork, modifyUpdated: boolean = true): Promise<Artwork> {
    await validateArtwork(artwork)

    try {
      return this.artworkRepository.update(artwork, modifyUpdated)
    } catch (error) {
      throw new UnknownError(error.message)
    }

  }

  get(idOrSlug: string): Promise<Artwork | null> {
    return this.artworkRepository.getByIdOrSlug(idOrSlug)
  }

  list(opts?: ArtworkFilterOptions): Promise<Artwork[]> {
    return opts
      ? this.artworkRepository.find(opts)
      : this.artworkRepository.list()
  }

  listByUser(user: User, opts?: ArtworkFilterOptions): Promise<Artwork[]> {
    return this.artworkRepository.find({
      owner: user.id,
      includeUnapproved: opts?.includeUnapproved || false,
      includeUnpublished: opts?.includeUnpublished || false
    })
  }

  listLikedByUser(user: User): Promise<Artwork[]> {
    return this.artworkRepository.find({ likes: [user.id] })
  }

  delete(id: string): Promise<void> {
    return this.artworkRepository.delete(id)
  }
}
