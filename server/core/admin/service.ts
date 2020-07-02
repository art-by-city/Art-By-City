import { injectable, inject } from 'inversify'

import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { User, UserService } from '../user'
import { AdminService } from './'

@injectable()
export default class AdminServiceImpl implements AdminService {
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

  saveUser(user: any): Promise<ApiServiceResult<void>> {
    return this.userService.saveUser(<User>user)
  }
}
