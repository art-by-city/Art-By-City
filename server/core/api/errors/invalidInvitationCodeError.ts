import ApiServiceError from './apiServiceError.interface'

export default class InvalidInvitationCodeError implements ApiServiceError {
  statusCode = 409
  name = this.constructor.name
  message = 'Invalid code or code already used'

  constructor(message?: string) {
    if (message) {
      this.message = `${this.message}: ${message}`
    }
  }
}
