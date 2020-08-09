import { UserViewModel } from '../'
import { Artwork } from '../../artwork'

export default interface UserProfileViewModel {
  user: UserViewModel | null
  artworks: Artwork[]
}
