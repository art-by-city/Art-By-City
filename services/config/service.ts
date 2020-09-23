import { Context } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

import ProgressService from '~/services/progress/service'
import ToastService from '~/services/toast/service'

export default class ConfigService {
  _context!: Context
  $axios!: NuxtAxiosInstance
  $store!: any

  constructor(context: Context) {
    this._context = context
    this.$axios = context.$axios
    this.$store = context.store
  }

  async fetchAndSetStoreConfig(): Promise<void> {
    ProgressService.start()
    try {
      const config = await this.$axios.$get('/api/config')
      this.$store.commit('config/setConfig', config)
    } catch (error) {
      console.error(error)
      ToastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }
}
