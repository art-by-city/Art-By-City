import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import AdminServiceImpl from './service'
import AdminControllerImpl from './controller'
import { UserViewModel } from '../user'
import { CityViewModel } from '../city'
import { ArtworkViewModel } from '../artwork'

export interface AdminController extends BaseControllerInterface {}

export interface AdminService {
  listUsers(): Promise<ApiServiceResult<UserViewModel[]>>
  listCities(): Promise<ApiServiceResult<CityViewModel[]>>
  listArtwork(): Promise<ApiServiceResult<ArtworkViewModel[]>>
  setUserRoles(userId: string, roles: string[]): Promise<ApiServiceResult<void>>
  saveUser(user: any): Promise<ApiServiceResult<void>>
}

export const AdminModule = new ContainerModule((bind) => {
  bind<AdminService>(Symbol.for('AdminService')).to(AdminServiceImpl)
  bind<AdminController>(Symbol.for('AdminController')).to(AdminControllerImpl)
})
