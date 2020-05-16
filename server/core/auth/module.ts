import { ContainerModule } from 'inversify'

import AuthServiceInterface from './service.interface'
import AuthService from './service'
import AuthControllerInterface from './controller.interface'
import AuthController from './controller'

export default new ContainerModule((bind) => {
  bind<AuthServiceInterface>(Symbol.for('AuthService')).to(AuthService)
  bind<AuthControllerInterface>(Symbol.for('AuthController')).to(AuthController)
})
