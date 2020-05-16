import { ContainerModule } from 'inversify'

import UserRepositoryInterface from './repository.interface'
import UserRepository from './repository'
import UserServiceInterface from './service.interface'
import UserService from './service'

export default new ContainerModule((bind) => {
  bind<UserRepositoryInterface>(Symbol.for('UserRepository')).to(UserRepository)
  bind<UserServiceInterface>(Symbol.for('UserService')).to(UserService)
})
