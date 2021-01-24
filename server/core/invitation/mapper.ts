import { Invitation, InvitationViewModel } from './'
import EntityMapper from '../api/mapper'
import { UserViewModel } from '../user'

export default class InvitationMapper implements EntityMapper<Invitation, InvitationViewModel> {
  toViewModel(
    domainEntity: Invitation,
    createdBy?: UserViewModel,
    usedBy?: UserViewModel
  ): InvitationViewModel {
    return {
      id: domainEntity.id,
      created: domainEntity.created,
      updated: domainEntity.updated,
      createdByUser: createdBy ? createdBy : {
        id: domainEntity.createdByUser,
        username: 'user',
        name: '',
        city: 'city',
        roles: []
      },
      sent: domainEntity.sent,
      sentOn: domainEntity.sentOn,
      sentToEmail: domainEntity.sentToEmail,
      used: domainEntity.used,
      usedOn: domainEntity.usedOn,
      usedByUser: usedBy
    }
  }
}
