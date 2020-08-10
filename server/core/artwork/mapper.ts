import { Artwork, ArtworkViewModel } from './'
import EntityMapper from '../api/mapper'
import { UserViewModel } from '../user'

export default class ArtworkMapper implements EntityMapper<Artwork, ArtworkViewModel> {
  toViewModel(domainEntity: Artwork, user?: UserViewModel): ArtworkViewModel {
    return {
      id: domainEntity.id,
      owner: user
        ? {
          id: user.id,
          username: user.username,
          city: user.city,
          roles: user.roles
        } : {
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
