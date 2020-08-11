import ViewModel from '../../api/viewModel'

export default interface UserViewModel extends ViewModel {
  id: string
  username: string
  city: string
  roles: string[]
}
