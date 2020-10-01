import ToastType from './toastType'

export default interface ToastMessage {
  timestamp: number
  type: ToastType
  message: string
  show: boolean
  timeout?: number
}
