import { Artwork, ArtworkViewModel } from './'
import EntityMapper from '../api/mapper'
import { UserViewModel } from '../user'
import { Timestamp } from '@google-cloud/firestore'

export default class ArtworkMapper implements EntityMapper<Artwork, ArtworkViewModel> {
  toViewModel(domainEntity: Artwork, user?: UserViewModel): ArtworkViewModel {
    return {
      id: domainEntity.id,
      created: domainEntity.created,
      updated: domainEntity.updated,
      owner: user
        ? user
        : {
          id: domainEntity.owner,
          username: 'user',
          city: 'city',
          roles: []
        },
      title: domainEntity.title,
      description: domainEntity.description,
      type: domainEntity.type,
      city: domainEntity.city,
      hashtags: domainEntity.hashtags,
      images: domainEntity.images,
      likes: domainEntity.likes,
      published: domainEntity.published,
      approved: domainEntity.approved
    }
  }
}
