import { ContainerModule } from 'inversify'

import UserRepositoryInterface from './repository.interface'
import UserRepository from './repository'
import UserServiceInterface from './service.interface'
import UserService from './service'
import UserControllerInterface from './controller.interface'
import UserController from './controller'

export default new ContainerModule((bind) => {
  bind<UserRepositoryInterface>(Symbol.for('UserRepository')).to(UserRepository)
  bind<UserServiceInterface>(Symbol.for('UserService')).to(UserService)
  bind<UserControllerInterface>(Symbol.for('UserController')).to(UserController)
})
