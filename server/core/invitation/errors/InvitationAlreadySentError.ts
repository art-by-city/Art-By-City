import ApiServiceError from '../../api/errors/apiServiceError.interface'

export default class InvitationAlreadySentError implements ApiServiceError {
  statusCode = 409
  name = this.constructor.name
  message = 'Invitation already sent to another user'

  constructor(message?: string) {
    if (message) {
      this.message = `${this.message}: ${message}`
    }
  }
}
