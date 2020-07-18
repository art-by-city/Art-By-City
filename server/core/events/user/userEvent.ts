import { Collection } from 'fireorm'

import { UserEventType } from './'

@Collection('UserEvents')
export default class UserEvent {
  id!: string
  timestamp!: Date
  userId!: string
  type!: UserEventType

  constructor() {
    this.timestamp = new Date()
  }
}
