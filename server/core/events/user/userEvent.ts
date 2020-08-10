import { Collection } from 'fireorm'

import { UserEventType } from './'
import Entity from '../../common/entity'

@Collection('UserEvents')
export default class UserEvent extends Entity {
  timestamp!: Date
  userId!: string
  type!: UserEventType

  constructor() {
    super()
    this.timestamp = new Date()
  }
}
