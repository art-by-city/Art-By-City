import { User, UserAccountViewModel, UserViewModel } from './'
import EntityMapper from '../api/mapper'

export interface UserMapperOptions {
  cityName?: string
}

export default class UserMapper implements EntityMapper<User, UserViewModel> {
  toViewModel(domainEntity: User | null, opts?: UserMapperOptions): UserViewModel | null {
    if (!domainEntity) {
      return null
    }
    return {
      id: domainEntity.id,
      username: domainEntity.username,
      name: domainEntity.name,
      city: opts?.cityName || domainEntity.city,
      roles: domainEntity.roles,
      avatar: domainEntity.avatar
    }
  }
  toUserAccountViewModel(domainEntity: User, opts?: UserMapperOptions): UserAccountViewModel | null {
    const userViewModel = this.toViewModel(domainEntity, opts)

    if (!userViewModel) {
      return null
    }
    return {
      ...userViewModel,
      email: domainEntity.email
    }
  }
}
