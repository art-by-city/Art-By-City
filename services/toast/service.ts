type AlertType = 'success' | 'info' | 'warning' | 'error'

interface ToastMessage {
  type: AlertType
  message: string
  show: boolean
}

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

class ToastService {
  toasts: ToastMessage[] = []

  alert(message: string, type: AlertType) {
    const toast = { message, type, show: true }
    this.toasts.push(toast)
    setTimeout(() => {
      toast.show = false
    }, TOAST_TIMEOUT_MS)
  }

  success(message: string) {
    this.alert(message, 'success')
  }

  info(message: string) {
    this.alert(message, 'info')
  }

  warning(message: string) {
    this.alert(message, 'warning')
  }

  error(message: string | AxiosError) {
    if (isAxiosError(message)) {
      return this.alert(message.response?.data?.error?.message, 'error')
    }

    return this.alert(message, 'error')
  }
}

export default new ToastService()
