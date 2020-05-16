import { ContainerModule } from 'inversify'

import AdminServiceInterface from './service.interface'
import AdminService from './service'
import AdminControllerInterface from './controller.interface'
import AdminController from './controller'

export default new ContainerModule((bind) => {
  bind<AdminServiceInterface>(Symbol.for('AdminService')).to(AdminService)
  bind<AdminControllerInterface>(Symbol.for('AdminController')).to(
    AdminController
  )
})
