import ApiServiceError from '../../api/errors/apiServiceError.interface'

export default class InvitationAlreadyUsedError implements ApiServiceError {
  statusCode = 409
  name = this.constructor.name
  message = 'Invitation already used'

  constructor(message?: string) {
    if (message) {
      this.message = `${this.message}: ${message}`
    }
  }
}
