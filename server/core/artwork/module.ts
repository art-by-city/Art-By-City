import { ContainerModule } from 'inversify'

import ArtworkRepositoryInterface from './repository.interface'
import ArtworkRepository from './repository'
import ArtworkServiceInterface from './service.interface'
import ArtworkService from './service'
import ArtworkApplicationServiceInterface from './appService.interface'
import ArtworkApplicationService from './appService'
import ArtworkControllerInterface from './controller.interface'
import ArtworkController from './controller'

export default new ContainerModule((bind) => {
  bind<ArtworkRepositoryInterface>(Symbol.for('ArtworkRepository')).to(
    ArtworkRepository
  )
  bind<ArtworkServiceInterface>(Symbol.for('ArtworkService')).to(ArtworkService)
  bind<ArtworkApplicationServiceInterface>(
    Symbol.for('ArtworkApplicationService')
  ).to(ArtworkApplicationService)
  bind<ArtworkControllerInterface>(Symbol.for('ArtworkController')).to(
    ArtworkController
  )
})
