import { NotificationType } from '~/app/ui'
import { uuidv4 } from '~/app/util'

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
