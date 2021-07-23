import { ContainerModule } from 'inversify'

import BaseControllerInterface from '../controller.interface'
import BaseApplicationServiceInterface from '../applicationService.interface'
import BaseRepositoryInterface from '../infra/repository.interface'
import BaseDomainServiceInterface from '../domainService.interface'
import Invitation from './invitation'
import InvitationViewModel from './viewModels/invitationViewModel'
import InvitationRepositoryImpl from './repository'
import InvitationServiceImpl from './service'
import InvitationApplicationServiceImpl from './appService'
import InvitationControllerImpl from './controller'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { User } from '../user'

export { default as Invitation } from './invitation'
export { default as InvitationViewModel } from './viewModels/invitationViewModel'

export interface InvitationFilterOptions {}

export interface InvitationRepository
  extends BaseRepositoryInterface<Invitation, InvitationFilterOptions> {}

export interface InvitationService
  extends BaseDomainServiceInterface<Invitation> {
    generate(user: User): Promise<Invitation | null>
  }

export interface InvitationApplicationService
  extends BaseApplicationServiceInterface {
    registerEvents(): void
    requestNewInvitation(req: any): Promise<ApiServiceResult<InvitationViewModel>>
    fetchInvitations(): Promise<ApiServiceResult<InvitationViewModel[]>>
    sendInvitationEmail(req: any): Promise<ApiServiceResult<InvitationViewModel>>
  }

export interface InvitationController
  extends BaseControllerInterface {}

export const InvitationModule = new ContainerModule((bind) => {
  bind<InvitationRepository>(Symbol.for('InvitationRepository'))
    .to(InvitationRepositoryImpl)
  bind<InvitationService>(Symbol.for('InvitationService'))
    .to(InvitationServiceImpl)
  bind<InvitationApplicationService>(Symbol.for('InvitationApplicationService'))
    .to(InvitationApplicationServiceImpl)
  bind<InvitationController>(Symbol.for('InvitationController'))
    .to(InvitationControllerImpl)
})
