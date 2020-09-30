import ViewModel from '../../api/viewModel'

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    UserAvatar:
 *      properties:
 *        source:
 *          type: string
 */
export interface UserAvatarViewModel extends ViewModel {
  source: string
}

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    User:
 *      required:
 *        - id
 *        - username
 *        - city
 *        - roles
 *      properties:
 *        id:
 *          type: string
 *        username:
 *          type: string
 *        city:
 *          type: string
 *        roles:
 *          type: array
 *          items:
 *            type: string
 *        avatar:
 *          type: object
 *          properties:
 *            source:
 *              type: string
 */
export default interface UserViewModel extends ViewModel {
  id: string
  username: string
  city: string
  roles: string[]
  avatar?: UserAvatarViewModel
}
