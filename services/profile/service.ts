import { Context } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

import ProgressService from '~/services/progress/service'
import ToastService from '~/services/toast/service'
import { UserAvatar } from '~/models/user/user'

export default class ProfileService {
  _context!: Context
  $axios!: NuxtAxiosInstance

  constructor(context: Context) {
    this._context = context
    this.$axios = context.$axios
  }

  // private encodeImageFile(image: File): Promise<any> { // TODO -> fix any type
  //   const fileReader = new FileReader()

  //   return new Promise<any>((resolve, reject) => {
  //     image.
  //   })
  // }
  private readFileAsBinaryStringAsync(file: File): Promise<string> {
    return new Promise((resolve, _reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(<string>reader.result)
      }
      reader.readAsBinaryString(file)
    })
  }

  async uploadUserAvatar(image: File): Promise<UserAvatar | undefined> {
    ProgressService.start()
    try {
      const { payload } = await this.$axios.$post('/api/user/avatar', {
        image: await this.readFileAsBinaryStringAsync(image),
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
