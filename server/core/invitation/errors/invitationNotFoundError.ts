import ApiServiceError from '../../api/errors/apiServiceError.interface'

export default class InvitationNotFoundError implements ApiServiceError {
  statusCode = 404
  name = this.constructor.name
  message = 'Invitation not found'

  constructor(message?: string) {
    if (message) {
      this.message = `${this.message}: ${message}`
    }
  }
}
