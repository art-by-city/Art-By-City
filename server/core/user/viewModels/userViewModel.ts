import ViewModel from '../../api/viewModel'

export interface UserAvatarViewModel extends ViewModel {
  source: string
}

export default interface UserViewModel extends ViewModel {
  id: string
  username: string
  city: string
  roles: string[]
  avatar?: UserAvatarViewModel
}
