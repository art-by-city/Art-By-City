import { injectable, inject } from 'inversify'

import { ArtworkRepository } from '../artwork'
import { DiscoveryService, UserArtworkViewsService } from './'

@injectable()
export default class DiscoveryServiceImpl implements DiscoveryService {
  private userArtworkViewsService: UserArtworkViewsService
  private artworkRepository: ArtworkRepository

  constructor(
    @inject(Symbol.for('UserArtworkViewsService'))
    userArtworkViewsService: UserArtworkViewsService,
    @inject(Symbol.for('ArtworkRepository'))
    artworkRepository: ArtworkRepository
  ) {
    this.userArtworkViewsService = userArtworkViewsService
    this.artworkRepository = artworkRepository
  }

  async generateArtworkDiscoveryBatchForUser(
    userId: string
  ): Promise<string[]> {
    const uav = await this.userArtworkViewsService.getByUserId(userId)
    console.log('DiscoveryService->generate() uav', uav)

    // eslint-disable-next-line no-unused-vars
    const arts = await this.artworkRepository.discover(userId)
    // console.log('DiscoveryService->generate() arts', arts)

    return []
  }
}
