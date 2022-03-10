import { User } from '~/models'
import { PermissionType } from 'arconnect'

export const APP_INFO = {
  name: 'Art x By x City',
  logo: 'logo/logo_by_daliah_ammar_square.png'
}

export const APP_PERMISSIONS: PermissionType[] = [
  'ACCESS_ADDRESS'
]

export default class Auth {
  user!: User
  loggedIn!: boolean

  login() {

  }

  reset() {

  }
}
