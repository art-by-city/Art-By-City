import { Context } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

export default class TourService {
  _context!: Context
  $axios!: NuxtAxiosInstance

  private localStorageKeyPrefix = `axbxc-tour`

  constructor(context: Context) {
    this._context = context
    this.$axios = context.$axios
  }

  shouldShowTour(tourId: string) {
    if (!process.client || !this._context.$auth.loggedIn) {
      return false
    }

    try {
      return !this._context.$auth.$storage.getUniversal(
        `${this.localStorageKeyPrefix}-${tourId}`
      )
    } catch (error) {
      console.error(error)
    }
  }

  markTourSeen(tourId: string) {
    try {
      if (process.client && this._context.$auth.loggedIn) {
        this._context.$auth.$storage.setUniversal(
          `${this.localStorageKeyPrefix}-${tourId}`,
          'true'
        )
        const localUserToursSeen = this._context.$auth.$storage.getUniversal(
          `${this.localStorageKeyPrefix}-${tourId}`
        )
      }
    } catch (error) {
      console.error(error)
    }
  }
}
