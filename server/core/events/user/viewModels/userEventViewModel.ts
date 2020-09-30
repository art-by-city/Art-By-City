import ViewModel from '../../../api/viewModel'
import { UserViewModel } from '../../../user'

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    UserEvent:
 *      required:
 *        - id
 *        - timestamp
 *        - user
 *        - type
 *      properties:
 *        id:
 *          type: string
 *        timestamp:
 *          type: string
 *        user:
 *          $ref: "#/components/schemas/User"
 *        type:
 *          type: string
 */
export default interface UserEventViewModel {
  id: string
  timestamp: Date
  user: UserViewModel
  type: string
}
