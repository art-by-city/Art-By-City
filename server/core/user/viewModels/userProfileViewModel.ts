import { UserViewModel } from '../'
import { ArtworkViewModel } from '../../artwork'
import ViewModel from '../../api/viewModel'

export default interface UserProfileViewModel extends ViewModel {
  user: UserViewModel | null
  artworks: ArtworkViewModel[]
}
