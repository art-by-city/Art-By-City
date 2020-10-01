import { Context } from '@nuxt/types'

import ToastType from '../../models/toasts/toastType'

interface AxiosError {
  response: {
    data: {
      error: {
        message: string
      }
    }
  }
}

function isAxiosError(thing: any): thing is AxiosError {
  return (thing as AxiosError).response !== undefined
}

const TOAST_TIMEOUT_MS = 5000

export default class ToastService {
  // toasts: ToastMessage[] = []
  _context!: Context

  constructor(context: Context) {
    this._context = context
  }

  toast(message: string, type: ToastType) {
    const toast = {
      message,
      type,
      show: true,
      timeout: TOAST_TIMEOUT_MS,
      timestamp: Date.now()
    }
    this._context.store.commit('toasts/add', toast)
    this._context.store.dispatch('toasts/destroyOnExpiration', toast)
    // setTimeout(() => {
    //   // toast.show = false
    //   this._context.store.dispatch('toasts/remove', toast)
    // }, TOAST_TIMEOUT_MS)

    // this.toasts.push(toast)
    // setTimeout(() => {
    //   toast.show = false
    // }, TOAST_TIMEOUT_MS)
  }

  success(message: string) {
    this.toast(message, 'success')
  }

  info(message: string) {
    this.toast(message, 'info')
  }

  warning(message: string) {
    this.toast(message, 'warning')
  }

  error(message: string | AxiosError) {
    if (isAxiosError(message)) {
      return this.toast(message.response?.data?.error?.message, 'error')
    }

    return this.toast(message, 'error')
  }
}
