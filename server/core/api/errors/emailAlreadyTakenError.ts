import ApiServiceError from './apiServiceError.interface'

export default class EmailAlreadyTakenError implements ApiServiceError {
  statusCode = 409
  name = this.constructor.name
  message = 'Email already taken'

  constructor(message?: string) {
    if (message) {
      this.message = `${this.message}: ${message}`
    }
  }
}
