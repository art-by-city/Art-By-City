import { UserViewModel } from '../../user'
import ApiServiceResult from './apiServiceResult.interface'

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    AuthenticationResult:
 *      properties:
 *        user:
 *          $ref: "#/components/schemas/User"
 *        token:
 *          type: string
 */
export interface AuthenticationResult extends ApiServiceResult<void> {
  user: UserViewModel | null
  token: string | null
}
