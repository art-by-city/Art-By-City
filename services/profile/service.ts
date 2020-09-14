import { Context } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

import ProgressService from '~/services/progress/service'
import ToastService from '~/services/toast/service'
import { UserAvatar } from '~/models/user/user'
import { readFileAsBinaryStringAsync } from '~/helpers/helpers'

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
      const { payload } = await this.$axios.$post('/api/user/avatar', {
        image: await readFileAsBinaryStringAsync(image),
        type: image.type
      })

      if (payload) {
        const user = { ...this._context.$auth.user }
        user.avatar = payload
        this._context.$auth.setUser(user)

        return payload
      }
    } catch (error) {
      ToastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }
}