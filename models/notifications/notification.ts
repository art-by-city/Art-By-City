import { NotificationType } from '~/types'
import { uuidv4 } from '~/helpers'

export default class Notification {
  guid!: string
  type!: NotificationType
  message!: string
  timestamp!: number

  constructor(type: NotificationType) {
    this.guid = uuidv4()
    this.timestamp = new Date().getTime()
    this.message = ''
    this.type = type
  }
}
