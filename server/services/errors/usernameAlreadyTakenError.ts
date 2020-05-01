import ApiServiceError from './apiServiceError.interface'

export default class UsernameAlreadyTakenError implements ApiServiceError {
  statusCode = 409
  name = this.constructor.name
  message = 'Username already taken'

  constructor(message?: string) {
    if (message) {
      this.message = `${this.message}: ${message}`
    }
  }
}
