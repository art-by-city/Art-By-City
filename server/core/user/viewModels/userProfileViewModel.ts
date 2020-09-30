import { UserViewModel } from '../'
import { ArtworkViewModel } from '../../artwork'
import ViewModel from '../../api/viewModel'

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    UserProfile:
 *      properties:
 *        user:
 *          $ref: "#/components/schemas/User"
 *        artworks:
 *          type: array
 *          items:
 *            $ref: "#/components/schemas/Artwork"
 */
export default interface UserProfileViewModel extends ViewModel {
  user: UserViewModel | null
  artworks: ArtworkViewModel[]
}
