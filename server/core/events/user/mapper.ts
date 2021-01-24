import EntityMapper from '../../api/mapper'
import UserEvent from './userEvent'
import UserEventViewModel from './viewModels/userEventViewModel'
import { UserViewModel } from '../../user'

export default class UserEventMapper implements EntityMapper<UserEvent, UserEventViewModel> {
  toViewModel(domainEntity: UserEvent, user?: UserViewModel): UserEventViewModel {
    return {
      id: domainEntity.id,
      timestamp: domainEntity.timestamp,
      user: user
        ? {
          id: user.id,
          username: user.username,
          name: user.name,
          city: user.city,
          roles: user.roles
        } : {
          id: domainEntity.userId,
          username: 'user',
          name: '',
          city: 'city',
          roles: []
        },
      type: domainEntity.type
    }
  }
}
