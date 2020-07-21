import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { User } from '../user'
import AdminServiceImpl from './service'
import AdminControllerImpl from './controller'
import { City } from '../city'

export interface AdminController extends BaseControllerInterface {}

export interface AdminService {
  listUsers(): Promise<User[]>
  listCities(): Promise<City[]>
  setUserRoles(userId: string, roles: string[]): Promise<ApiServiceResult<void>>
  saveUser(user: any): Promise<ApiServiceResult<void>>
}

export const AdminModule = new ContainerModule((bind) => {
  bind<AdminService>(Symbol.for('AdminService')).to(AdminServiceImpl)
  bind<AdminController>(Symbol.for('AdminController')).to(AdminControllerImpl)
})
