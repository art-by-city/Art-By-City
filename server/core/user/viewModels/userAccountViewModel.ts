import UserViewModel from './userViewModel'

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    UserAccount:
 *      allOf:
 *        $ref: "#/components/schemas/User"
 *      properties:
 *        email:
 *          type: string
 *          required: true
 */
export default interface UserAccountViewModel extends UserViewModel {
  email: string
}
