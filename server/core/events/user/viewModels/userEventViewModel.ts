import ViewModel from '../../../api/viewModel'
import { UserViewModel } from '../../../user'

export default interface UserEventViewModel {
  id: string
  timestamp: Date
  user: UserViewModel
  type: string
}
