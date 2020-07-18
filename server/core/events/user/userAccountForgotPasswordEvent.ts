import { UserEvent, UserEvents } from './'

export default class UserAccountForgotPasswordEvent extends UserEvent {
  constructor(userId: string) {
    super()
    this.userId = userId
    this.type = UserEvents.Account.ForgotPassword
  }
}
