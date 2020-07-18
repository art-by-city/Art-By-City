import { UserEvent, UserEvents } from './'

export default class UserAccountResgisteredEvent extends UserEvent {
  constructor(userId: string) {
    super()
    this.userId = userId
    this.type = UserEvents.Account.Registered
  }
}
