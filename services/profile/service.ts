import { Context } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

import ProgressService from '~/services/progress/service'
import User, { UserAvatar } from '~/models/user/user'
import { readFileAsDataUrlAsync } from '~/helpers/helpers'

export default class ProfileService {
  _context!: Context
  $axios!: NuxtAxiosInstance

  constructor(context: Context) {
    this._context = context
    this.$axios = context.$axios
  }

  async uploadUserAvatar(image: File): Promise<UserAvatar | undefined> {
    ProgressService.start()
    try {
      const imgData = await readFileAsDataUrlAsync(image)
      const { payload } = await this.$axios.$post('/api/user/avatar', {
        image: imgData.split(',')[1],
        type: image.type
      })

      const _user = this._context.$auth.user
      if (payload && _user) {
        const user = { ..._user }
        // user.avatar = payload
        this._context.$auth.setUser(user)

        return payload
      }
    } catch (error) {
      this._context.$toastService.error(
        error.response.status === 413
          ? 'Avatar images must be less than 5MB'
          : error
      )
    } finally {
      ProgressService.stop()
    }
  }

  async updateProfile(user: User): Promise<boolean> {
    ProgressService.start()
    try {
      // await this.$axios.$post('/api/user/profile', {
      //   name: user.name
      // })

      return true
    } catch (error) {
      this._context.$toastService.error(error)
      return false
    } finally {
      ProgressService.stop()
    }
  }
}
