import ApiServiceError from './apiServiceError.interface'

export default class InvalidEmailError implements ApiServiceError {
  statusCode = 409
  name = this.constructor.name
  message = 'Invalid email address'

  constructor(message?: string) {
    if (message) {
      this.message = `${this.message}: ${message}`
    }
  }
}