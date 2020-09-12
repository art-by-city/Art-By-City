import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'
import BaseRepositoryInterface from '../repository.interface'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import User, { UserAvatar } from './user'
import UserViewModel, { UserAvatarViewModel }
  from './viewModels/userViewModel'
import UserAccountViewModel from './viewModels/userAccountViewModel'
import UserProfileViewModel from './viewModels/userProfileViewModel'
import UserRepositoryImpl from './repository'
import UserServiceImpl from './service'
import UserControllerImpl from './controller'
import UserApplicationServiceImpl from './appService'

export { default as User } from './user'
export { default as UserMapper } from './mapper'

export { default as UserViewModel } from './viewModels/userViewModel'
export { UserAvatarViewModel } from './viewModels/userViewModel'
export { default as UserAccountViewModel }
  from './viewModels/userAccountViewModel'
export { default as UserProfileViewModel }
  from './viewModels/userProfileViewModel'

export interface UserFilterOptions {}

export interface UserRepository
  extends BaseRepositoryInterface<User, UserFilterOptions> {
  getByUsername(username: string): Promise<User | null>
  getByEmail(email: string): Promise<User | null>
  incrementUserArtworkCount(userId: string): Promise<void>
  decrementUserArtworkCount(userId: string): Promise<void>
}

export interface UserService {
  register(req: any): Promise<UserViewModel>
  authenticate(username: string, password: string): Promise<User | null>
  getById(id: string): Promise<User | null>
  getByUsername(username: string): Promise<User | null>
  updatePassword(id: string, password: string):
    Promise<ApiServiceResult<void>>
  listUsers(): Promise<User[]>
  setUserRoles(userId: string, roles: string[]):
    Promise<ApiServiceResult<void>>
  saveUser(user: any): Promise<ApiServiceResult<void>>
  incrementUserArtworkCount(userId: string): Promise<void>
  decrementUserArtworkCount(userId: string): Promise<void>
  updateUserAvatar(userId: string, avatar: UserAvatar): Promise<boolean>
}

export interface UserApplicationService {
  registerEvents(): void
  getUserProfile(username: string):
    Promise<ApiServiceResult<UserProfileViewModel>>
  getUserAccount(id: string): Promise<ApiServiceResult<UserAccountViewModel>>
  uploadAvatar(user: User, imageData: string, imageType: string):
    Promise<ApiServiceResult<UserAvatarViewModel>>
}

export interface UserController extends BaseControllerInterface {}

export const UserModule = new ContainerModule((bind) => {
  bind<UserRepository>(Symbol.for('UserRepository'))
    .to(UserRepositoryImpl)
  bind<UserService>(Symbol.for('UserService'))
    .to(UserServiceImpl)
  bind<UserApplicationService>(Symbol.for('UserApplicationService'))
    .to(UserApplicationServiceImpl).inSingletonScope()
  bind<UserController>(Symbol.for('UserController'))
    .to(UserControllerImpl)
})
