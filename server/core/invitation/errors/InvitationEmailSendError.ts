import ApiServiceError from '../../api/errors/apiServiceError.interface'

export default class InvitationEmailSendError implements ApiServiceError {
  statusCode = 500
  name = this.constructor.name
  message = 'Error while sending invitation email'

  constructor(message?: string) {
    if (message) {
      this.message = `${this.message}: ${message}`
    }
  }
}
