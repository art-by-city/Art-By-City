import { injectable, inject } from 'inversify'

import {
  Invitation,
  InvitationService,
  InvitationRepository
} from './'
import { User } from '../user'

@injectable()
export default class InvitationServiceImpl implements InvitationService {
  private invitationRepository: InvitationRepository

  constructor(
    @inject(Symbol.for('InvitationRepository'))
    invitationRepository: InvitationRepository
  ) {
    this.invitationRepository = invitationRepository
  }

  generate(user: User): Promise<Invitation | null> {
    const invitation = {
      id: '',
      created: new Date(),
      updated: new Date(),
      createdByUser: user.id,
    }

    return this.create(invitation)
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
