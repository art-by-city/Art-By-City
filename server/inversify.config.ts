import { Container } from 'inversify'

// Repositories
import AccountRepositoryInterface from './repositories/account/accountRepository.interface'
import LocalAccountRepository from './repositories/account/localAccountRepository'

// Services
import AccountServiceInterface from './services/account/accountService.interface'
import LocalAccountService from './services/account/localAccountService'

import AdminServiceInterface from './services/admin/adminService.interface'
import AdminService from './services/admin/adminService'

import AuthServiceInterface from './services/auth/authService.interface'
import AuthService from './services/auth/authService'

// Controllers
import AuthControllerInterface from './api/controllers/auth/authController.interface'
import AuthController from './api/controllers/auth/authController'
import AdminControllerInterface from './api/controllers/admin/adminController.interface'
import AdminController from './api/controllers/admin/adminController'

const container = new Container()

// Repositories
container
  .bind<AccountRepositoryInterface>(Symbol.for('AccountRepository'))
  .to(LocalAccountRepository)

// Services
container
  .bind<AccountServiceInterface>(Symbol.for('AccountService'))
  .to(LocalAccountService)
container
  .bind<AdminServiceInterface>(Symbol.for('AdminService'))
  .to(AdminService)
container.bind<AuthServiceInterface>(Symbol.for('AuthService')).to(AuthService)

// Controllers
container
  .bind<AuthControllerInterface>(Symbol.for('AuthController'))
  .to(AuthController)
container
  .bind<AdminControllerInterface>(Symbol.for('AdminController'))
  .to(AdminController)

export { container }
