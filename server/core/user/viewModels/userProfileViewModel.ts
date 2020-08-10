import { UserViewModel } from '../'
import { Artwork } from '../../artwork'
import ViewModel from '../../api/viewModel'

export default interface UserProfileViewModel extends ViewModel {
  user: UserViewModel | null
  artworks: Artwork[]
}
