import { Context } from '@nuxt/types'
import { PermissionType } from 'arconnect'

import { User } from '~/models'

export const APP_INFO = {
  name: 'Art x By x City',
  logo: 'logo/logo_by_daliah_ammar_square.png'
}

export const APP_PERMISSIONS: PermissionType[] = [
  'ACCESS_ADDRESS'
]

export default class Auth {
  private context!: Context
  user!: User
  loggedIn!: boolean

  constructor(context: Context) {
    this.context = context
  }

  init() {
    this.context.$axios.interceptors.request.use(async (config) => {

    })
  }

  login() {

  }

  logout() {

  }

  fetchUser() {

  }

  reset() {

  }
}
