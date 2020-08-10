import { Artwork, ArtworkViewModel } from './'
import EntityMapper from '../api/mapper'
import { User } from '../user'

export default class ArtworkMapper implements EntityMapper<Artwork, ArtworkViewModel> {
  toViewModel(domainEntity: Artwork): ArtworkViewModel {
    return {
      id: domainEntity.id,
      owner: {
        id: (<User>domainEntity.owner).id,
        username: (<User>domainEntity.owner).username,
        city: (<User>domainEntity.owner).city,
        roles: (<User>domainEntity.owner).roles
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
