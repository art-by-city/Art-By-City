import { injectable, inject } from 'inversify'

import ApiServiceResult from '../api/results/apiServiceResult.interface'
import UserService from '../user/service.interface'
import User from '../user/user'
import AdminServiceInterface from './service.interface'

@injectable()
export default class AdminService implements AdminServiceInterface {
  private userService: UserService

  constructor(@inject(Symbol.for('UserService')) userService: UserService) {
    this.userService = userService
  }

  listUsers(): Promise<User[]> {
    return this.userService.listUsers()
  }

  setUserRoles(
    userId: string,
    roles: string[]
  ): Promise<ApiServiceResult<void>> {
    return this.userService.setUserRoles(userId, roles)
  }
}
