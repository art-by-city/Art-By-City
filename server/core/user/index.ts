import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'
import BaseRepositoryInterface from '../repository.interface'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import User from './user'
import UserRepositoryImpl from './repository'
import UserServiceImpl from './service'
import UserControllerImpl from './controller'

export { default as User } from './user'

export interface UserFilterOptions {}

export interface UserRepository
  extends BaseRepositoryInterface<User, UserFilterOptions> {
  getByUsername(username: string): Promise<User | null>
}

export interface UserService {
  register(req: any): Promise<User>
  authenticate(username: string, password: string): Promise<User | null>
  getById(id: string): Promise<User | null>
  updatePassword(id: string, password: string): Promise<ApiServiceResult<void>>
  listUsers(): Promise<User[]>
  setUserRoles(userId: string, roles: string[]): Promise<ApiServiceResult<void>>
  saveUser(user: any): Promise<ApiServiceResult<void>>
}

export interface UserController extends BaseControllerInterface {}

export const UserModule = new ContainerModule((bind) => {
  bind<UserRepository>(Symbol.for('UserRepository')).to(UserRepositoryImpl)
  bind<UserService>(Symbol.for('UserService')).to(UserServiceImpl)
  bind<UserController>(Symbol.for('UserController')).to(UserControllerImpl)
})
