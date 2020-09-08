import ViewModel from '../../api/viewModel'
import { UserViewModel } from '../../user'

export default interface InvitationViewModel extends ViewModel {
  id: string
  created: Date
  updated: Date
  createdByUser: UserViewModel
  sent?: boolean
  sentOn?: Date
  used?: boolean
  usedOn?: Date
  usedByUser?: UserViewModel
}
