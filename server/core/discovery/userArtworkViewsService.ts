import { injectable, inject } from 'inversify'

import {
  UserArtworkViewsService,
  UserArtworkViewsRepository,
  UserArtworkViews
} from './'

@injectable()
export default class UserArtworkViewsServiceImpl
  implements UserArtworkViewsService {
  private userArtworkViewsRepository: UserArtworkViewsRepository

  constructor(
    @inject(Symbol.for('UserArtworkViewsRepository'))
    userArtworkViewsRepository: UserArtworkViewsRepository
  ) {
    this.userArtworkViewsRepository = userArtworkViewsRepository
  }

  createOrUpdate(
    userArtworkViews: UserArtworkViews
  ): Promise<UserArtworkViews | null> {
    if (!userArtworkViews.id) {
      return this.create(userArtworkViews)
    } else {
      return this.update(userArtworkViews)
    }
  }

  create(userArtworkViews: UserArtworkViews): Promise<UserArtworkViews | null> {
    return this.userArtworkViewsRepository.create(userArtworkViews)
  }

  get(id: string): Promise<UserArtworkViews | null> {
    return this.userArtworkViewsRepository.get(id)
  }

  getByUserId(userId: string): Promise<UserArtworkViews | null> {
    return this.userArtworkViewsRepository.findOne({ userId })
  }

  update(userArtworkViews: UserArtworkViews): Promise<UserArtworkViews | null> {
    return this.userArtworkViewsRepository.update(userArtworkViews)
  }

  delete(id: string): Promise<void> {
    return this.userArtworkViewsRepository.delete(id)
  }

  list(): Promise<UserArtworkViews[]> {
    return this.userArtworkViewsRepository.list()
  }

  async setLastViewedArtwork(userId: string, artworkId: string): Promise<void> {
    let lastViewed = await this.getByUserId(userId)

    if (lastViewed && lastViewed.id) {
      lastViewed.lastFetchedArtworkId = artworkId
    } else {
      lastViewed = { id: '', userId, lastFetchedArtworkId: artworkId }
    }

    await this.createOrUpdate(lastViewed)
  }
}
