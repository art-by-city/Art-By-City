import { Artwork, ArtworkViewModel } from './'
import ViewModelMapper from '../api/viewModelMapper'
import { UserViewModel } from '../user'

export default class ArtworkViewModelMapper implements ViewModelMapper<
  Artwork,
  ArtworkViewModel
> {
  toViewModel(domainEntity: Artwork, user?: UserViewModel): ArtworkViewModel {
    return {
      id: domainEntity.id,
      owner: user ? user : {
        id: domainEntity.owner.id,
        username: 'user',
        city: 'city',
        roles: []
      },
      title: domainEntity.title,
      description: domainEntity.description,
      type: domainEntity.type,
      city: domainEntity.city.id,
      hashtags: domainEntity.hashtags,
      images: domainEntity.images,
      likes: domainEntity.likes,
      published: domainEntity.published,
      approved: domainEntity.approved
    }
  }
}
