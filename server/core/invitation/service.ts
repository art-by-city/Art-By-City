import { injectable, inject } from 'inversify'

import {
  Invitation,
  InvitationService,
  InvitationRepository
} from './'

@injectable()
export default class InvitationServiceImpl implements InvitationService {
  private invitationRepository: InvitationRepository

  constructor(
    @inject(Symbol.for('InvitationRepository'))
    invitationRepository: InvitationRepository
  ) {
    this.invitationRepository = invitationRepository
  }

  create(invitation: Invitation): Promise<Invitation | null> {
    return this.invitationRepository.create(invitation)
  }

  get(id: string): Promise<Invitation | null> {
    return this.invitationRepository.get(id)
  }

  update(invitation: Invitation): Promise<Invitation | null> {
    return this.invitationRepository.update(invitation)
  }

  delete(id: string): Promise<void> {
    return this.invitationRepository.delete(id)
  }

  list(): Promise<Invitation[]> {
    return this.invitationRepository.list()
  }
}
