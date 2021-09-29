import { NotificationType } from '~/types'
import { uuidv4 } from '~/helpers'

export default class Notification {
  guid: string = uuidv4()
  message: string = ''
  timestamp: number = new Date().getTime()
  read: false | number = false
  type!: NotificationType

  constructor(type: NotificationType) {
    this.type = type
  }
}
