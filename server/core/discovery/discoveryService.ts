import { injectable, inject } from 'inversify'

import { Artwork } from '../artwork'
import { DiscoveryService, UserArtworkViewsService, UserArtworkViews } from './'

@injectable()
export default class DiscoveryServiceImpl implements DiscoveryService {
  private userArtworksViewsService: UserArtworkViewsService

  constructor(
    @inject(Symbol.for('UserArtworkViewsService'))
    userArtworkViewsService: UserArtworkViewsService
  ) {
    this.userArtworksViewsService = userArtworkViewsService
  }

  getLastArtworkViewed(userId: string): Promise<UserArtworkViews | null> {
    return this.userArtworksViewsService.getByUserId(userId)
  }

  setLastArtworkViewed(userId: string, artworkId: string): Promise<void> {
    return this.userArtworksViewsService.setLastViewedArtwork(userId, artworkId)
  }

  setLastArtworkViewedFromBatch(
    userId: string,
    artworks: Artwork[]
  ): Promise<void> | void {
    if (artworks.length > 0) {
      const sorted = artworks.sort((a: Artwork, b: Artwork) => {
        if (a.id < b.id) {
          return 1
        }
        if (a.id > b.id) {
          return -1
        }

        return 0
      })

      return this.setLastArtworkViewed(userId, sorted[0].id)
    }
  }
}
