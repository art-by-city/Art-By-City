import { Container } from 'inversify'

// Repositories
import AccountRepositoryInterface from './repositories/account/accountRepository.interface'
import LocalAccountRepository from './repositories/account/localAccountRepository'
import ArtworkRepositoryInterface from './repositories/artwork/artworkRepository.interface'
import ArtworkRepository from './repositories/artwork/artworkRepository'

// Domain Services
import ArtworkDomainServiceInterface from './services/domain/artwork/artworkDomainService.interface'
import ArtworkDomainService from './services/domain/artwork/artworkDomainService'

// Application Services
import AccountServiceInterface from './services/account/accountService.interface'
import LocalAccountService from './services/account/localAccountService'
import AdminServiceInterface from './services/admin/adminService.interface'
import AdminService from './services/admin/adminService'
import AuthServiceInterface from './services/auth/authService.interface'
import AuthService from './services/auth/authService'
import ArtworkServiceInterface from './services/application/artwork/artworkService.interface'
import ArtworkService from './services/application/artwork/artworkService'

// Controllers
import AuthControllerInterface from './api/controllers/auth/authController.interface'
import AuthController from './api/controllers/auth/authController'
import AdminControllerInterface from './api/controllers/admin/adminController.interface'
import AdminController from './api/controllers/admin/adminController'
import ArtworkControllerInterface from './api/controllers/artwork/artworkController.interface'
import ArtworkController from './api/controllers/artwork/artworkController'

const container = new Container()

// Repositories
container
  .bind<AccountRepositoryInterface>(Symbol.for('AccountRepository'))
  .to(LocalAccountRepository)
container
  .bind<ArtworkRepositoryInterface>(Symbol.for('ArtworkRepository'))
  .to(ArtworkRepository)

// Domain Services
container
  .bind<ArtworkDomainServiceInterface>(Symbol.for('ArtworkDomainService'))
  .to(ArtworkDomainService)

// Application Services
container.bind<AuthServiceInterface>(Symbol.for('AuthService')).to(AuthService)
container
  .bind<AccountServiceInterface>(Symbol.for('AccountService'))
  .to(LocalAccountService)
container
  .bind<AdminServiceInterface>(Symbol.for('AdminService'))
  .to(AdminService)
container
  .bind<ArtworkServiceInterface>(Symbol.for('ArtworkService'))
  .to(ArtworkService)

// Controllers
container
  .bind<AuthControllerInterface>(Symbol.for('AuthController'))
  .to(AuthController)
container
  .bind<AdminControllerInterface>(Symbol.for('AdminController'))
  .to(AdminController)
container
  .bind<ArtworkControllerInterface>(Symbol.for('ArtworkController'))
  .to(ArtworkController)

export { container }
