import { User, UserViewModel } from './'
import EntityMapper from '../api/mapper'

export interface UserMapperOptions {
  cityName?: string
}

export default class UserMapper implements EntityMapper<User, UserViewModel> {
  toViewModel(domainEntity: User, opts?: UserMapperOptions): UserViewModel {
    return {
      id: domainEntity.id,
      username: domainEntity.username,
      name: domainEntity.name,
      city: opts?.cityName || domainEntity.city,
      roles: domainEntity.roles,
      avatar: domainEntity.avatar
    }
  }
  toUserAccountViewModel(domainEntity: User, opts?: UserMapperOptions) {
    const userViewModel = this.toViewModel(domainEntity, opts)
    return {
      ...userViewModel,
      email: domainEntity.email
    }
  }
}
