import { Context } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

import ProgressService from '~/services/progress/service'
import { UserAvatar } from '~/models/user/user'
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

      if (payload) {
        const user = { ...this._context.$auth.user }
        user.avatar = payload
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
}
